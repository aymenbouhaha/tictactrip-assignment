import textJustificationService from "../services/text-justification.service";
import { Request, Response } from "express";
import { CustomException } from "../models/exceptions/custom.exception";
import userService from "../services/user.service";

export class TextJustificationController {
	async justifyParagraph(request: Request, response: Response) {
		try {
			const justifiedText = textJustificationService.justifyText(
				request.body as string,
			);
			await userService.changeWordsCount(request.user!.email, request.body);
			response.send({ justifiedText });
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

export default new TextJustificationController();
