export class CustomException extends Error {
	code: number;

	constructor(message: string, code: number) {
		super(message);

		this.name = this.constructor.name;

		this.code = code;

		Error.captureStackTrace(this, this.constructor);
	}

	toJson() {
		return {
			message: this.message,
			code: this.code,
		};
	}
}
