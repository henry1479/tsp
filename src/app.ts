import { Server } from "http";
import express, { Express } from "express";
import { UserController } from "./users/users.controller";
import { ExceptionFilter } from "./errors/exeception.filter";
import { ILogger } from "./logger/logger.interface";
// DI
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
// для правильного парсинга тела запроса
import { json } from "body-parser";
import cors from "cors";
import "reflect-metadata";
import { IConfigService } from "./config/config.service.interface";

// класс приложения
@injectable()
export class App {
	public server: Server;
	public port: number;
	public app: Express;

	// реализация простейшего DI на примере логеров
	constructor(
		// получаем инстансы классов, которые есть в контейнере
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 8000;
	}

	// использование мидлвэра json из body-parser для разбора тела запроса глобально
	useMiddleware(): void {
		this.app.use(cors());
		this.app.use(json());
	}

	// добавляем роутинг
	public useRoutes(): void {
		this.app.use("/users", this.userController.router);
	}

	// фильр ошибок
	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	// инициализация
	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters;
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
		});
	}
}
