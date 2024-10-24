import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./config/db.config";
import authenticationController from "./controller/authentication.controller";
import textJustificationController from "./controller/text-justification.controller";
import dotenv from "dotenv";
import interceptors from "./interceptors/interceptors";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

class Server {
	public app: Application;

	constructor() {
		this.app = express();
		this.config();
		this.routes();
		this.documentation();
	}

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(express.text());
		this.dbConfig();
	}

	private routes(): void {
		this.app.post(
			"/api/token",
			interceptors.checkAuthDto,
			authenticationController.authenticateUser,
		);
		this.app.post(
			"/api/justify",
			interceptors.authenticateToken,
			interceptors.checkJustifyDto,
			interceptors.checkWordLimit,
			textJustificationController.justifyParagraph,
		);
	}

	private documentation(): void {
		const filePath = path.join(process.cwd(), "documentation/swagger.yaml");
		const swaggerDocument = YAML.load(filePath);
		this.app.use(
			"/api-docs",
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument),
		);
	}

	private dbConfig() {
		AppDataSource.initialize()
			.then(() => {
				console.log("Data Source has been initialized!");
			})
			.catch((err) => {
				console.error("Error during Data Source initialization", err);
			});
	}

	public start(): void {
		const port = 3000;
		this.app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
			console.log(
				`Please access api documentation on http://localhost:${port}/api-docs`,
			);
		});
	}
}

const server = new Server();
server.start();
