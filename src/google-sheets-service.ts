// Google Sheets Integration for Executive Skills Assessment
// Automatically syncs assessment results to Google Sheets for easy analysis

export interface SheetSyncData {
  studentName: string;
  studentEmail?: string;
  gradeLevel?: string;
  school?: string;
  completedAt: string;
  
  // Individual question responses (1-33)
  responses: Record<number, number>;
  
  // Category scores
  responseInhibition: number;
  workingMemory: number;
  emotionalControl: number;
  flexibility: number;
  sustainedAttention: number;
  taskInitiation: number;
  planningPrioritizing: number;
  organization: number;
  timeManagement: number;
  goalDirectedPersistence: number;
  metacognition: number;
  
  // Analysis results
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
}

// Google Sheets API configuration
interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey?: string;
  serviceAccountKey?: string;
}

export class GoogleSheetsSync {
  private config: GoogleSheetsConfig;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  /**
   * Sync assessment data to Google Sheets
   */
  async syncAssessmentData(data: SheetSyncData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Starting Google Sheets sync for:', data.studentName);

      // Prepare row data for the spreadsheet
      const rowData = this.formatRowData(data);
      
      // First, ensure headers exist
      await this.ensureHeaders();
      
      // Append the new row
      const appendResult = await this.appendRow(rowData);
      
      if (appendResult.success) {
        console.log('Successfully synced to Google Sheets');
        return { success: true };
      } else {
        console.error('Failed to append row to Google Sheets:', appendResult.error);
        return { success: false, error: appendResult.error };
      }
      
    } catch (error) {
      console.error('Google Sheets sync error:', error);
      return { 
        success: false, 
        error: `Google Sheets sync failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Format assessment data into spreadsheet row format
   */
  private formatRowData(data: SheetSyncData): any[] {
    const formattedDate = new Date(data.completedAt).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return [
      // Basic Info
      formattedDate,                    // A: Date Completed
      data.studentName,                 // B: Student Name  
      data.studentEmail || '',          // C: Student Email
      data.gradeLevel || '',            // D: Grade Level
      data.school || 'BCS Saints',      // E: School
      
      // Individual Question Responses (F-AK: Q1-Q33)
      ...Array.from({ length: 33 }, (_, i) => data.responses[i + 1] || 0),
      
      // Category Scores (AL-AV)
      data.responseInhibition,          // AL: Response Inhibition
      data.workingMemory,              // AM: Working Memory
      data.emotionalControl,           // AN: Emotional Control
      data.flexibility,                // AO: Flexibility
      data.sustainedAttention,         // AP: Sustained Attention
      data.taskInitiation,             // AQ: Task Initiation
      data.planningPrioritizing,       // AR: Planning/Prioritizing
      data.organization,               // AS: Organization
      data.timeManagement,             // AT: Time Management
      data.goalDirectedPersistence,    // AU: Goal-Directed Persistence
      data.metacognition,              // AV: Metacognition
      
      // Analysis Results (AW-AZ)
      data.overallScore,               // AW: Overall Score
      data.strengths.join(', '),       // AX: Strengths
      data.weaknesses.join(', '),      // AY: Weaknesses
      data.strengths.length,           // AZ: Number of Strengths
      data.weaknesses.length           // BA: Number of Weaknesses
    ];
  }

  /**
   * Ensure the spreadsheet has proper headers
   */
  private async ensureHeaders(): Promise<void> {
    const headers = [
      // Basic Information
      'Date Completed', 'Student Name', 'Student Email', 'Grade Level', 'School',
      
      // Individual Questions (Q1-Q33)
      ...Array.from({ length: 33 }, (_, i) => `Q${i + 1}`),
      
      // Category Scores
      'Response Inhibition', 'Working Memory', 'Emotional Control', 'Flexibility',
      'Sustained Attention', 'Task Initiation', 'Planning/Prioritizing', 'Organization', 
      'Time Management', 'Goal-Directed Persistence', 'Metacognition',
      
      // Analysis Results  
      'Overall Score', 'Strengths', 'Weaknesses', 'Strength Count', 'Weakness Count'
    ];

    try {
      // Check if headers already exist by trying to read the first row
      const range = 'Sheet1!A1:BA1';
      const response = await this.makeApiRequest(`/${this.config.spreadsheetId}/values/${range}`);
      
      if (!response.values || response.values.length === 0 || response.values[0].length === 0) {
        // Headers don't exist, create them
        await this.updateRange('Sheet1!A1:BA1', [headers]);
        console.log('Created headers in Google Sheet');
      }
    } catch (error) {
      console.log('Creating headers in Google Sheet (first time setup)');
      await this.updateRange('Sheet1!A1:BA1', [headers]);
    }
  }

  /**
   * Append a new row to the spreadsheet
   */
  private async appendRow(rowData: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const range = 'Sheet1!A:BA';
      const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}:append`;
      
      const body = {
        range: range,
        majorDimension: 'ROWS',
        values: [rowData]
      };

      const response = await fetch(`${url}?valueInputOption=USER_ENTERED&key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Row appended successfully:', result.updates);
        return { success: true };
      } else {
        const error = await response.text();
        console.error('Failed to append row:', response.status, error);
        return { success: false, error: `HTTP ${response.status}: ${error}` };
      }
    } catch (error) {
      console.error('Error appending row:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update a specific range in the spreadsheet
   */
  private async updateRange(range: string, values: any[][]): Promise<void> {
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}`;
    
    const body = {
      range: range,
      majorDimension: 'ROWS', 
      values: values
    };

    const response = await fetch(`${url}?valueInputOption=USER_ENTERED&key=${this.config.apiKey}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update range: ${response.status} ${error}`);
    }
  }

  /**
   * Make a GET request to the Google Sheets API
   */
  private async makeApiRequest(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}?key=${this.config.apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.status} ${error}`);
    }
    
    return await response.json();
  }

  /**
   * Create a new spreadsheet for assessments (optional utility method)
   */
  static async createAssessmentSpreadsheet(apiKey: string, title: string = 'Executive Skills Assessment Results'): Promise<{ spreadsheetId: string; url: string }> {
    // This would require OAuth2 authentication for creation
    // For now, users should create the spreadsheet manually and provide the ID
    throw new Error('Please create a Google Sheet manually and provide the Spreadsheet ID');
  }

  /**
   * Get spreadsheet URL for sharing
   */
  getSpreadsheetUrl(): string {
    return `https://docs.google.com/spreadsheets/d/${this.config.spreadsheetId}/edit`;
  }
}

