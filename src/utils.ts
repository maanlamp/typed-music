export const log = <T>(x: T) => {
	console.log(x);
	return x;
};

export const apply = <
	T extends (...args: any[]) => any
>(
	f: T
) => f();
