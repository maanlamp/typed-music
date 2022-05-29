import {
	HTMLInputTypeAttribute,
	useState
} from "react";
import "./textfield.css";

type TextfieldProps = Readonly<{
	type?: HTMLInputTypeAttribute;
	value: string | number;
	onChange: (value: string) => void;
}>;

const Textfield = ({
	type = "text",
	value: defaultValue,
	onChange
}: TextfieldProps) => {
	const [value, setValue] = useState<string>(
		defaultValue?.toString()
	);

	return (
		<input
			value={defaultValue}
			className="textfield"
			type={type}
			onChange={({ target: { value } }) => {
				onChange(value);
				setValue(value);
			}}
			style={{
				width: `calc(${value.length}ch + ${
					type === "text" ? "2em" : "2.75em"
				})`
			}}
		/>
	);
};

export default Textfield;
