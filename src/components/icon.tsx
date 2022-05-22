export type IconProps = Readonly<{
	svg: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
	size?: number;
	color?: string;
}>;

const Icon = ({
	svg: Svg,
	size = 16,
	color
}: IconProps) => (
	<Svg
		className="icon"
		width={size}
		height={size}
		fill={color}
	/>
);

export default Icon;
