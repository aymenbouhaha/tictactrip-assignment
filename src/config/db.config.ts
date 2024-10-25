import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOSTNAME ?? "",
	port: 5432,
	username: process.env.DB_USERNAME ?? "",
	password: process.env.DB_PASSWORD ?? "",
	database: process.env.DB_NAME ?? "",
	synchronize: true,
	logging: true,
	entities: ["src/entity/**/*.ts"],
});
