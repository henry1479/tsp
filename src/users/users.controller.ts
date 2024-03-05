/* eslint-disable @typescript-eslint/ban-types */
import { inject, injectable } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { Response, Request, NextFunction } from "express";
import { TYPES } from "../types";
import "reflect-metadata";
import { IUserController } from "./users.controller.interface";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./users.entity";
import { IUserService } from "./service/users.service.interface";
import { ValidateMiddleware } from "../common/validate.middleware";

@injectable()
export class UserController extends BaseController implements IUserController {
	// получение инстанса логгера путем декорирования параметра конструктора
	// библиотеки ineversify
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);
		// дополняем связку на роут регистрации мидлвэр валидации
		this.bindRoutes([
			{
				path: "/register",
				method: "post",
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: "/register", method: "get", func: this.show },
			{ path: "/login", method: "post", func: this.login },
		]);
	}

	// регистарция через пост
	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		console.log("body", body);
		// использование сущности
		const result = await this.userService.createUser(body);
		// возврат ошибок или нормального ответа в зависимости от результата
		if (!result) {
			return next(new HTTPError(422, "Такой пользователь уже существует"));
		} else {
			this.ok(res, { email: result.email });
		}
	}
	// вход через пост
	// использование дженериков для выделеня тела запроса под описание dto
	public login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HTTPError(404, "Не удалось авторизоваться"));
	}
	// показ формы
	public show(req: Request, res: Response, next: NextFunction): void {
		res.send("Register-form");
	}
}
