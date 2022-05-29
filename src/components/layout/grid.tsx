import Flex, {
	FlexProps
} from "components/layout/flex";

type GridProps = FlexProps &
	Readonly<{
		rows?: ReadonlyArray<string>;
		columns?: ReadonlyArray<string>;
	}>;

const Grid = ({
	classes,
	style,
	rows = ["1fr"],
	columns = ["1fr"],
	...props
}: GridProps) => (
	<Flex
		classes={["grid", classes]}
		style={{
			gridTemplateRows: rows.join(" "),
			gridTemplateColumns: columns.join(" "),
			...style
		}}
		{...props}
	/>
);

export default Grid;
