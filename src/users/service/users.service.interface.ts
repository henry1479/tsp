import { UserLoginDto } from "../dto/user-login.dto";
import { UserRegisterDto } from "../dto/user-register.dto";
import { User } from "../users.entity";
import { Request, Response, NextFunction } from "express";

// интерфейс для обработки бизнес-логики по пользователю
export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	// register: (req: Request, res: Response, next: NextFunction) => void;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
