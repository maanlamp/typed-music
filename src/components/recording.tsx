import Note from "components/note";
import { PX_PER_MILLISECOND } from "index";
import { darken, withOpacity } from "lib/color";
import { MidiNoteWithDuration } from "lib/midi";
import { classes, styleVars } from "lib/utils";
import { useState } from "react";
import "./recording.css";

export type Recording = Readonly<{
	start: number;
	end: number;
	notes: MidiNoteWithDuration[];
}>;

type RecordingProps = Readonly<{
	recording: Recording;
	color: string;
}>;

const Recording = ({
	recording,
	color
}: RecordingProps) => {
	const background = withOpacity(color, 0.75);
	const border = darken(color, 0.05);
	const duration = recording.end - recording.start;
	const width = `${duration * PX_PER_MILLISECOND}px`;
	const left = `${
		recording.start * PX_PER_MILLISECOND
	}px`;

	const [selected, setSelected] = useState(false);

	const toggleSelected = () => {
		console.log(recording);
		setSelected(!selected);
	};

	return (
		<div
			onClick={toggleSelected}
			className={classes([
				"recording",
				selected && "selected"
			])}
			style={styleVars({
				left,
				width,
				border,
				background
			})}>
			{recording.notes.map((note, i) => (
				<Note key={i} note={note} color={color} />
			))}
		</div>
	);
};

export default Recording;
