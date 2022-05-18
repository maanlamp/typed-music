import Note from "components/note";
import { darken, withOpacity } from "lib/color";
import { MidiNoteWithDuration } from "lib/midi";
import usePlayback from "lib/playback";
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
	units: ReturnType<typeof usePlayback>["units"];
	playback: (recording: Recording) => void;
}>;

const Recording = ({
	recording,
	color,
	units,
	playback
}: RecordingProps) => {
	const background = withOpacity(color, 0.75);
	const border = darken(color, 0.05);
	const duration = recording.end - recording.start;
	const width = `${
		duration * units.pixelsPerMillisecond
	}px`;
	const left = `${
		recording.start * units.pixelsPerMillisecond
	}px`;

	const [selected, setSelected] = useState(false);

	const toggleSelected = () => {
		console.log(recording);
		setSelected(!selected);
	};

	return (
		<div
			onClick={() => {
				toggleSelected();
				playback(recording);
			}}
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
				<Note
					key={i}
					note={note}
					color={color}
					units={units}
				/>
			))}
		</div>
	);
};

export default Recording;
