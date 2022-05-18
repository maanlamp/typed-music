import { MS_PER_BEAT, PX_PER_BEAT } from "index";
import { darken } from "lib/color";
import { MidiNoteWithDuration } from "lib/midi";

type NoteProps = Readonly<{
	note: MidiNoteWithDuration;
	color: string;
}>;

const Note = ({ note, color }: NoteProps) => {
	const x = (note.time / MS_PER_BEAT) * PX_PER_BEAT;
	const y = 1 - note.note / 127;
	const w =
		(note.duration / MS_PER_BEAT) * PX_PER_BEAT;
	return (
		<div
			className={note.note.toString()}
			style={{
				background: darken(color, 0.25),
				position: "absolute",
				left: `${x}px`,
				top: `${y * 100}%`,
				height: "2px",
				width: `${w}px`,
				borderRadius: "999px"
			}}
		/>
	);
};

export default Note;
