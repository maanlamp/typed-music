import { useMemo } from "react";
import { MidiNote, midiNoteToFrequency } from "./midi";
import { merge, omit } from "./state";

type AudioNode = Readonly<{
	oscillator: OscillatorNode;
	gain: GainNode;
}>;

// TODO: Find out how to do this wihtout mutation in React
let nodes: Record<number, AudioNode> = {};
const setNodes = (
	action:
		| typeof nodes
		| ((old: typeof nodes) => typeof nodes)
) => {
	nodes =
		typeof action === "function"
			? action(nodes)
			: action;
};

const useAudio = () => {
	const context = useMemo(
		() => new AudioContext(),
		[]
	);

	const play = (note: MidiNote) => {
		const frequency = midiNoteToFrequency(note);
		const oscillator = context.createOscillator();
		oscillator.type = "triangle";
		oscillator.frequency.value = frequency;
		oscillator.onended = () => {
			setNodes(omit(note.note));
		};

		// TODO: Find out how to get a value from the props
		// that will actually update :(
		const volume = (note.velocity / 127) * 0.2;

		const gain = context.createGain();
		gain.gain.value = 0;
		gain.gain.exponentialRampToValueAtTime(
			volume,
			context.currentTime + 0.03
		);

		oscillator.connect(gain);
		gain.connect(context.destination);
		oscillator.start();

		setNodes(
			merge({
				[note.note]: { oscillator, gain }
			})
		);
	};

	const stop = (note: number) => {
		nodes[note]?.gain.gain
			.cancelScheduledValues(context.currentTime)
			.setTargetAtTime(0, context.currentTime, 0.1)
			.exponentialRampToValueAtTime(
				0.0001,
				context.currentTime + 0.03
			);
		setTimeout(() => {
			// TODO: Somehow, very rarely oscillators can't be
			// stopped because they're already gone...
			// That sounds impossible since calling stop will
			// trigger oscillator.onended which will only at
			// that moment delete the oscillator.
			nodes[note].oscillator.stop();
		}, 30);
	};

	return { play, stop };
};

export default useAudio;
