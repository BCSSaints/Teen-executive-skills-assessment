-- Executive Skills Assessment Database Schema

-- Students table to store basic student information
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  grade_level TEXT,
  school TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table to store individual assessment attempts
CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT,
  student_grade TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Store individual question responses (1-7 scale)
  q1_response INTEGER NOT NULL, -- Response inhibition
  q2_response INTEGER NOT NULL,
  q3_response INTEGER NOT NULL,
  
  q4_response INTEGER NOT NULL, -- Working memory  
  q5_response INTEGER NOT NULL,
  q6_response INTEGER NOT NULL,
  
  q7_response INTEGER NOT NULL, -- Emotional control
  q8_response INTEGER NOT NULL,
  q9_response INTEGER NOT NULL,
  
  q10_response INTEGER NOT NULL, -- Flexibility
  q11_response INTEGER NOT NULL,
  q12_response INTEGER NOT NULL,
  
  q13_response INTEGER NOT NULL, -- Sustained attention
  q14_response INTEGER NOT NULL,
  q15_response INTEGER NOT NULL,
  
  q16_response INTEGER NOT NULL, -- Task initiation
  q17_response INTEGER NOT NULL,
  q18_response INTEGER NOT NULL,
  
  q19_response INTEGER NOT NULL, -- Planning/prioritizing
  q20_response INTEGER NOT NULL,
  q21_response INTEGER NOT NULL,
  
  q22_response INTEGER NOT NULL, -- Organization
  q23_response INTEGER NOT NULL,
  q24_response INTEGER NOT NULL,
  
  q25_response INTEGER NOT NULL, -- Time management
  q26_response INTEGER NOT NULL,
  q27_response INTEGER NOT NULL,
  
  q28_response INTEGER NOT NULL, -- Goal-directed persistence
  q29_response INTEGER NOT NULL,
  q30_response INTEGER NOT NULL,
  
  q31_response INTEGER NOT NULL, -- Metacognition
  q32_response INTEGER NOT NULL,
  q33_response INTEGER NOT NULL,
  
  -- Calculated category scores (sum of 3 questions each, range 3-21)
  response_inhibition_score INTEGER NOT NULL,
  working_memory_score INTEGER NOT NULL,
  emotional_control_score INTEGER NOT NULL,
  flexibility_score INTEGER NOT NULL,
  sustained_attention_score INTEGER NOT NULL,
  task_initiation_score INTEGER NOT NULL,
  planning_prioritizing_score INTEGER NOT NULL,
  organization_score INTEGER NOT NULL,
  time_management_score INTEGER NOT NULL,
  goal_directed_persistence_score INTEGER NOT NULL,
  metacognition_score INTEGER NOT NULL,
  
  -- Analysis results
  strength_areas TEXT, -- JSON array of lowest scoring categories
  weakness_areas TEXT, -- JSON array of highest scoring categories
  
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Email log table to track sent reports
CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL, -- 'success' or 'error'
  error_message TEXT,
  
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_assessment_id ON email_logs(assessment_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);