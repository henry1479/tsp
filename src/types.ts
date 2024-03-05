// уникальные ключи для связывания классов в контейнере

export const TYPES = {
	Application: Symbol.for("Application"),
	ILogger: Symbol.for("ILogger"),
	LoggerService: Symbol.for("LoggerService"),
	UserController: Symbol.for("UserController"),
	ExceptionFilter: Symbol.for("ExceptionFilter"),
	IUserController: Symbol.for("IUserController"),
	UserService: Symbol.for("UserService"),
	IConfigService: Symbol.for("IConfigService"),
};
