import { z } from "zod";
const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, { message: "Min 6 characters" }),
});
const signupSchema = z.object({
  username: z.string().min(3, { message: "Min 3 characters" }),
  email: z.email("Invalid email"),
  password: z.string().min(6, { message: "Min 6 characters" }),
});
export { loginSchema, signupSchema };
