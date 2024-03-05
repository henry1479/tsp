import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface";
// библиотека для преобразования объекта в класс
import { ClassConstructor, plainToClass } from "class-transformer";
// валидация данных, пришедших из запроса
import { ValidationError, validate } from "class-validator";

// интерфейс по мидлвэрам общий
export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		// преобразовываем тело запроса в класс
		const instance = plainToClass(this.classToValidate, body);
		// валидируем класс тела, возвращая назад либо массив ошибок
		// или передаем дальше запрос на контроллер
		validate(instance).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
