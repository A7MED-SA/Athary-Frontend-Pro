export interface QuestionResponseDto {
  id: string;
  text: string;
  type: string;
  options: QuestionOptionDto[];
  points: number;
  explanation?: string;
}

export interface QuestionOptionDto {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizResponseDto {
  id: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
  timeLimitMinutes?: number;
  passingScore: number;
  maxAttempts?: number;
  questions: QuestionResponseDto[];
}

export interface SubmitQuizAttemptRequest {
  answers: QuizAnswerDto[];
}

export interface QuizAnswerDto {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizAttemptResultResponse {
  attemptId: string;
  quizId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: string;
}

export interface MyQuizAttemptResponse {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: string;
}
