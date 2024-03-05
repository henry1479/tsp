import { injectable } from "inversify";
import { UserLoginDto } from "../dto/user-login.dto";
import { UserRegisterDto } from "../dto/user-register.dto";
import { User } from "../users.entity";
import { IUserService } from "./users.service.interface";
import "reflect-metadata";
import { IConfigService } from "../../config/config.service.interface";
import { inject } from "inversify";
import { TYPES } from "../../types";

// сам сервис обработки бизнес-логики по пользователю
@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get("SALT");
		console.log(salt);
		await newUser.setPassword(password, Number(salt));
		// проверка, что он есть
		// если есть - возвращаем null
		// елси нет - создаем
		return newUser;
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
