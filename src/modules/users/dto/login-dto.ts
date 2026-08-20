import z from 'zod';

export const LoginShema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password is required'),
});

export class LoginDto {
  static schema = LoginShema;
  email!: string;
  password!: string;
}