/**
 * Initialize Google Sheets sync with environment variables
 */
export function initializeGoogleSheetsSync(env: any): GoogleSheetsSync | null {
  if (!env.GOOGLE_SHEETS_API_KEY || !env.GOOGLE_SHEETS_ID) {
    console.log('Google Sheets not configured - missing API key or spreadsheet ID');
    return null;
  }

  return new GoogleSheetsSync({
    spreadsheetId: env.GOOGLE_SHEETS_ID,
    apiKey: env.GOOGLE_SHEETS_API_KEY
  });
}

/**
 * Convert assessment data to Google Sheets format
 */
export function convertToSheetFormat(
  studentInfo: any,
  responses: Record<number, number>,
  categoryScores: any,
  analysis: any,
  completedAt: string
): SheetSyncData {
  // Calculate overall score (average of all categories)
  const scores = Object.values(categoryScores) as number[];
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  return {
    studentName: studentInfo.name,
    studentEmail: studentInfo.email,
    gradeLevel: studentInfo.gradeLevel,
    school: studentInfo.school || 'BCS Saints',
    completedAt,
    responses,
    responseInhibition: categoryScores.response_inhibition,
    workingMemory: categoryScores.working_memory,
    emotionalControl: categoryScores.emotional_control,
    flexibility: categoryScores.flexibility,
    sustainedAttention: categoryScores.sustained_attention,
    taskInitiation: categoryScores.task_initiation,
    planningPrioritizing: categoryScores.planning_prioritizing,
    organization: categoryScores.organization,
    timeManagement: categoryScores.time_management,
    goalDirectedPersistence: categoryScores.goal_directed_persistence,
    metacognition: categoryScores.metacognition,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    overallScore
  };
}