import { Response, Router } from "express";
import { IControllerRoute } from "./route.interface";
import { ILogger } from "../logger/logger.interface";
import { injectable } from "inversify";
// это нужно для правильной работы ineversify
import "reflect-metadata";

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): Response<any, Record<string, any>> {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, text: T): Response<any, Record<string, any>> {
		res.type("application/json");
		return res.status(code).json(text);
	}

	public ok<T>(res: Response, text: T): Response<any, Record<string, any>> {
		return this.send<T>(res, 200, text);
	}
	// привязка роутов по методам контроллеров
	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			// выводим метод и путь
			this.logger.log(`[${route.method}] ${route.path}`);
			// привязываем контекст мидлвэров к самим себе, если они есть
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			// привязываем контекст обработчиков к основному контроллеру
			const handler = route.func.bind(this);
			// добавляем привязанные мидлвэры в список первыми, если они имеются
			const pipeline = middleware ? [...middleware, handler] : handler;
			// вызываем каждый мидлвэр и обработчик для своего роута
			this.router[route.method](route.path, pipeline);
		}
	}
}
