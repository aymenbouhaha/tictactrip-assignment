import { ZodIssue } from "zod";

export const zodErrorFormatter = (errors: ZodIssue[]) => {
	const errorsMessage = errors.map((issue) => {
		return issue.message;
	});
	return errorsMessage.join(",");
};
