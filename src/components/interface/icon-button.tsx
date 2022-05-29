import Icon, {
	IconProps,
	isPlainSVGIcon
} from "components/interface/icon";
import { classes } from "components/layout/layout";
import React from "react";
import "./button.css";

type IconButtonProps = Readonly<{
	onClick: React.MouseEventHandler;
	icon: IconProps["svg"] | IconProps;
}>;

// TODO: Tooltip
const IconButton = ({
	onClick,
	icon
}: IconButtonProps) => (
	<button
		onClick={onClick}
		className={classes([
			"flex-inline flex-row button icon-button axis-main-center axis-cross-center gap-small round"
		])}>
		{isPlainSVGIcon(icon) ? (
			<Icon svg={icon} />
		) : (
			<Icon {...icon} />
		)}
	</button>
);

export default IconButton;
