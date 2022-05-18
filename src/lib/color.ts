const rgbToHsl = ([r, g, b]: readonly [
	number,
	number,
	number
]) => {
	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta == 0) h = 0;
	else if (cmax == r) h = ((g - b) / delta) % 6;
	else if (cmax == g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0) h += 360;

	l = (cmax + cmin) / 2;
	s =
		delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return [h, s, l] as const;
};

const hexToRgb = (hex: string) => {
	let r: any = 0,
		g: any = 0,
		b: any = 0;
	if (hex.length == 4) {
		r = "0x" + hex[1] + hex[1];
		g = "0x" + hex[2] + hex[2];
		b = "0x" + hex[3] + hex[3];
	} else if (hex.length == 7) {
		r = "0x" + hex[1] + hex[2];
		g = "0x" + hex[3] + hex[4];
		b = "0x" + hex[5] + hex[6];
	} else {
		throw new RangeError(
			`Hex string is of invalid length (expected 4 or 7, got ${hex.length}).`
		);
	}
	return [+r, +g, +b] as const;
};

const hexToHsl = (H: any) => rgbToHsl(hexToRgb(H));

export const lighten = (
	color: string,
	amount: number
) => {
	const [h, s, l] = hexToHsl(color);
	return `hsl(${h}, ${s}%, ${l * (1 + amount)}%)`;
};

export const darken = (
	color: string,
	amount: number
) => {
	const [h, s, l] = hexToHsl(color);
	return `hsl(${h}, ${s}%, ${l * (1 - amount)}%)`;
};

export const withOpacity = (
	col: string,
	opacity: number
) => {
	if (col.startsWith("#")) {
		return (
			col + Math.round(opacity * 255).toString(16)
		);
	} else if (col.startsWith("rgb")) {
		const [r, g, b] = col
			.slice("rgb(".length, -")".length)
			.split(",");
		return `rgba(${r},${g},${b}, ${opacity})`;
	} else if (col.startsWith("hsl")) {
		const [h, s, l] = col
			.slice("hsl(".length, -")".length)
			.split(",");
		return `hsla(${h},${s},${l}, ${opacity})`;
	} else {
		throw new TypeError(
			`Expected an opaque color string (rgb, hex, hsl), but got "${col}".`
		);
	}
};
