import { Color, stringify } from "lib/color";

export type IconProps = Readonly<{
	svg: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
	size?: number;
	color?: Color;
}>;

export const isPlainSVGIcon = (
	icon: IconProps | IconProps["svg"]
): icon is IconProps["svg"] =>
	!(icon as IconProps).svg;

const Icon = ({
	svg: Svg,
	size = 16,
	color
}: IconProps) => (
	<Svg
		className="icon"
		width={size}
		height={size}
		fill={color && stringify(color)}
	/>
);

export default Icon;
