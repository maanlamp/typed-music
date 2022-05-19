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

export const merge =
	<T extends object>(
		update:
			| Partial<T>
			| ((update: Partial<T>) => Partial<T>)
	) =>
	(source: T) => ({
		...source,
		...(typeof update === "function"
			? update(source)
			: update)
	});

export const omit =
	<T extends object>(key: keyof T) =>
	(target: T) => {
		const { [key]: _, ...rest } = target;
		return rest;
	};
