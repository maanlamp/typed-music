import { useEffect, useState } from "react";
import {
	constants,
	Note,
	noteFromFrequency,
	noteToString
} from "./note";

class AudioError extends Error {
	readonly name = "AudioError";
}

const midiMessageTypes = {
	128: "noteOff",
	144: "noteOn"
} as const;

export type MidiNote = Readonly<{
	note: Note;
	velocity: number;
}>;

export const midiNoteToFequency = (note: number) =>
	constants.A_4_FREQ * Math.pow(2, (note - 69) / 12);

type UseMidiParams = Readonly<{
	playNote: (
		note: Note,
		velocity: number
	) => Promise<() => void>;
}>;

const notes: Record<string, Promise<() => void>> = {};

const useMidi = ({ playNote }: UseMidiParams) => {
	const [midi, setMidi] =
		useState<WebMidi.MIDIAccess>();

	const play = ({ note, velocity }: MidiNote) =>
		(notes[noteToString(note)] = playNote(
			note,
			velocity
		));

	const stop = (note: Note) => {
		const key = noteToString(note);
		if (!notes[key])
			throw new AudioError(
				`Cannot stop a note that is not playing (${key}).`
			);
		notes[noteToString(note)].then(stop => {
			stop();
			delete notes[noteToString(note)];
		});
	};

	const handleMessage = (
		event: WebMidi.MIDIMessageEvent
	) => {
		const type =
			midiMessageTypes[
				(event.data[0] &
					0xf0) as keyof typeof midiMessageTypes
			];
		const note = noteFromFrequency(
			midiNoteToFequency(event.data[1])
		);
		switch (type) {
			case "noteOn":
				return play({
					note,
					velocity: event.data[2]
				});
			case "noteOff":
				return stop(note);
		}
	};

	useEffect(() => {
		navigator.requestMIDIAccess().then(midi => {
			setMidi(midi);
			midi.inputs.forEach(input => {
				input.addEventListener(
					"midimessage",
					handleMessage
				);
			});
		});

		return () => {
			midi?.inputs.forEach(input => {
				input.removeEventListener(
					"midimessage",
					handleMessage as any
				);
			});
		};
	}, []);

	return midi?.inputs && [...midi.inputs.values()];
};

export default useMidi;
