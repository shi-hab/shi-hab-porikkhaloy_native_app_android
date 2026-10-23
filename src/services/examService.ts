import { apiClient } from "./apiClient";
import {
  Exam,
  ExamFinishPayload,
  ExamResultResponse,
  ExamStartResponse,
} from "../types/exam";

export const examService = {
  async getAllExams(): Promise<Exam[]> {
    const response = await apiClient.get<Exam[]>("/exams/all/0");
    return response.data;
  },

  async startExam(data: {
    exam_id?: number;
    type?: string;
    topic_ids?: number[];
    lesson_ids?: number[];
    sub_topic_ids?: number[];
    exam_type_ids?: number[];
    question_count?: number;
    duration?: number;
  }): Promise<ExamStartResponse> {
    const response = await apiClient.post<ExamStartResponse>("/exam/start", data);
    return response.data;
  },

  async restartExam(id: number): Promise<ExamStartResponse> {
    const response = await apiClient.post<ExamStartResponse>("/exam/restart", {
      id,
    });
    return response.data;
  },

  async finishExam(payload: ExamFinishPayload): Promise<ExamResultResponse> {
    const response = await apiClient.post<ExamResultResponse>(
      "/exam/finish",
      payload
    );
    return response.data;
  },

  // Mock Test Wizard endpoints
  async getMockBootstrap(scope?: string): Promise<any> {
    const response = await apiClient.get("/mock-test/bootstrap", {
      params: { s: scope },
    });
    return response.data;
  },

  async getMockTree(subjectIds: number[], type?: string, scope?: string): Promise<any> {
    const response = await apiClient.get("/mock-test/tree", {
      params: {
        subject_ids: subjectIds.join(","),
        type,
        s: scope,
      },
    });
    return response.data;
  },

  async getMockAvailability(params: {
    type: string;
    topicIds: number[];
    lessonIds: number[];
    subTopicIds?: number[];
    standardIds?: number[];
  }): Promise<any> {
    const response = await apiClient.get("/mock-test/availability", {
      params: {
        type: params.type,
        topic_ids: params.topicIds.sort((a, b) => a - b).join(","),
        lesson_ids: params.lessonIds.sort((a, b) => a - b).join(","),
        sub_topic_ids: (params.subTopicIds || []).sort((a, b) => a - b).join(","),
        exam_type_ids: (params.standardIds || []).sort((a, b) => a - b).join(","),
      },
    });
    return response.data;
  },
};
