export type UserRole = 'admin' | 'editor' | 'reviewer' | 'member';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface DBUser {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at: string | null;
  last_login_at: string | null;
  meta: any;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Pick<
  DBUser, 'id' | 'email' | 'username' | 'display_name' | 'role' | 'status' | 'created_at'
>;
