function Component(id: number): (target: unknown) => void {
	console.log("init");
	return (target: any) => {
		console.log("run");
		target.prototype.id = id;
	};
}

function Logger(): (target: unknown) => void {
	console.log("init logger");
	return (target: any) => {
		console.log("run logger");
	};
}

// декоратор метода
function Method(
	// класс
	target: object,
	// название метода
	propertyKey: string,
	// тело метода
	propertyDescriptor: PropertyDescriptor,
): void {
	console.log(propertyKey);
	const oldValue = propertyDescriptor.value;
	// новая функция, которая возвращает переданный аргумент, умноженный на 10
	propertyDescriptor.value = function (...args: any[]): number {
		return args[0] * 10;
	};
}

// декоратор свойства
// делаем геттер и сеттер
function Prop(target: object, propertyKey: string): void {
	let value: number;

	const getter = (): number => {
		console.log("Get!");
		return value;
	};

	const setter = (newValue: number): void => {
		console.log("Set!");
		value = newValue;
	};

	// переопределяем геттер и сеттер
	Object.defineProperty(target, propertyKey, {
		get: getter,
		set: setter,
	});
}

// декоратор на параметр метода
function Param(
	target: object,
	propertyKey: string,
	// индекс параметра, 0 по умолчанию
	index: number,
): void {
	console.log(propertyKey, index);
}

// декоратор класса
@Logger()
@Component(1)
export class User {
	@Prop id: number;

	@Method
	updateId(@Param id: number): number {
		this.id = id;
		return this.id;
	}
}

console.log(new User().id);
console.log(new User().updateId(2));
