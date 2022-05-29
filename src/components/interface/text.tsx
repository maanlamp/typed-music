import { classes } from "components/layout/layout";
import { ReactNode } from "react";
import "./text.css";

type TextSize = "normal" | "small";

type TextProps = Readonly<{
	weight?: number;
	children: ReactNode;
	size?: TextSize;
}>;

const Text = ({
	weight,
	children,
	size = "normal"
}: TextProps) => (
	<span
		className={classes([
			"text",
			`size-${size}`,
			weight && `weight-${weight}`
		])}>
		{children}
	</span>
);

export default Text;
