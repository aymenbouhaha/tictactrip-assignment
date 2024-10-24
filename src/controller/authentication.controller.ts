import { Request, Response } from "express";
import authenticationService from "../services/user.service";
import { CustomException } from "../models/exceptions/custom.exception";
import { AuthenticationDto } from "../models/dtos";

class AuthenticationController {
	async authenticateUser(request: Request, response: Response) {
		try {
			const { email } = request.body as AuthenticationDto;
			const token = await authenticationService.authenticateUser(email.trim());
			response.send(token);
		} catch (err) {
			console.log(err);
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
