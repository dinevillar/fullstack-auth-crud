import { apiRequest } from './client';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export async function loginUser(input: LoginInput): Promise<LoginOutput> | never {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
