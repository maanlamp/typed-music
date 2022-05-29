import Icon, {
	IconProps,
	isPlainSVGIcon
} from "components/interface/icon";
import { classes } from "components/layout/layout";
import React, { ReactNode } from "react";
import "./button.css";

type ButtonProps = Readonly<{
	onClick: React.MouseEventHandler;
	children: ReactNode;
	icon?: IconProps["svg"] | IconProps;
}>;

const Button = ({
	onClick,
	icon,
	children
}: ButtonProps) => (
	<button
		onClick={onClick}
		className={classes([
			"flex-inline flex-row button axis-main-center axis-cross-center gap-small"
		])}>
		{icon &&
			(isPlainSVGIcon(icon) ? (
				<Icon svg={icon} />
			) : (
				<Icon {...icon} />
			))}
		{children}
	</button>
);

export default Button;
