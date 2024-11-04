import { User } from "../entity/user";

export {};

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
