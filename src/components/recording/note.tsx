import { AppState } from "lib/state";
import {
	type Recording,
	type TemporalNote
} from "lib/track";
import "./note.css";

type NoteProps = Readonly<{
	recording: Recording;
	note: TemporalNote;

	// Passing these props is vastly more performant than
	// using `useApp` for every note (expected to be hundreds/thousands).
	time: AppState["time"];
	pxPerMs: AppState["pxPerMs"];
}>;

const Note = ({
	recording,
	note,
	time,
	pxPerMs
}: NoteProps) => (
	<div
		className="note"
		style={{
			width: `${
				pxPerMs *
				(note.duration ??
					(time - recording.start) * pxPerMs)
			}px`,
			left: note.time * pxPerMs,
			bottom: `calc(${note.note / 127} * (100% - 1px))`
		}}
	/>
);

export default Note;
