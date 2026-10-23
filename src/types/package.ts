export interface Package {
  id: number;
  name: string;
  slug?: string;
  title: string;
  description?: string;
  details?: string;
  price: number;
  discount?: number;
  discount_type?: "percentage" | "amount";
  duration_days?: number;
  display_student_count?: number;
  is_subscribed?: boolean;
  routine_pdf?: string;
  routine?: string;
  image?: string;
  thumbnail?: string;
  model_tests_count?: number;
}

export interface ModelTest {
  id: number;
  package_id: number;
  title: string;
  description?: string;
  total_exams?: number;
  is_free?: boolean | number;
}
