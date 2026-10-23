import { Question } from "./exam";

export interface ExamTypeItem {
  id: number;
  name: string;
  code?: string;
  questions_count?: number;
}

export interface QbFacetGroup {
  id: number | string;
  name: string;
  count?: number;
}

export interface QbFacetsResponse {
  years?: QbFacetGroup[];
  types?: QbFacetGroup[];
  lessons?: QbFacetGroup[];
  subjects?: QbFacetGroup[];
}

export interface QbQuestionsResponse {
  current_page: number;
  data: Question[];
  total: number;
  next_page_url: string | null;
}
