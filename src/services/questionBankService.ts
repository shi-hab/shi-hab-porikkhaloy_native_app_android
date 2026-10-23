import { apiClient } from "./apiClient";
import {
  ExamTypeItem,
  QbFacetsResponse,
  QbQuestionsResponse,
} from "../types/questionBank";

export const questionBankService = {
  async getExamTypes(params?: Record<string, any>): Promise<ExamTypeItem[]> {
    const response = await apiClient.get<{ data: ExamTypeItem[] }>(
      "/exam-types",
      { params }
    );
    return response.data?.data || [];
  },

  async getFacets(params?: Record<string, any>): Promise<QbFacetsResponse> {
    const response = await apiClient.get<{ data: QbFacetsResponse }>(
      "/facets",
      { params }
    );
    return response.data?.data || {};
  },

  async getQuestions(params: {
    page?: number;
    subject_id?: number | string;
    chapter_id?: number | string;
    exam_type_id?: number | string;
    search?: string;
    year?: string;
  }): Promise<QbQuestionsResponse> {
    const response = await apiClient.get<{ data: QbQuestionsResponse }>(
      "/questions",
      { params }
    );
    return response.data?.data || { current_page: 1, data: [], total: 0, next_page_url: null };
  },
};
