import { darken } from "lib/color";
import { MidiNoteWithDuration } from "lib/midi";
import usePlayback from "lib/playback";

type NoteProps = Readonly<{
	note: MidiNoteWithDuration;
	color: string;
	units: ReturnType<typeof usePlayback>["units"];
	bpm: number;
}>;

const Note = ({
	note,
	color,
	units,
	bpm
}: NoteProps) => {
	const x =
		(note.time / units.millisecondsPerBeat) *
		units.pixelsPerBeat;
	const y = 1 - note.note / 127;
	const w =
		(note.duration / units.millisecondsPerBeat) *
		units.pixelsPerBeat *
		(100 / bpm);
	return (
		<div
			className={note.note.toString()}
			style={{
				background: darken(color, 0.25),
				position: "absolute",
				left: `${x * (100 / bpm)}px`,
				top: `${y * 100}%`,
				height: "2px",
				width: `${w}px`,
				borderRadius: "999px"
			}}
		/>
	);
};

export default Note;
