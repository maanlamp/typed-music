import Flex, {
	FlexDirection,
	FlexProps
} from "components/layout/flex";

const Column = (props: FlexProps) => (
	<Flex direction={FlexDirection.Column} {...props} />
);

export default Column;
