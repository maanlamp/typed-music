import { darken } from "lib/color";
import { MidiNoteWithDuration } from "lib/midi";

type NoteProps = Readonly<{
	note: MidiNoteWithDuration;
	domain: number;
	color: string;
}>;

const Note = ({ note, domain, color }: NoteProps) => {
	const x = note.time / domain;
	const y = 1 - note.note / 127;
	const w = 10; //(note.time + note.duration) / 10000;
	return (
		<div
			key={note.time}
			className={note.note.toString()}
			style={{
				background: darken(color, 0.25),
				position: "absolute",
				left: `calc(${x * 100}% - ${x} * ${w}px)`,
				top: `calc(${y * 100}% - ${y} * 2px)`,
				height: "2px",
				width: `${w}px`,
				borderRadius: "999px"
			}}
		/>
	);
};

export default Note;
