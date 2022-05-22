import { Falsy } from "lib/utils";

export enum Size {
	Tiny = ".1rem",
	Small = ".5rem",
	Medium = "1rem",
	Large = "2rem",
	Huge = "4rem"
}

export enum Gap {
	Tiny = "gap-tiny",
	Small = "gap-small",
	Medium = "gap-medium",
	Large = "gap-large",
	Huge = "gap-huge",
	Inherit = "gap-inherit"
}

export enum Padding {
	Tiny = "padding-tiny",
	Small = "padding-small",
	Medium = "padding-medium",
	Large = "padding-large",
	Huge = "padding-huge",
	Inherit = "padding-inherit"
}

export type Classes = Falsy<string> | Classes[];
export const classes = (classes: Classes) =>
	[classes]
		.flat(Infinity as 0)
		.filter(Boolean)
		.join(" ")
		.replace(/\s+/, " ");
