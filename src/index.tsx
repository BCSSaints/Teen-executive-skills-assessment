import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { questions, scaleLabels, calculateCategoryScores, analyzeResults, executiveSkillLabels, type ExecutiveSkill } from './questionnaire-data'

type Bindings = {
  DB: D1Database;
  RESEND_API_KEY?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use JSX renderer for HTML pages
app.use(renderer)

// Main assessment page
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <i className="fas fa-brain mr-3 text-indigo-600"></i>
            Executive Skills Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on "Smart but Scattered Teens" by Peg Dawson & Richard Guare
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              This assessment helps identify your executive functioning strengths and areas for growth. 
              Complete all 33 questions honestly, and you'll receive a detailed report.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            <i className="fas fa-clipboard-list mr-2 text-indigo-600"></i>
            Instructions
          </h2>
          <p className="text-gray-700 mb-4">
            Rate each item below based on how well it describes you, using this rating scale:
          </p>
          
          {/* Scale Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            {scaleLabels.map(scale => (
              <div key={scale.value} className="flex items-center bg-gray-50 p-2 rounded">
                <span className="font-bold text-indigo-600 mr-2">{scale.value}</span>
                <span className="text-sm text-gray-700">{scale.label}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600">
            <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
            <strong>Remember:</strong> Lower scores indicate strengths (areas where you function well), 
            while higher scores indicate areas that may need more attention or support.
          </p>
        </div>

        {/* Student Information Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            <i className="fas fa-user mr-2 text-indigo-600"></i>
            Student Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="studentName" 
                name="studentName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label for="studentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input 
                type="email" 
                id="studentEmail" 
                name="studentEmail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label for="gradeLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
              </label>
              <select 
                id="gradeLevel" 
                name="gradeLevel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select grade level</option>
                <option value="6th">6th Grade</option>
                <option value="7th">7th Grade</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>
            <div>
              <label for="school" className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <input 
                type="text" 
                id="school" 
                name="school"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your school name"
                value="BCS Saints"
              />
            </div>
          </div>
        </div>

        {/* Assessment Form */}
        <form id="assessmentForm" className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-tasks mr-2 text-indigo-600"></i>
              Assessment Questions
            </h2>
            
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-semibold text-sm mr-4 mt-1">
                      {question.id}
                    </span>
                    <p className="text-gray-800 text-lg leading-relaxed flex-1">
                      {question.text}
                    </p>
                  </div>
                  
                  <div className="ml-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
                      {scaleLabels.map(scale => (
                        <label key={scale.value} className="flex items-center bg-gray-50 hover:bg-indigo-50 p-3 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-indigo-200">
                          <input 
                            type="radio" 
                            name={`q${question.id}`} 
                            value={scale.value}
                            required
                            className="mr-3 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="font-semibold text-indigo-600">{scale.value}</div>
                            <div className="text-xs text-gray-600">{scale.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <button 
              type="submit" 
              id="submitBtn"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center text-lg"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Complete Assessment
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Your results will be calculated and emailed to mjackson@bcssaints.org
            </p>
          </div>
        </form>

        {/* Progress Indicator */}
        <div id="progressContainer" className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 hidden">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span id="progressText" className="text-indigo-600 font-semibold">0/33</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">Progress</div>
              <div className="w-24 h-2 bg-gray-200 rounded-full">
                <div id="progressBar" className="h-2 bg-indigo-600 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Elements */}
      <div id="achievementContainer" className="fixed top-16 right-4 z-40 space-y-2"></div>
      
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-200 rounded-full opacity-50 animate-ping" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-200 rounded-full opacity-30 animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-purple-200 rounded-full opacity-40 animate-ping" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-200 rounded-full opacity-35 animate-ping" style={{animationDelay: '6s'}}></div>
      </div>
      
      <script src="/static/sounds.js"></script>
      <script src="/static/assessment.js"></script>
    </div>
  )
})

// API endpoint to submit assessment
app.post('/api/submit-assessment', async (c) => {
  try {
    const body = await c.req.json()
    const { studentInfo, responses } = body
    
    // Validate required fields
    if (!studentInfo.name || !responses || Object.keys(responses).length !== 33) {
      return c.json({ error: 'Missing required information' }, 400)
    }

    // Calculate category scores
    const categoryScores = calculateCategoryScores(responses)
    const analysis = analyzeResults(categoryScores)
    
    const currentTime = new Date().toISOString()
    let assessmentId = null
    
    // Store in database
    const { env } = c
    if (env.DB) {
      // First create/update student record
      const studentResult = await env.DB.prepare(`
        INSERT OR REPLACE INTO students (name, email, grade_level, school)
        VALUES (?, ?, ?, ?)
      `).bind(
        studentInfo.name,
        studentInfo.email || null,
        studentInfo.gradeLevel || null,
        studentInfo.school || 'BCS Saints'
      ).run()

      // Insert assessment record
      const assessmentResult = await env.DB.prepare(`
        INSERT INTO assessments (
          student_id, student_name, student_email, student_grade,
          q1_response, q2_response, q3_response, q4_response, q5_response, q6_response,
          q7_response, q8_response, q9_response, q10_response, q11_response, q12_response,
          q13_response, q14_response, q15_response, q16_response, q17_response, q18_response,
          q19_response, q20_response, q21_response, q22_response, q23_response, q24_response,
          q25_response, q26_response, q27_response, q28_response, q29_response, q30_response,
          q31_response, q32_response, q33_response,
          response_inhibition_score, working_memory_score, emotional_control_score,
          flexibility_score, sustained_attention_score, task_initiation_score,
          planning_prioritizing_score, organization_score, time_management_score,
          goal_directed_persistence_score, metacognition_score,
          strength_areas, weakness_areas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        studentResult.meta?.last_row_id || 0,
        studentInfo.name,
        studentInfo.email || null,
        studentInfo.gradeLevel || null,
        ...Array.from({ length: 33 }, (_, i) => responses[i + 1] || 0),
        categoryScores.response_inhibition,
        categoryScores.working_memory,
        categoryScores.emotional_control,
        categoryScores.flexibility,
        categoryScores.sustained_attention,
        categoryScores.task_initiation,
        categoryScores.planning_prioritizing,
        categoryScores.organization,
        categoryScores.time_management,
        categoryScores.goal_directed_persistence,
        categoryScores.metacognition,
        JSON.stringify(analysis.strengths),
        JSON.stringify(analysis.weaknesses)
      ).run()

      assessmentId = assessmentResult.meta?.last_row_id || 0
    }

    // Send email report
    const { sendAssessmentReport } = await import('./email-service')
    
    const emailData = {
      studentName: studentInfo.name,
      studentEmail: studentInfo.email,
      gradeLevel: studentInfo.gradeLevel,
      categoryScores: Object.fromEntries(
        Object.entries(categoryScores).map(([key, value]) => [
          executiveSkillLabels[key as ExecutiveSkill], 
          value
        ])
      ),
      strengths: analysis.strengths.map(skill => executiveSkillLabels[skill]),
      weaknesses: analysis.weaknesses.map(skill => executiveSkillLabels[skill]),
      sortedScores: analysis.sortedScores.map(item => ({
        skill: executiveSkillLabels[item.skill],
        score: item.score
      })),
      completedAt: currentTime
    }

    const emailResult = await sendAssessmentReport(emailData, env.RESEND_API_KEY)
    
    // Log email attempt
    if (env.DB && assessmentId) {
      await env.DB.prepare(`
        INSERT INTO email_logs (assessment_id, recipient_email, subject, status, error_message)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        assessmentId,
        'mjackson@bcssaints.org',
        `Executive Skills Assessment Results - ${studentInfo.name}`,
        emailResult.success ? 'success' : 'error',
        emailResult.error || null
      ).run()
    }

    return c.json({
      success: true,
      results: {
        studentInfo,
        categoryScores,
        analysis: {
          strengths: analysis.strengths.map(skill => executiveSkillLabels[skill]),
          weaknesses: analysis.weaknesses.map(skill => executiveSkillLabels[skill]),
          sortedScores: analysis.sortedScores.map(item => ({
            skill: executiveSkillLabels[item.skill],
            score: item.score
          }))
        }
      },
      assessmentId,
      emailSent: emailResult.success,
      emailError: emailResult.error
    })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Results display page
app.get('/results/:id', async (c) => {
  const assessmentId = c.req.param('id')
  
  try {
    const { env } = c
    if (!env.DB) {
      throw new Error('Database not available')
    }

    const assessment = await env.DB.prepare(`
      SELECT * FROM assessments WHERE id = ?
    `).bind(assessmentId).first()

    if (!assessment) {
      return c.render(<div className="text-center py-16"><h1 className="text-2xl text-gray-600">Assessment not found</h1></div>)
    }

    // Parse stored analysis data
    const strengths = JSON.parse(assessment.strength_areas || '[]')
    const weaknesses = JSON.parse(assessment.weakness_areas || '[]')
    
    const categoryScores = {
      'Response Inhibition': assessment.response_inhibition_score,
      'Working Memory': assessment.working_memory_score,
      'Emotional Control': assessment.emotional_control_score,
      'Flexibility': assessment.flexibility_score,
      'Sustained Attention': assessment.sustained_attention_score,
      'Task Initiation': assessment.task_initiation_score,
      'Planning/Prioritizing': assessment.planning_prioritizing_score,
      'Organization': assessment.organization_score,
      'Time Management': assessment.time_management_score,
      'Goal-Directed Persistence': assessment.goal_directed_persistence_score,
      'Metacognition': assessment.metacognition_score
    }

    return c.render(
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <i className="fas fa-chart-bar mr-3 text-indigo-600"></i>
              Assessment Results
            </h1>
            <p className="text-lg text-gray-600">
              Executive Skills Assessment for <strong>{assessment.student_name}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Completed on {new Date(assessment.completed_at).toLocaleDateString()}
            </p>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                <i className="fas fa-check-circle mr-2"></i>
                Your Strengths
              </h2>
              <p className="text-gray-600 mb-4">Areas where you function well (lowest scores):</p>
              <div className="space-y-2">
                {strengths.map((strength: string, index: number) => (
                  <div key={index} className="flex items-center bg-green-50 p-3 rounded-lg">
                    <i className="fas fa-star text-green-500 mr-3"></i>
                    <span className="font-medium text-green-800">{executiveSkillLabels[strength as ExecutiveSkill] || strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Growth */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-orange-700 mb-4">
                <i className="fas fa-target mr-2"></i>
                Areas for Growth
              </h2>
              <p className="text-gray-600 mb-4">Areas that may benefit from support (highest scores):</p>
              <div className="space-y-2">
                {weaknesses.map((weakness: string, index: number) => (
                  <div key={index} className="flex items-center bg-orange-50 p-3 rounded-lg">
                    <i className="fas fa-arrow-up text-orange-500 mr-3"></i>
                    <span className="font-medium text-orange-800">{executiveSkillLabels[weakness as ExecutiveSkill] || weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              <i className="fas fa-chart-line mr-2 text-indigo-600"></i>
              Detailed Scores by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryScores).map(([category, score]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{category}</span>
                    <span className="font-bold text-lg text-indigo-600">{score}/21</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={`width: ${(score / 21) * 100}%`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {score <= 7 ? 'Strong area' : score <= 14 ? 'Moderate' : 'May need support'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center">
              <i className="fas fa-arrow-left mr-2"></i>
              Take Another Assessment
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading results:', error)
    return c.render(
      <div className="text-center py-16">
        <h1 className="text-2xl text-gray-600">Error loading results</h1>
        <p className="text-gray-500 mt-2">Please try again later</p>
      </div>
    )
  }
})

export default app
