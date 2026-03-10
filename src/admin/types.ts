export type AdminDataType = "register" | "quiz";

export interface AdminDataSetup {
  ready: boolean;
  secretConfigured: boolean;
  sourceConfigured: boolean;
  issues: string[];
}

export interface AdminApiError {
  code:
    | "unauthorized"
    | "forbidden"
    | "invalid_type"
    | "missing_config"
    | "upstream_failed"
    | "invalid_payload"
    | "database_error";
  message: string;
  details?: string;
}

export interface AdminRegistrationRow {
  timestamp: string;
  lang: string;
  type: "Individuel" | "Equipe";
  fullName: string;
  email: string;
  phone: string;
  university: string;
  branch: string;
  yearOfStudy: string;
  teamName: string;
  projTitle: string;
  projDomain: string;
  demoFormat: string;
  heardFrom: string;
  fileLink: string;
}

export interface AdminQuizRow {
  timestamp: string;
  firstName: string;
  lastName: string;
  lang: string;
  branch: string;
  profile: string;
  rating: number;
  comment: string;
}

export interface AdminDataResponse<T> {
  ok: boolean;
  type: AdminDataType;
  rows: T[];
  total: number;
  fetchedAt: string;
  setup: AdminDataSetup;
  error?: AdminApiError;
}
