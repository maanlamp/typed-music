type RGBAColor = Readonly<{
	r: number;
	g: number;
	b: number;
	a?: number;
}>;

type HSLAColor = Readonly<{
	h: number;
	s: number;
	l: number;
	a?: number;
}>;

export type Color = string | HSLAColor | RGBAColor;

const isHSL = (color: Color): color is HSLAColor =>
	[
		(color as HSLAColor).h,
		(color as HSLAColor).s,
		(color as HSLAColor).l
	].every(prop => prop !== undefined);

const isRGB = (color: Color): color is RGBAColor =>
	[
		(color as RGBAColor).r,
		(color as RGBAColor).g,
		(color as RGBAColor).b
	].every(prop => prop !== undefined);

const rgbToHsl = ({ r, g, b, a }: RGBAColor) => {
	r /= 255;
	g /= 255;
	b /= 255;

	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		hue = 0,
		saturation = 0,
		lightness = 0;

	if (delta === 0) {
		hue = 0;
	} else if (cmax === r) {
		hue = ((g - b) / delta) % 6;
	} else if (cmax === g) {
		hue = (b - r) / delta + 2;
	} else {
		hue = (r - g) / delta + 4;
	}

	hue = Math.round(hue * 60);

	if (hue < 0) hue += 360;

	lightness = (cmax + cmin) / 2;

	saturation =
		(delta === 0
			? 0
			: delta / (1 - Math.abs(2 * lightness - 1))) *
		100;
	lightness = +(lightness * 100);

	return { h: hue, s: saturation, l: lightness, a };
};

const parseCSSColor = (color: string) => {
	const div = document.createElement("div");
	div.style.display = "none";
	div.style.color = color;
	document.body.append(div);
	const parsedColor = getComputedStyle(div).color;
	div.remove();
	return parseRGBAString(parsedColor);
};

const parseHexString = (color: string): HSLAColor => {
	if (
		!["#000000".length, "#00000000".length].includes(
			color.length
		)
	)
		throw new Error(
			`Expected a hex string with optional alpha channel, but got "${color}".`
		);

	const [r, g, b, a = 1] =
		(color
			.slice(1)
			.match(/(\w{1,2})/gi)
			?.map(chunk =>
				chunk ? parseInt(chunk, 16) : 1
			) as [number, number, number, number]) ?? [];

	return (
		[r, g, b] as Array<number | undefined>
	).includes(undefined)
		? { h: 0, s: 0, l: 0, a: 0 }
		: rgbToHsl({ r, g, b, a });
};

const parseRGBAString = (color: string): HSLAColor => {
	const [r, g, b, a = 1] = color
		.slice(color.indexOf("(") + 1, color.indexOf(")"))
		.split(/\s*,\s*/)
		.map(chunk => (chunk ? parseFloat(chunk) : 1)) as [
		number,
		number,
		number,
		number
	];

	if (r === undefined || Number.isNaN(r))
		return rgbToHsl({ r: 0, g, b, a });
	if (g === undefined || Number.isNaN(g))
		return rgbToHsl({ r, g: 0, b, a });
	if (b === undefined || Number.isNaN(b))
		return rgbToHsl({ r, g, b: 0, a });
	return rgbToHsl({ r, g, b, a });
};

const parseHSLAString = (color: string): HSLAColor => {
	const [h, s, l, a = 1] = color
		.slice(color.indexOf("(") + 1, color.indexOf(")"))
		.split(/\s*,\s*/)
		.map(chunk => (chunk ? parseFloat(chunk) : 1)) as [
		number,
		number,
		number,
		number
	];

	if (h === undefined || Number.isNaN(h))
		return { h: 0, s, l, a };
	if (s === undefined || Number.isNaN(s))
		return { h, s: 0, l, a };
	if (l === undefined || Number.isNaN(l))
		return { h, s, l: 0, a };
	return { h, s, l, a };
};

const colorFromString = (color: string) => {
	if (color.startsWith("#"))
		return parseHexString(color);
	if (color.startsWith("rgb"))
		return parseRGBAString(color);
	if (color.startsWith("hsl"))
		return parseHSLAString(color);
	return parseCSSColor(color);
};

export const parse = (color: Color): HSLAColor => {
	if (typeof color === "string")
		return colorFromString(color);
	if (isHSL(color)) return color;
	if (isRGB(color)) return rgbToHsl(color);

	throw new Error(
		`Unhandled color type "${JSON.stringify(color)}".`
	);
};

export const stringify = (color: Color): string => {
	if (typeof color === "string") return color;
	if (isHSL(color))
		return `hsla(${[
			`${color.h}deg`,
			`${color.s}%`,
			`${color.l}%`,
			color.a
		].join(", ")})`;
	if (isRGB(color))
		return `rgba(${[
			color.r,
			color.g,
			color.b,
			color.a
		].join(", ")})`;

	throw new Error(
		`Unhandled color type "${JSON.stringify(color)}".`
	);
};

export const lighten = (
	color: Color,
	amount: number
) => {
	const hsl = parse(color);
	return { ...hsl, l: hsl.l + (100 - hsl.l) * amount };
};

export const darken = (
	color: Color,
	amount: number
) => {
	const hsl = parse(color);
	return { ...hsl, l: hsl.l * (1 - amount) };
};

type ColorName =
	| "malachite"
	| "titanium-yellow"
	| "maximum-blue-purple"
	| "persian-pink"
	| "deep-saffron";

type Shade =
	| "100"
	| "200"
	| "300"
	| "400"
	| "500"
	| "600"
	| "700"
	| "800"
	| "900";

const makeShades = (
	color: Color
): Record<Shade, Color> => {
	const parsed = parse(color);
	return Object.fromEntries([
		["500", parsed] as const,
		...["100", "200", "300", "400"]
			.map(shade => [
				shade,
				darken(parsed, 0.5 - parseInt(shade) / 1000)
			])
			.concat(
				["600", "700", "800", "900"].map(shade => [
					shade,
					lighten(
						parsed,
						Math.abs(0.5 - parseInt(shade) / 1000)
					)
				])
			)
	]);
};

export const withOpacity = (
	color: Color,
	opacity: number
): HSLAColor => {
	const parsed = parse(color);
	return { ...parsed, a: opacity };
};

export const colors: Readonly<
	Record<ColorName, Record<Shade, Color>>
> = {
	malachite: makeShades("#53e46e"),
	"titanium-yellow": makeShades("#eee82c"),
	"maximum-blue-purple": makeShades("#b4adea"),
	"persian-pink": makeShades("#f476c2"),
	"deep-saffron": makeShades("#ff9447")
};

for (const [name, shades] of Object.entries(colors))
	for (const [shade, color] of Object.entries(shades))
		document.documentElement.style.setProperty(
			`--color-${name}-${shade}`,
			stringify(color)
		);
