import Flex, {
	CrossAxisAlignment,
	FlexProps,
	MainAxisAlignment
} from "components/layout/flex";

const Center = (props: FlexProps) => (
	<Flex
		mainAxisAlignment={MainAxisAlignment.Center}
		crossAxisAlignment={CrossAxisAlignment.Center}
		{...props}
	/>
);

export default Center;
