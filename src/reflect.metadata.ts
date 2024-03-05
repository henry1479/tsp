import "reflect-metadata";

function Test(target: object): void {
	Reflect.defineMetadata("a", 1, target);
	const meta = Reflect.getMetadata("a", target);
	console.log(meta);
}

function Prop(target: object, name: string): void {}
// построение DI с помощью декораторов
// добавляем класс в глобальную область по ключу
function Injectable(key: string) {
	return (target: object): void => {
		Reflect.defineMetadata(key, 1, target);
		const meta = Reflect.getMetadata(key, target);
		console.log(meta);
	};
}

// вытаскиваем объект класса из глобальной области по ключу
function Inject(key: string) {
	return (target: Record<string, never>, propertyKey: string, index: number): void => {
		const meta = Reflect.getMetadata(key, target);
		console.log(meta);
	};
}

// @Injectable("C")
// export class C {
//     @Prop prop: number;

// }

// @Injectable("D")
// export class D {
//     @Prop prop: number;
//     constructor(@Inject("C") c: C) {

//     }

// }
