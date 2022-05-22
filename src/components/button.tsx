import Icon, { IconProps } from "components/icon";
import { classes } from "components/layout";
import React, { ReactNode } from "react";
import "./button.css";

type ButtonProps = Readonly<{
	onClick?: React.MouseEventHandler;
	icon?: IconProps["svg"];
	children?: ReactNode;
	round?: boolean;
}>;

const Button = ({
	onClick,
	icon,
	children,
	round
}: ButtonProps) => (
	<button
		onClick={onClick}
		className={classes([
			"flex-inline flex-row button axis-main-center axis-cross-center gap-small",
			round && "round"
		])}>
		{icon && <Icon svg={icon} />}
		{children}
	</button>
);

export default Button;
