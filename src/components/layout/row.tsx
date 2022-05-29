import Flex, {
	FlexDirection,
	FlexProps
} from "components/layout/flex";

const Row = (props: FlexProps) => (
	<Flex direction={FlexDirection.Row} {...props} />
);

export default Row;
