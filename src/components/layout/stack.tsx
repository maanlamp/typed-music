import Flex, {
	FlexProps,
	Positioning
} from "components/layout/flex";

const Stack = (props: FlexProps) => (
	<Flex
		positioning={Positioning.Relative}
		{...props}
	/>
);

export default Stack;
