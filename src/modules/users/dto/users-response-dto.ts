export interface UsersResponseDto {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: RoleResponseDto;
  userProfile: UserProfileResponseDto | null;
  totalStudents?: number;
  totalCourses?: number;
  totalEndrollerdCourses?: number;
}

interface RoleResponseDto {
  id: number;
  name: string;
  key: string;
  permissions: PermissionsResponseDto[];
}

interface PermissionsResponseDto {
  id: number;
  name: string;
  key: string;
  resource: string;
}

interface UserProfileResponseDto {
  id: number;
  bio: string | null;
  avatar: string | null;
  gender: string | null;
  expertise: string | null;
  experienceYears: number | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
}
