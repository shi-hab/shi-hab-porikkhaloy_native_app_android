export interface QuestionOption {
  id: number | string;
  question_id: number | string;
  option_text: string;
  serial?: string | number;
  is_correct?: boolean | number;
}

export interface Question {
  id: number;
  question_text: string;
  explanation?: string;
  mark?: number;
  negative_mark?: number;
  question_type?: "mcq" | "creative" | "normal";
  subject_id?: number;
  subject_name?: string;
  chapter_id?: number;
  chapter_name?: string;
  options: QuestionOption[];
}

export interface Exam {
  id: number;
  title: string;
  duration_minutes: number;
  total_marks: number;
  pass_marks?: number;
  negative_marking?: number;
  exam_type?: string;
  start_time?: string;
  end_time?: string;
  is_free?: boolean | number;
  total_questions?: number;
}

export interface ExamStartResponse {
  exam: Exam;
  questions_list: Question[];
  mcqAnswers?: Record<string | number, number | string>;
}

export interface UserMcqAnswer {
  question_id: number;
  selected_option_id: number | string | null;
}

export interface ExamFinishPayload {
  examination_id: number;
  duration_taken_seconds?: number;
  mcq_answers: UserMcqAnswer[];
  creative_answers?: any[];
  normal_answers?: any[];
}

export interface ExamResultResponse {
  examination: Exam;
  student: any;
  total_marks: number;
  obtained_marks: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  rank?: number;
  total_students?: number;
  accuracy_percentage?: number;
  mcq_answers?: any[];
}
