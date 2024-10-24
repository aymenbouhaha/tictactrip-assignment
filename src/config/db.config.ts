import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "tictac_user",
	password: "aymen",
	database: "tictactrip",
	synchronize: true,
	logging: true,
	entities: ["src/entity/**/*.ts"],
});
