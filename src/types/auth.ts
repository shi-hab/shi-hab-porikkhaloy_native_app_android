export interface Student {
  id: number;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  level_id?: number | string;
  group_id?: number | string;
  section_id?: number | string;
  target?: string;
  institution?: string;
  district?: string;
  gender?: string;
  dob?: string;
  created_at?: string;
}

export interface AuthState {
  token: string | null;
  student: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    student: Student;
  };
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password?: string;
  level_id?: number | string;
  group_id?: number | string;
  target?: string;
}
