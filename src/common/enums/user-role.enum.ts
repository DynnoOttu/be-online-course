export enum UserRole {
  STUDENT = 'student',
  MENTOR = 'mentor',
  MANAGER = 'manager',
}

export const REGISTER_ROLES = [UserRole.STUDENT, UserRole.MENTOR] as const;
