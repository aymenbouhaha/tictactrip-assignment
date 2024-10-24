import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/user.service";
import { CustomException } from "../models/exceptions/custom.exception";
import { AuthenticationDtoSchema, JustifyDto } from "../models/dtos";
import { ZodError } from "zod";
import { zodErrorFormatter } from "../utils/zod-error.formatter";
import { WORDS_LIMIT } from "../constant";
import { hasOneDayPassedSince } from "../utils/has-one-day-passed";

class Interceptors {
	public authenticateToken(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		const token = request.headers["authorization"];

		if (!token) {
			response
				.status(401)
				.send(new CustomException("User not authenticated", 401).toJson());
			return;
		}

		jwt.verify(token, process.env.JWT_SECRET ?? "", async (err, payload) => {
			if (err || !payload) {
				response
					.status(403)
					.send(new CustomException("Invalid Token", 403).toJson());
				return;
			}
			const user = await userService.findUserByEmail(
				(payload as jwt.JwtPayload)["email"],
			);
			if (!user) {
				response
					.status(404)
					.send(new CustomException("User doesn't exist", 404).toJson());
				return;
			}
			request.user = user;
			next();
		});
	}

	public async checkWordLimit(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		const words = (request.body as string).trim().split(/\s+/);
		const { wordCount, dateReference } = request.user!;
		const oneDayPassedSince = hasOneDayPassedSince(dateReference);
		const isGreaterThanLimit =
			!oneDayPassedSince && words.length + wordCount > WORDS_LIMIT;
		if (isGreaterThanLimit) {
			response
				.status(402)
				.send(new CustomException("Payment Required", 402).toJson());
		} else {
			next();
		}
	}

	public checkAuthDto(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		try {
			AuthenticationDtoSchema.parse(request.body);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				const errorFormatted = zodErrorFormatter(err.errors);
				response
					.status(400)
					.send(new CustomException(errorFormatted, 400).toJson());
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

	public checkJustifyDto(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		try {
			JustifyDto.parse(request.body);
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				const errorFormatted = zodErrorFormatter(err.errors);
				response
					.status(400)
					.send(new CustomException(errorFormatted, 400).toJson());
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

export default new Interceptors();
