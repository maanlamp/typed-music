import Flex, {
	FlexDirection,
	FlexProps
} from "components/flex";

const Row = (props: FlexProps) => (
	<Flex direction={FlexDirection.Row} {...props} />
);

export default Row;
