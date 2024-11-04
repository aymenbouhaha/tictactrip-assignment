import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db.config";
import { User } from "../entity/user";
import { Repository } from "typeorm";
import { hasOneDayPassedSince } from "../utils/has-one-day-passed";

class UserService {
	userRepository: Repository<User>;

	constructor() {
		this.userRepository = AppDataSource.getRepository(User);
	}

	private generateToken(email: string): string {
		return jwt.sign({ email }, process.env.JWT_SECRET ?? "", {
			expiresIn: "1d",
		});
	}

	public async authenticateUser(email: string) {
		try {
			const user = await this.findUserByEmail(email);
			if (!user) {
				const newUser = this.userRepository.create({
					email,
					dateReference: new Date(Date.now()),
					wordCount: 0,
				});
				await this.userRepository.save(newUser);
			}
			const token = this.generateToken(email);
			return { token };
		} catch (error) {
			console.log(error);
			throw new Error("Error Authenticating User");
		}
	}

	public async findUserByEmail(email: string) {
		return await this.userRepository.findOne({ where: { email } });
	}

	public async changeWordsCount(email: string, text: string) {
		const words = text.trim().split(/\s+/);
		const { wordCount, dateReference } = (await this.findUserByEmail(email))!;
		const oneDayPassedSince = hasOneDayPassedSince(dateReference);
		try {
			const newData = oneDayPassedSince
				? { wordCount: words.length, dateReference: new Date(Date.now()) }
				: {
						wordCount: wordCount + words.length,
					};
			const updateResult = await this.userRepository.update({ email }, newData);
			if (!updateResult.affected) {
				throw new Error("Error updating words count");
			}
		} catch (error) {
			console.log(error);
			throw new Error("Error updating words count");
		}
	}
}

export default new UserService();
