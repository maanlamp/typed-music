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

export const get =
	<T extends object>(key: keyof T) =>
	(target: T) =>
		target[key];

export const camel2kebab = (x: string) =>
	x.replace(
		/[a-z][A-Z]/g,
		([a, b]) => `${a}-${b.toLowerCase()}`
	);

export const styleVars = (vars: Record<string, any>) =>
	Object.fromEntries(
		Object.entries(vars).map(([key, value]) => [
			`--${camel2kebab(key)}`,
			value
		])
	) as React.CSSProperties;

export const isTruthy = <T>(
	value: Falsy<T>
): value is T => Boolean(value);

type Falsy<T> =
	| T
	| false
	| 0
	| null
	| undefined
	| 0n
	| "";
type Class = Falsy<string>;
type Classes = Class | Classes[];

export const classes = (classes: Classes) =>
	[classes]
		.flat(Infinity as 0)
		.filter(isTruthy)
		.join(" ");
