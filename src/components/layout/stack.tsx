import Flex, {
	FlexProps,
	Positioning
} from "components/layout/flex";

const Stack = ({ classes, ...props }: FlexProps) => (
	<Flex
		classes={["stack", classes]}
		positioning={Positioning.Relative}
		{...props}
	/>
);

export default Stack;
