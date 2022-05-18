import Note from "components/note";
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

	const [selected, setSelected] = useState(false);

	const toggleSelected = () => {
		console.log(recording);
		setSelected(!selected);
	};

	return (
		<div
			onClick={toggleSelected}
			key={recording.start}
			className={classes([
				"recording",
				selected && "selected"
			])}
			style={styleVars({
				start: `${recording.start}px`,
				end: `${recording.end}px`,
				border,
				background
			})}>
			{recording.notes.map(note => (
				<Note
					key={note.time}
					note={note}
					domain={Math.max(
						...recording.notes.map(
							note => note.time + note.duration
						)
					)}
					color={color}
				/>
			))}
		</div>
	);
};

export default Recording;
