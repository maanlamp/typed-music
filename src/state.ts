export const concat =
	<T>(item: T) =>
	(items: T[]) =>
		items.concat(item);

export const without =
	<T>(item: T) =>
	(items: T[]) =>
		items.filter(x => x !== item);

export const merge =
	<T>(update: Partial<T>) =>
	(source: T) => ({ ...source, ...update });

export const omit =
	<T>(key: keyof T) =>
	(target: T) => {
		const clone = { ...target };
		delete clone[key];
		return clone;
	};
