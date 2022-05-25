export const isEmpty = (xs: any[]): xs is [] =>
	xs.length === 0;

export const concat =
	<T>(item: T | T[]) =>
	(items: T[] | undefined) =>
		(items ?? []).concat(
			Array.isArray(item) && isEmpty(item)
				? ([[]] as any[])
				: item
		);

export const without =
	<T>(item: T) =>
	(items: T[]) =>
		items.filter(x => x !== item);

export const withoutIndex =
	(index: number) =>
	<T>(xs: T[] | undefined) => {
		if (!xs) return [];
		const clone = xs.slice();
		clone.splice(index, 1);
		return clone;
	};

export const omit =
	<T extends object>(key: keyof T) =>
	(target: T) => {
		const { [key]: _, ...rest } = target;
		return rest;
	};

export const set =
	<V>(chain: string, value: V | ((old: V) => V)) =>
	<T>(target: T) => {
		const keys = (chain as string).split(".");

		if (keys.length === 1) {
			return {
				...target,
				[keys[0]]:
					typeof value === "function"
						? (value as Function)(
								(target as any)[keys[0]]
						  )
						: value
			};
		}

		const clone = structuredClone(target);
		const endpoint = keys
			.slice(0, -1)
			.reduce(
				(clone, key) => clone[key],
				clone as any
			);
		endpoint[keys[keys.length - 1]] =
			typeof value === "function"
				? (value as Function)(
						endpoint[keys[keys.length - 1]]
				  )
				: value;
		return clone;
	};
