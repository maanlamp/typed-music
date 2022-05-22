import Icon, { IconProps } from "components/icon";
import { classes } from "components/layout";
import { styleVars } from "lib/utils";
import React, { ReactNode } from "react";
import "./button.css";

type ButtonProps = Readonly<{
	onClick?: React.MouseEventHandler;
	icon?: IconProps["svg"];
	children?: ReactNode;
	round?: boolean;
	color?: string;
}>;

const Button = ({
	onClick,
	icon,
	children,
	round,
	color
}: ButtonProps) => (
	<button
		style={styleVars({ buttonColor: color }) as any}
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
