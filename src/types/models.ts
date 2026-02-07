export interface HrUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface HrUserCreate {
  email: string;
  password_hash: string;
  name: string;
}

export interface HrUserResponse {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
