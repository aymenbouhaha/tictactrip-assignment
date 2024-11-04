import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "node:path";

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
	entities: [path.join(__dirname, "..", "entity", "**/*{.js,.ts}")],
});
