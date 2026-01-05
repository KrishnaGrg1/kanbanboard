import z from 'zod';

const loginSchema = z.object({
  email: z
    .string().min(1,"Email required")
    .email({ message: 'Invalid email' }),
  password: z.string().min(6, 'Password length must atleast 6 character'),
});

export default loginSchema;