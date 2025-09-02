/**
 * Google Apps Script Web App for Executive Skills Assessment
 * This script receives assessment data via webhook and adds it to your Google Sheet
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create new project: "Executive Skills Assessment Webhook"
 * 3. Replace Code.gs content with this code
 * 4. Update SPREADSHEET_ID with your actual spreadsheet ID
 * 5. Deploy as web app with "Anyone" access
 * 6. Copy the web app URL and use as GOOGLE_SHEETS_WEBHOOK_URL
 */

// Your Google Sheets ID - UPDATE THIS!
const SPREADSHEET_ID = '1xnFF9gPsx9KO51E6SkMOcqyDISCEr_nsD6UkPdCMbTI';

/**
 * Handle POST requests from the assessment webhook
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('Assessment Results');
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Assessment Results');
      setupHeaders(sheet);
    }
    
    // Check if headers exist (first row should have "Timestamp")
    const firstCell = sheet.getRange(1, 1).getValue();
    if (!firstCell || firstCell !== 'Timestamp') {
      setupHeaders(sheet);
    }
    
    // Add the data row
    const rowData = formatDataForSheet(data);
    sheet.appendRow(rowData);
    
    // Log success
    console.log(`Assessment data added for student: ${data.studentName}`);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Assessment data saved for ${data.studentName}`,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing assessment data:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for testing
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Executive Skills Assessment Webhook Active',
      timestamp: new Date().toISOString(),
      spreadsheetId: SPREADSHEET_ID,
      message: 'Send POST requests with assessment data to this URL'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Set up column headers for the assessment results
 */
function setupHeaders(sheet) {
  const headers = [
    // Basic Information (A-E)
    'Timestamp', 'Student Name', 'Student Email', 'Grade Level', 'School',
    
    // Individual Questions Q1-Q33 (F-AK)
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
    'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 'Q19', 'Q20',
    'Q21', 'Q22', 'Q23', 'Q24', 'Q25', 'Q26', 'Q27', 'Q28', 'Q29', 'Q30',
    'Q31', 'Q32', 'Q33',
    
    // Category Scores (AL-AV)
    'Response Inhibition', 'Working Memory', 'Emotional Control', 'Flexibility',
    'Sustained Attention', 'Task Initiation', 'Planning/Prioritizing', 'Organization',
    'Time Management', 'Goal-Directed Persistence', 'Metacognition',
    
    // Analysis Results (AW-BB)
    'Overall Score', 'Strengths', 'Weaknesses', 'Strength Count', 'Weakness Count'
  ];
  
  // Set headers in first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log('Headers set up successfully');
}

/**
 * Format the incoming data for insertion into the spreadsheet
 */
function formatDataForSheet(data) {
  return [
    // Basic Information
    data.timestamp || new Date().toLocaleString(),
    data.studentName || '',
    data.studentEmail || '',
    data.gradeLevel || '',
    data.school || 'BCS Saints',
    
    // Individual Questions (Q1-Q33)
    data.q1 || 0, data.q2 || 0, data.q3 || 0, data.q4 || 0, data.q5 || 0,
    data.q6 || 0, data.q7 || 0, data.q8 || 0, data.q9 || 0, data.q10 || 0,
    data.q11 || 0, data.q12 || 0, data.q13 || 0, data.q14 || 0, data.q15 || 0,
    data.q16 || 0, data.q17 || 0, data.q18 || 0, data.q19 || 0, data.q20 || 0,
    data.q21 || 0, data.q22 || 0, data.q23 || 0, data.q24 || 0, data.q25 || 0,
    data.q26 || 0, data.q27 || 0, data.q28 || 0, data.q29 || 0, data.q30 || 0,
    data.q31 || 0, data.q32 || 0, data.q33 || 0,
    
    // Category Scores
    data.responseInhibition || 0,
    data.workingMemory || 0,
    data.emotionalControl || 0,
    data.flexibility || 0,
    data.sustainedAttention || 0,
    data.taskInitiation || 0,
    data.planningPrioritizing || 0,
    data.organization || 0,
    data.timeManagement || 0,
    data.goalDirectedPersistence || 0,
    data.metacognition || 0,
    
    // Analysis Results
    data.overallScore || 0,
    data.strengths || '',
    data.weaknesses || '',
    data.strengthCount || 0,
    data.weaknessCount || 0
  ];
}

/**
 * Test function to verify the webhook is working
 * Run this manually from the Apps Script editor to test
 */
function testWebhook() {
  const testData = {
    timestamp: new Date().toLocaleString(),
    studentName: 'Test Student',
    studentEmail: 'test@bcssaints.org',
    gradeLevel: '9th',
    school: 'BCS Saints',
    q1: 3, q2: 4, q3: 5, q4: 3, q5: 4, q6: 5, q7: 3, q8: 4, q9: 5, q10: 3,
    q11: 4, q12: 5, q13: 3, q14: 4, q15: 5, q16: 3, q17: 4, q18: 5, q19: 3,
    q20: 4, q21: 5, q22: 3, q23: 4, q24: 5, q25: 3, q26: 4, q27: 5, q28: 3,
    q29: 4, q30: 5, q31: 3, q32: 4, q33: 5,
    responseInhibition: 12,
    workingMemory: 13,
    emotionalControl: 15,
    flexibility: 12,
    sustainedAttention: 13,
    taskInitiation: 15,
    planningPrioritizing: 12,
    organization: 13,
    timeManagement: 15,
    goalDirectedPersistence: 12,
    metacognition: 13,
    overallScore: 13,
    strengths: 'Response Inhibition, Flexibility, Planning/Prioritizing',
    weaknesses: 'Emotional Control, Task Initiation, Time Management',
    strengthCount: 3,
    weaknessCount: 3
  };
  
  // Simulate the POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}