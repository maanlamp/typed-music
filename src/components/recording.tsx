import { classes } from "components/layout";
import Note from "components/note";
import { darken, withOpacity } from "lib/color";
import { MidiNoteWithDuration } from "lib/midi";
import usePlayback from "lib/playback";
import { styleVars } from "lib/utils";
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
}>;

const Recording = ({
	recording,
	color,
	units
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
		setSelected(!selected);
	};

	return (
		<div
			tabIndex={0}
			onClick={toggleSelected}
			onKeyDown={e => {
				if (e.key !== " ") return;
				toggleSelected();
			}}
			className={classes([
				"recording",
				selected && "selected"
			])}
			style={
				styleVars({
					left,
					width,
					border,
					background
				}) as any
			}>
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
