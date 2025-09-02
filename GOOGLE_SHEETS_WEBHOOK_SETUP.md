# Google Sheets Webhook Integration - Simple Setup Guide

## 🎯 Overview
The easiest way to integrate Google Sheets with your Teen Executive Skills Assessment is using Google Apps Script as a webhook. This approach requires no complex authentication and works reliably.

## 🚀 Quick Setup (10 minutes)

### Step 1: Create Google Apps Script Webhook
1. **Go to:** https://script.google.com
2. **Click:** "New Project"
3. **Name it:** "Executive Skills Assessment Webhook"
4. **Replace the default Code.gs content** with the code from `google-apps-script-webhook.js`
5. **Update the SPREADSHEET_ID** in line 13:
   ```javascript
   const SPREADSHEET_ID = '1xnFF9gPsx9KO51E6SkMOcqyDISCEr_nsD6UkPdCMbTI';
   ```

### Step 2: Deploy as Web App
1. **Click:** "Deploy" → "New deployment"
2. **Type:** "Web app"
3. **Description:** "Executive Skills Assessment Data Handler"
4. **Execute as:** "Me"
5. **Who has access:** "Anyone" (this is safe - it only accepts assessment data)
6. **Click:** "Deploy"
7. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### Step 3: Configure Cloudflare Secret
```bash
echo "your-web-app-url-here" | npx wrangler pages secret put GOOGLE_SHEETS_WEBHOOK_URL --project-name executive-skills-assessment
```

### Step 4: Test Integration
1. **Visit:** https://your-assessment-url.pages.dev/api/test-sheets
2. **Check your Google Sheet** for test data
3. **Take a sample assessment** to verify live sync

## 📊 What Happens Automatically

### When Students Complete Assessments:
1. **Assessment data is sent** to your Google Apps Script webhook
2. **Script creates/updates** the "Assessment Results" sheet in your Google Sheets
3. **Headers are automatically added** if they don't exist
4. **Data is formatted and inserted** as a new row
5. **You can analyze results immediately** in Google Sheets

### Data Structure in Google Sheets:
| Column | Content |
|--------|---------|
| A-E | Basic info (timestamp, name, email, grade, school) |
| F-AK | Individual responses (Q1-Q33) |
| AL-AV | Category scores (11 executive skills) |
| AW-BB | Analysis results (overall score, strengths, weaknesses) |

## 🔧 Google Apps Script Code

The complete Google Apps Script code is in `google-apps-script-webhook.js`. Key features:

- **Automatic sheet creation** if it doesn't exist
- **Header setup** with proper formatting
- **Data validation** and error handling  
- **Test function** to verify setup
- **JSON response** for debugging

## ✅ Benefits of This Approach

### Simple Setup:
- ✅ No complex OAuth2 authentication
- ✅ No API key restrictions to worry about
- ✅ Works with any Google account
- ✅ Free to use (Google Apps Script limits are generous)

### Reliable Operation:
- ✅ Google Apps Script is highly reliable
- ✅ Automatic error handling and logging
- ✅ Scales with Google's infrastructure
- ✅ No maintenance required

### Easy Management:
- ✅ View/edit data directly in Google Sheets
- ✅ Create charts and pivot tables easily
- ✅ Share with staff members
- ✅ Export to Excel, CSV, PDF

## 🔍 Troubleshooting

### Common Issues:

**"Webhook not configured" error:**
- Check that `GOOGLE_SHEETS_WEBHOOK_URL` secret is set in Cloudflare
- Verify the webhook URL is correct and accessible

**"Permission denied" in Google Apps Script:**
- Make sure deployment access is set to "Anyone"
- Re-deploy if you made changes to the script

**Data not appearing in Google Sheets:**
- Check the Apps Script execution logs (View → Executions)
- Verify the SPREADSHEET_ID is correct in the script
- Make sure you have edit access to the Google Sheet

**Test endpoint fails:**
- Visit the webhook URL directly to see if it responds
- Check Cloudflare secret configuration
- Review browser developer console for network errors

### Google Apps Script Limits:
- **6 minutes per execution** (more than enough for assessment data)
- **20,000 triggers per day** (handles thousands of assessments)
- **100MB data transfer per day** (handles large volumes)

## 📱 Mobile and Security

- **HTTPS secure** - All data transfer is encrypted
- **No sensitive API keys** exposed in frontend
- **Google's security** protects the webhook
- **Works on all devices** - phones, tablets, computers

## 📞 Support

If you need help:
1. **Test the webhook URL** directly in your browser
2. **Check Google Apps Script logs** for error details
3. **Verify Cloudflare secrets** are properly set
4. **Contact technical support** if issues persist

---

**This webhook approach is the most reliable and easiest way to get your assessment data into Google Sheets!** 📊✨