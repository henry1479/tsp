import { IConfigService } from "./config.service.interface";
// библиотека для чтения .env
import { DotenvConfigOutput, DotenvParseOutput, config } from "dotenv";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { inject, injectable } from "inversify";
import "reflect-metadata";
@injectable()
// класс конфигурации
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		// создаем парсер
		const result: DotenvConfigOutput = config();
		// если ошибка выводим ее в логгер
		if (result.error) {
			this.logger.error("[ConfigService] Не удалось прочитать файл .env или он отсутствует");
			// если ошибки нет, то логируем и записывеам в созданный конфиг
		} else {
			this.logger.log("[ConfigService] Конфигурация .env загружена");
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	// получение данных из конфига по ключу
	get(key: string): string {
		return this.config[key];
	}
}
