export const log = <T>(x: T) => {
	console.log(x);
	return x;
};

export const apply = <
	T extends (...args: any[]) => any
>(
	f: T
) => f();

export const range = (n: number) =>
	Array.from(Array(n).keys());

export const random = (max: number) =>
	Math.round(Math.random() * max);

export const choose = <T>(items: T[]) =>
	items[random(items.length - 1)];
