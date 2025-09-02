# Google Sheets Integration Setup Guide

## 🎯 Overview
Your Teen Executive Skills Assessment now includes automatic Google Sheets synchronization! Every completed assessment will be automatically added to a Google Sheet for easy analysis and record-keeping.

## 📊 What Gets Synced to Google Sheets

### Student Information
- Date/Time completed
- Student name, email, grade level, school

### Individual Responses  
- All 33 question responses (Q1-Q33)
- Each rated 1-7 on the scale

### Category Scores
- Response Inhibition (Q1-Q3)
- Working Memory (Q4-Q6) 
- Emotional Control (Q7-Q9)
- Flexibility (Q10-Q12)
- Sustained Attention (Q13-Q15)
- Task Initiation (Q16-Q18)
- Planning/Prioritizing (Q19-Q21)
- Organization (Q22-Q24)
- Time Management (Q25-Q27)
- Goal-Directed Persistence (Q28-Q30)
- Metacognition (Q31-Q33)

### Analysis Results
- Overall average score
- Identified strengths (lowest scores)
- Areas for growth (highest scores)
- Count of strengths and weaknesses

## 🚀 Setup Instructions

### Step 1: Create Google Sheet
1. **Go to Google Sheets:** https://sheets.google.com
2. **Create a new blank spreadsheet**
3. **Name it:** "Executive Skills Assessment Results - BCS Saints"
4. **Copy the Spreadsheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part (long string of letters/numbers)

### Step 2: Get Google Sheets API Key
1. **Go to Google Cloud Console:** https://console.cloud.google.com
2. **Create a new project** (or select existing):
   - Project name: "BCS Saints Assessments"
3. **Enable Google Sheets API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - **Copy the API key** (keep it secure!)
5. **Restrict the API Key (IMPORTANT for security):**
   - Click on your API key to edit it
   - Under "API restrictions" → "Restrict key"
   - Select "Google Sheets API"
   - Save changes

### Step 3: Make Google Sheet Accessible
1. **Open your Google Sheet**
2. **Click "Share" button** (top right)
3. **Change permissions:**
   - Click "Change to anyone with the link"
   - Set to "Viewer" (not Editor)
   - This allows the API to read the sheet structure

### Step 4: Configure Cloudflare Secrets
1. **Add your API key as a Cloudflare secret:**
   ```bash
   echo "your-google-api-key-here" | npx wrangler pages secret put GOOGLE_SHEETS_API_KEY --project-name executive-skills-assessment
   ```

2. **Add your Spreadsheet ID as a secret:**
   ```bash
   echo "your-spreadsheet-id-here" | npx wrangler pages secret put GOOGLE_SHEETS_ID --project-name executive-skills-assessment
   ```

### Step 5: Test the Integration
1. **Visit the test endpoint:** https://your-assessment-url.pages.dev/api/test-sheets
2. **Check for success message** and verify test data appears in your Google Sheet
3. **Take a sample assessment** to confirm live sync is working

## 📋 Example Google Sheet Structure

Your sheet will automatically be formatted with these columns:

| A | B | C | D | E | F-AK | AL-AV | AW | AX | AY |
|---|---|---|---|---|------|-------|----|----|-----|
| Date | Name | Email | Grade | School | Q1-Q33 | Category Scores | Overall | Strengths | Weaknesses |

## 🔧 Troubleshooting

### Common Issues:

**"Google Sheets not configured" error:**
- Check that both `GOOGLE_SHEETS_API_KEY` and `GOOGLE_SHEETS_ID` secrets are set
- Verify the API key is valid and has Google Sheets API access

**"Permission denied" error:**
- Make sure your Google Sheet is shared with "Anyone with the link can view"
- Check that your API key has Google Sheets API enabled

**"Spreadsheet not found" error:**
- Verify the Spreadsheet ID is correct (long string from the URL)
- Make sure the sheet still exists and is accessible

**Headers not appearing:**
- The system automatically creates headers on first use
- If issues persist, manually add the headers as shown in the structure above

### API Limits:
- Google Sheets API has a limit of 300 requests per minute per project
- For high-volume usage, consider implementing request queuing
- Monitor usage in Google Cloud Console

## 🎯 Benefits of Google Sheets Integration

### For Administrators:
- **Real-time data** - See results as assessments are completed
- **Easy analysis** - Use Google Sheets' built-in charts and pivot tables
- **Data export** - Download as Excel, CSV, or PDF
- **Collaboration** - Share with teachers, counselors, administrators
- **Historical tracking** - See trends over time

### For Teachers:
- **Class overview** - See all students' results in one place
- **Identify patterns** - Spot common areas needing support
- **Parent conferences** - Easy data access for discussions
- **IEP/504 planning** - Data for special education planning

### For School Leadership:
- **Program evaluation** - Assess effectiveness of interventions
- **Resource allocation** - Identify where support is most needed
- **Reporting** - Generate reports for board meetings
- **Compliance** - Maintain records for accreditation

## 🔒 Security & Privacy

- API keys are stored securely as Cloudflare secrets
- Google Sheets access is read-only for the public
- No sensitive data is exposed beyond what you choose to share
- All communication uses HTTPS encryption
- Follow your school's data privacy policies for student information

## 📞 Support

If you need help with setup:
1. **Technical issues:** Check the troubleshooting section above
2. **Google Cloud setup:** Refer to Google's documentation
3. **Assessment questions:** Contact mjackson@bcssaints.org

---

**Your Teen Executive Skills Assessment now has powerful data analysis capabilities through Google Sheets integration!** 📊✨