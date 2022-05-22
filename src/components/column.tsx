import Flex, {
	FlexDirection,
	FlexProps
} from "components/flex";

const Column = (props: FlexProps) => (
	<Flex direction={FlexDirection.Column} {...props} />
);

export default Column;
