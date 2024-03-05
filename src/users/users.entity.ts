import { hash } from "bcryptjs";
// сущность пользователя
export class User {
	private _password: string;
	constructor(
		private readonly _emal: string,
		private readonly _name: string,
	) {}

	get email(): string {
		return this._emal;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}
}
