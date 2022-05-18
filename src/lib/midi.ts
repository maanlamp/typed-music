import { useEffect, useState } from "react";

const midiMessageTypes = {
	128: "noteOff",
	144: "noteOn"
} as const;

export type MidiNote = Readonly<{
	note: number;
	velocity: number;
	time: number;
}>;

export type MidiNoteWithDuration = MidiNote &
	Readonly<{
		duration: number;
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
	const [inputs, setInputs] = useState<
		WebMidi.MIDIInput[]
	>([]);

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
					velocity,
					time: performance.now()
				});
			case "noteOff":
				return stop(note);
		}
	};

	const handleStateChange = (
		event: WebMidi.MIDIConnectionEvent
	) => {
		setInputs(
			Array.from(
				(
					event.target as WebMidi.MIDIAccess
				).inputs.values()
			)
		);
	};

	useEffect(() => {
		navigator.requestMIDIAccess().then(midi => {
			setMidi(midi);

			midi.addEventListener(
				"statechange",
				handleStateChange
			);

			midi.inputs.forEach(input => {
				input.addEventListener(
					"midimessage",
					handleMessage
				);
			});
		});

		return () => {
			inputs.forEach(input => {
				input.removeEventListener(
					"midimessage",
					handleMessage as any
				);
			});

			midi?.removeEventListener(
				"statechange",
				handleStateChange as any
			);
		};
	}, []);

	return inputs;
};

export default useMidi;
