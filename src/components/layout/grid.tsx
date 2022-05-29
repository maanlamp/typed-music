import Flex, {
	FlexProps
} from "components/layout/flex";

type GridProps = Readonly<{
	rows?: ReadonlyArray<string>;
	columns?: ReadonlyArray<string>;
}> &
	FlexProps;

const Grid = ({
	rows,
	columns,
	style,
	classes,
	...props
}: GridProps) => (
	<Flex
		classes={["grid", classes]}
		style={{
			gridTemplateRows: rows?.join(" "),
			gridTemplateColumns: columns?.join(" "),
			...style
		}}
		{...props}
	/>
);

export default Grid;
