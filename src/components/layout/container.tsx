import Flex, {
	FlexProps
} from "components/layout/flex";

const Container = ({
	classes,
	...props
}: FlexProps) => (
	<Flex classes={["container", classes]} {...props} />
);

export default Container;
