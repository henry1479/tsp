import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { ExceptionFilter } from "./errors/exeception.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import "reflect-metadata";
import { IUserController } from "./users/users.controller.interface";
import { UserService } from "./users/service/users.service";
import { IUserService } from "./users/service/users.service.interface";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}
// // простейший DI
// const logger = new LoggerService();
// const app = new App(
//     logger,
//     new UserController(logger),
//     new ExceptionFilter(logger)
// );

// модульность в DI
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserService>(TYPES.UserService).to(UserService);
	// создаем синглтон конфига
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});
// контейнер DI

function bootstrap(): IBootstrapReturn {
	// создаем контейнер
	const appContainer = new Container();
	// связывание контейнер с модулем
	appContainer.load(appBindings);
	// берем приложение из контейнера
	const app = appContainer.get<App>(TYPES.Application);
	// и запускаем его
	app.init();
	// возвращаем приложение и контейнер для тестирования
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
