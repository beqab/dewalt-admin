import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "ელ.ფოსტა სავალდებულოა"),
  password: z
    .string()
    .min(1, "პაროლი სავალდებულოა")
    .min(6, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო")
    .max(32, "პაროლი უნდა იყოს მაქსიმუმ 32 სიმბოლო"),
});
