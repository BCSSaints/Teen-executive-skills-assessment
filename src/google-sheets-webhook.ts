// Google Sheets Integration via Google Apps Script Web App
// This approach uses a Google Apps Script webhook which is much easier to set up
// and doesn't require complex OAuth2 authentication

export interface SheetWebhookData {
  timestamp: string;
  studentName: string;
  studentEmail?: string;
  gradeLevel?: string;
  school?: string;
  
  // Individual question responses
  q1: number; q2: number; q3: number; q4: number; q5: number;
  q6: number; q7: number; q8: number; q9: number; q10: number;
  q11: number; q12: number; q13: number; q14: number; q15: number;
  q16: number; q17: number; q18: number; q19: number; q20: number;
  q21: number; q22: number; q23: number; q24: number; q25: number;
  q26: number; q27: number; q28: number; q29: number; q30: number;
  q31: number; q32: number; q33: number;
  
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
  
  // Analysis
  overallScore: number;
  strengths: string;
  weaknesses: string;
  strengthCount: number;
  weaknessCount: number;
}

/**
 * Send data to Google Sheets via Google Apps Script Web App
 */
export async function sendToGoogleSheets(
  data: SheetWebhookData,
  webhookUrl?: string
): Promise<{ success: boolean; error?: string }> {
  
  if (!webhookUrl) {
    console.log('Google Sheets webhook not configured - GOOGLE_SHEETS_WEBHOOK_URL not provided');
    return { 
      success: false, 
      error: 'Google Sheets webhook not configured. Please set GOOGLE_SHEETS_WEBHOOK_URL environment variable.' 
    };
  }

  try {
    console.log('Sending assessment data to Google Sheets webhook for:', data.studentName);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.text();
      console.log('Successfully sent data to Google Sheets:', result);
      return { success: true };
    } else {
      const error = await response.text();
      console.error('Failed to send to Google Sheets:', response.status, error);
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${error}` 
      };
    }
  } catch (error) {
    console.error('Google Sheets webhook error:', error);
    return { 
      success: false, 
      error: `Google Sheets webhook error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Convert assessment data to webhook format
 */
export function convertToWebhookFormat(
  studentInfo: any,
  responses: Record<number, number>,
  categoryScores: any,
  analysis: any,
  completedAt: string
): SheetWebhookData {
  // Calculate overall score (average of all categories)
  const scores = Object.values(categoryScores) as number[];
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  const formattedDate = new Date(completedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York'  // Adjust for your timezone
  });

  return {
    timestamp: formattedDate,
    studentName: studentInfo.name,
    studentEmail: studentInfo.email || '',
    gradeLevel: studentInfo.gradeLevel || '',
    school: studentInfo.school || 'BCS Saints',
    
    // Individual responses
    q1: responses[1] || 0, q2: responses[2] || 0, q3: responses[3] || 0,
    q4: responses[4] || 0, q5: responses[5] || 0, q6: responses[6] || 0,
    q7: responses[7] || 0, q8: responses[8] || 0, q9: responses[9] || 0,
    q10: responses[10] || 0, q11: responses[11] || 0, q12: responses[12] || 0,
    q13: responses[13] || 0, q14: responses[14] || 0, q15: responses[15] || 0,
    q16: responses[16] || 0, q17: responses[17] || 0, q18: responses[18] || 0,
    q19: responses[19] || 0, q20: responses[20] || 0, q21: responses[21] || 0,
    q22: responses[22] || 0, q23: responses[23] || 0, q24: responses[24] || 0,
    q25: responses[25] || 0, q26: responses[26] || 0, q27: responses[27] || 0,
    q28: responses[28] || 0, q29: responses[29] || 0, q30: responses[30] || 0,
    q31: responses[31] || 0, q32: responses[32] || 0, q33: responses[33] || 0,
    
    // Category scores
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
    
    // Analysis results
    overallScore,
    strengths: analysis.strengths.join(', '),
    weaknesses: analysis.weaknesses.join(', '),
    strengthCount: analysis.strengths.length,
    weaknessCount: analysis.weaknesses.length
  };
}

/**
 * Initialize Google Sheets webhook with environment variables
 */
export function initializeGoogleSheetsWebhook(env: any): string | null {
  if (!env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.log('Google Sheets webhook not configured - missing GOOGLE_SHEETS_WEBHOOK_URL');
    return null;
  }
  
  return env.GOOGLE_SHEETS_WEBHOOK_URL;
}