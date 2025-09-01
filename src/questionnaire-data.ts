// Executive Skills Questionnaire Data Structure
// Based on "Smart but Scattered Teens" by Peg Dawson & Richard Guare

export interface Question {
  id: number;
  text: string;
  category: ExecutiveSkill;
}

export type ExecutiveSkill = 
  | 'response_inhibition'
  | 'working_memory' 
  | 'emotional_control'
  | 'flexibility'
  | 'sustained_attention'
  | 'task_initiation'
  | 'planning_prioritizing'
  | 'organization'
  | 'time_management'
  | 'goal_directed_persistence'
  | 'metacognition';

export const executiveSkillLabels: Record<ExecutiveSkill, string> = {
  response_inhibition: 'Response Inhibition',
  working_memory: 'Working Memory',
  emotional_control: 'Emotional Control',
  flexibility: 'Flexibility',
  sustained_attention: 'Sustained Attention',
  task_initiation: 'Task Initiation',
  planning_prioritizing: 'Planning/Prioritizing',
  organization: 'Organization',
  time_management: 'Time Management',
  goal_directed_persistence: 'Goal-Directed Persistence',
  metacognition: 'Metacognition'
};

export const questions: Question[] = [
  // Response Inhibition (Items 1-3)
  { id: 1, text: "I act on impulse.", category: 'response_inhibition' },
  { id: 2, text: "I get in trouble for talking too much in class.", category: 'response_inhibition' },
  { id: 3, text: "I say things without thinking.", category: 'response_inhibition' },
  
  // Working Memory (Items 4-6)
  { id: 4, text: "I say, \"I'll do it later\" and then forget about it.", category: 'working_memory' },
  { id: 5, text: "I forget homework assignments or forget to take home needed materials.", category: 'working_memory' },
  { id: 6, text: "I lose or misplace belongings such as coats, gloves, sports equipment, etc.", category: 'working_memory' },
  
  // Emotional Control (Items 7-9)
  { id: 7, text: "I get annoyed when homework is too hard or confusing or takes too long to finish.", category: 'emotional_control' },
  { id: 8, text: "I have a short fuse—am easily frustrated.", category: 'emotional_control' },
  { id: 9, text: "I get upset when things don't go as planned.", category: 'emotional_control' },
  
  // Flexibility (Items 10-12)
  { id: 10, text: "If the first solution to a problem doesn't work, I have trouble thinking of a different one.", category: 'flexibility' },
  { id: 11, text: "I get upset when I have to change plans or routines.", category: 'flexibility' },
  { id: 12, text: "I have problems with open-ended homework assignments (e.g., deciding what to write about when given a creative writing assignment).", category: 'flexibility' },
  
  // Sustained Attention (Items 13-15)
  { id: 13, text: "I have difficulty paying attention and am easily distracted.", category: 'sustained_attention' },
  { id: 14, text: "I run out of steam before finishing homework or other tasks.", category: 'sustained_attention' },
  { id: 15, text: "I have problems sticking with schoolwork or chores until they are done.", category: 'sustained_attention' },
  
  // Task Initiation (Items 16-18)
  { id: 16, text: "I put off homework or chores until the last minute.", category: 'task_initiation' },
  { id: 17, text: "I have difficulty setting aside fun activities in order to start homework.", category: 'task_initiation' },
  { id: 18, text: "I need to be reminded to start chores or homework.", category: 'task_initiation' },
  
  // Planning/Prioritizing (Items 19-21)
  { id: 19, text: "I have trouble planning for big assignments (knowing what to do first, second, etc.).", category: 'planning_prioritizing' },
  { id: 20, text: "I have difficulty setting priorities when I have a lot of things to do.", category: 'planning_prioritizing' },
  { id: 21, text: "I become overwhelmed by long-term projects or big assignments.", category: 'planning_prioritizing' },
  
  // Organization (Items 22-24)
  { id: 22, text: "My backpack and notebooks aren't organized.", category: 'organization' },
  { id: 23, text: "My desk or workspace at home or school is a mess.", category: 'organization' },
  { id: 24, text: "I have trouble keeping my bedroom or locker tidy.", category: 'organization' },
  
  // Time Management (Items 25-27)
  { id: 25, text: "I have a hard time estimating how long it takes to do something (such as homework).", category: 'time_management' },
  { id: 26, text: "I often don't finish homework at night and may rush to get it done in school before class.", category: 'time_management' },
  { id: 27, text: "I need a lot of time to get ready for things (e.g., appointments, school, changing classes).", category: 'time_management' },
  
  // Goal-Directed Persistence (Items 28-30)
  { id: 28, text: "I can't seem to save up money for a desired object—problems delaying gratification.", category: 'goal_directed_persistence' },
  { id: 29, text: "I don't see the point of earning good grades to achieve a long-term goal.", category: 'goal_directed_persistence' },
  { id: 30, text: "I prefer to live in the present.", category: 'goal_directed_persistence' },
  
  // Metacognition (Items 31-33)
  { id: 31, text: "I don't have very effective study strategies.", category: 'metacognition' },
  { id: 32, text: "I tend not to check my work for mistakes even when the stakes are high.", category: 'metacognition' },
  { id: 33, text: "I don't evaluate my performance and change tactics to increase success.", category: 'metacognition' }
];

// Scale labels for the 1-7 rating system
export const scaleLabels = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Tend to disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Tend to agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly agree' }
];

// Calculate scores for each executive skill category
export function calculateCategoryScores(responses: Record<number, number>) {
  const scores: Record<ExecutiveSkill, number> = {
    response_inhibition: (responses[1] || 0) + (responses[2] || 0) + (responses[3] || 0),
    working_memory: (responses[4] || 0) + (responses[5] || 0) + (responses[6] || 0),
    emotional_control: (responses[7] || 0) + (responses[8] || 0) + (responses[9] || 0),
    flexibility: (responses[10] || 0) + (responses[11] || 0) + (responses[12] || 0),
    sustained_attention: (responses[13] || 0) + (responses[14] || 0) + (responses[15] || 0),
    task_initiation: (responses[16] || 0) + (responses[17] || 0) + (responses[18] || 0),
    planning_prioritizing: (responses[19] || 0) + (responses[20] || 0) + (responses[21] || 0),
    organization: (responses[22] || 0) + (responses[23] || 0) + (responses[24] || 0),
    time_management: (responses[25] || 0) + (responses[26] || 0) + (responses[27] || 0),
    goal_directed_persistence: (responses[28] || 0) + (responses[29] || 0) + (responses[30] || 0),
    metacognition: (responses[31] || 0) + (responses[32] || 0) + (responses[33] || 0)
  };
  
  return scores;
}

// Analyze strengths and weaknesses
export function analyzeResults(scores: Record<ExecutiveSkill, number>) {
  const sortedScores = Object.entries(scores)
    .map(([skill, score]) => ({ skill: skill as ExecutiveSkill, score }))
    .sort((a, b) => a.score - b.score);

  // Strengths are the 2-3 lowest scoring areas (lower scores = better functioning)
  const strengths = sortedScores.slice(0, 3).map(item => item.skill);
  
  // Weaknesses are the 2-3 highest scoring areas (higher scores = more problematic)
  const weaknesses = sortedScores.slice(-3).map(item => item.skill);
  
  return { strengths, weaknesses, sortedScores };
}