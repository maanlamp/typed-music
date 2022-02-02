import { useEffect, useState } from "react";

class AudioError extends Error {
	readonly name = "AudioError";
}

const midiMessageTypes = {
	128: "noteOff",
	144: "noteOn"
} as const;

export type MidiNote = Readonly<{
	note: number;
	velocity: number;
}>;

export const midiNoteToFrequency = ({
	note
}: MidiNote) => 2 ** ((note - 69) / 12) * 440;

type UseMidiParams = Readonly<{
	play: (note: MidiNote) => any;
	stop: (note: number) => any;
}>;

const useMidi = ({ play, stop }: UseMidiParams) => {
	const [midi, setMidi] =
		useState<WebMidi.MIDIAccess>();

	const handleMessage = (
		event: WebMidi.MIDIMessageEvent
	) => {
		const type =
			midiMessageTypes[
				(event.data[0] &
					0xf0) as keyof typeof midiMessageTypes
			];
		const note = event.data[1];
		const velocity = event.data[2];
		switch (type) {
			case "noteOn":
				return play({
					note,
					velocity
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
