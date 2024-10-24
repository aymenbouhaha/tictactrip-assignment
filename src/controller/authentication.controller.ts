import { Request, Response } from "express";
import authenticationService from "../services/user.service";
import { ZodError } from "zod";
import { zodErrorFormatter } from "../utils/zod-error.formatter";
import { CustomException } from "../models/exceptions/custom.exception";
import { AuthenticationDto } from "../models/dtos";

class AuthenticationController {
	async authenticateUser(request: Request, response: Response) {
		try {
			const { email } = request.body as AuthenticationDto;
			const token = await authenticationService.authenticateUser(email.trim());
			response.send(token);
		} catch (err) {
			if (err instanceof ZodError) {
				const errorFormatted = zodErrorFormatter(err.errors);
				response
					.status(400)
					.send(new CustomException(errorFormatted, 400).toJson());
				return;
			}

			response
				.status(500)
				.send(
					new CustomException(
						"An error occurred, please retry later",
						500,
					).toJson(),
				);
		}
	}
}

export default new AuthenticationController();
