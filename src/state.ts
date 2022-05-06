import { useRef } from "react";

export const concat =
	<T>(item: T) =>
	(items: T[]) =>
		items.concat(item);

export const without =
	<T>(item: T) =>
	(items: T[]) =>
		items.filter(x => x !== item);

export const merge =
	<T extends object>(update: Partial<T>) =>
	(source: T) => ({ ...source, ...update });

export const omit =
	<T extends object>(key: keyof T) =>
	(target: T) => {
		const { [key]: _, ...rest } = target;
		return rest;
	};

export const useRefState = <T>(defaultValue: T) => {
	const value = useRef(defaultValue);

	const set = (update: T | ((value: T) => T)) => {
		value.current =
			typeof update === "function"
				? (update as Function)(value.current)
				: update;
	};

	return [() => value.current, set] as const;
};
