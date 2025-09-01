// Email Service Integration for Executive Skills Assessment
// This will use Resend API to send professional reports

export interface EmailData {
  studentName: string;
  studentEmail?: string;
  gradeLevel?: string;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  sortedScores: Array<{ skill: string; score: number }>;
  completedAt: string;
}

export async function sendAssessmentReport(
  emailData: EmailData,
  resendApiKey?: string
): Promise<{ success: boolean; error?: string }> {
  
  if (!resendApiKey) {
    console.log('Email service not configured - RESEND_API_KEY not provided');
    return { 
      success: false, 
      error: 'Email service not configured. Please set RESEND_API_KEY environment variable.' 
    };
  }

  try {
    const emailContent = generateEmailHTML(emailData);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Executive Skills Assessment <noreply@bcssaints.org>',
        to: ['mjackson@bcssaints.org', 'forms@bcssaints.org'],
        subject: `Executive Skills Assessment Results - ${emailData.studentName}`,
        html: emailContent,
        reply_to: 'mjackson@bcssaints.org'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully:', result.id);
      return { success: true };
    } else {
      console.error('Email send failed:', result);
      return { 
        success: false, 
        error: result.message || 'Failed to send email' 
      };
    }
  } catch (error) {
    console.error('Email service error:', error);
    return { 
      success: false, 
      error: `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

function generateEmailHTML(data: EmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Executive Skills Assessment Results</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
        }
        
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .student-info {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #3b82f6;
        }
        
        .results-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .strength-card, .weakness-card {
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .strength-card {
            background: #f0fdf4;
            border-color: #22c55e;
        }
        
        .weakness-card {
            background: #fff7ed;
            border-color: #f59e0b;
        }
        
        .strength-title {
            color: #16a34a;
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .weakness-title {
            color: #d97706;
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .strength-item, .weakness-item {
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 15px;
            border-radius: 6px;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .strength-item {
            color: #166534;
            border-left: 3px solid #22c55e;
        }
        
        .weakness-item {
            color: #92400e;
            border-left: 3px solid #f59e0b;
        }
        
        .scores-section {
            margin-top: 30px;
        }
        
        .scores-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .scores-table th {
            background: #4f46e5;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        .scores-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .scores-table tr:last-child td {
            border-bottom: none;
        }
        
        .score-bar {
            background: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .score-fill {
            height: 100%;
            background: #4f46e5;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .interpretation {
            background: #eff6ff;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        
        .interpretation h3 {
            color: #1e40af;
            margin-top: 0;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #64748b;
            font-size: 14px;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        @media (max-width: 600px) {
            .results-grid {
                grid-template-columns: 1fr;
            }
            
            body {
                padding: 10px;
            }
            
            .header, .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🧠 Executive Skills Assessment</div>
        <h1 style="margin: 0; font-size: 28px;">Assessment Results Report</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Based on "Smart but Scattered Teens" by Peg Dawson & Richard Guare</p>
    </div>

    <div class="content">
        <div class="student-info">
            <h2 style="margin-top: 0; color: #1e40af;">Student Information</h2>
            <p><strong>Name:</strong> ${data.studentName}</p>
            ${data.gradeLevel ? `<p><strong>Grade Level:</strong> ${data.gradeLevel}</p>` : ''}
            ${data.studentEmail ? `<p><strong>Email:</strong> ${data.studentEmail}</p>` : ''}
            <p><strong>Assessment Completed:</strong> ${new Date(data.completedAt).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            })}</p>
        </div>

        <div class="results-grid">
            <div class="strength-card">
                <div class="strength-title">
                    ⭐ Executive Skills Strengths
                </div>
                <p style="margin-bottom: 15px; color: #166534; font-size: 14px;">
                    Areas where the student functions well (lowest scores indicate better functioning):
                </p>
                ${data.strengths.map(strength => 
                    `<div class="strength-item">${strength}</div>`
                ).join('')}
            </div>

            <div class="weakness-card">
                <div class="weakness-title">
                    🎯 Areas for Growth
                </div>
                <p style="margin-bottom: 15px; color: #92400e; font-size: 14px;">
                    Areas that may benefit from additional support and intervention:
                </p>
                ${data.weaknesses.map(weakness => 
                    `<div class="weakness-item">${weakness}</div>`
                ).join('')}
            </div>
        </div>

        <div class="scores-section">
            <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                📊 Detailed Scores by Executive Skill Category
            </h3>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
                Each category is scored from 3-21 (sum of three questions, each rated 1-7). 
                Lower scores indicate areas of strength, while higher scores suggest areas needing support.
            </p>
            
            <table class="scores-table">
                <thead>
                    <tr>
                        <th>Executive Skill Category</th>
                        <th>Score</th>
                        <th>Interpretation</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.sortedScores.map(item => {
                        const percentage = (item.score / 21) * 100;
                        let interpretation;
                        let interpretationColor;
                        
                        if (item.score <= 7) {
                            interpretation = 'Strong area';
                            interpretationColor = '#16a34a';
                        } else if (item.score <= 14) {
                            interpretation = 'Moderate functioning';
                            interpretationColor = '#d97706';
                        } else {
                            interpretation = 'May need support';
                            interpretationColor = '#dc2626';
                        }
                        
                        return `
                            <tr>
                                <td style="font-weight: 500;">${item.skill}</td>
                                <td>
                                    <strong>${item.score}/21</strong>
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${percentage}%;"></div>
                                    </div>
                                </td>
                                <td style="color: ${interpretationColor}; font-weight: 500;">
                                    ${interpretation}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="interpretation">
            <h3>📋 Understanding the Results</h3>
            <div style="margin-bottom: 15px;">
                <h4 style="color: #1e40af; margin-bottom: 8px;">Scoring Interpretation:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li><strong>3-7 points:</strong> Strong area - Student functions well in this executive skill</li>
                    <li><strong>8-14 points:</strong> Moderate functioning - Some variability or inconsistency</li>
                    <li><strong>15-21 points:</strong> May need support - Consider targeted interventions</li>
                </ul>
            </div>
            
            <div>
                <h4 style="color: #1e40af; margin-bottom: 8px;">Next Steps:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Focus intervention efforts on the highest-scoring (weakest) areas</li>
                    <li>Leverage strengths to support areas needing improvement</li>
                    <li>Consider environmental modifications and teaching strategies</li>
                    <li>Monitor progress with regular check-ins and reassessment</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>
            This report was generated by the Executive Skills Assessment System<br>
            For questions or follow-up, please contact: mjackson@bcssaints.org<br>
            <strong>BCS Saints - Supporting Student Success</strong>
        </p>
        <p style="font-size: 12px; margin-top: 15px; color: #94a3b8;">
            Assessment based on research by Peg Dawson and Richard Guare<br>
            "Executive Skills in Children and Adolescents" & "Smart but Scattered Teens"
        </p>
    </div>
</body>
</html>
  `;
}