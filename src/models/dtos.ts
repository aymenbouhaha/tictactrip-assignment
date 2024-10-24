import { z } from "zod";

export const AuthenticationDtoSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email({ message: "Please Enter a valid email" }),
});

export type AuthenticationDto = z.infer<typeof AuthenticationDtoSchema>;

export const JustifyDto = z.string({
	required_error: "The input must be a string",
});
