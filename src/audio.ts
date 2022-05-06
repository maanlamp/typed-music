import { useEffect, useMemo } from "react";
import { MidiNote, midiNoteToFrequency } from "./midi";
import { merge, omit, useRefState } from "./state";

type AudioNode = Readonly<{
	oscillator: OscillatorNode;
	gain: GainNode;
}>;

const MINIMUM_FALLOFF_MS = 10;

type UseAudioParams = Readonly<{
	gain?: number;
}>;

const useAudio = (props?: UseAudioParams) => {
	const context = useMemo(
		() => new AudioContext(),
		[]
	);

	const [nodes, setNodes] = useRefState<
		Record<number, AudioNode>
	>({});

	useEffect(() => {
		if (props?.gain === undefined) return;
		Object.values(nodes()).forEach(node => {
			if (props.gain === 0) {
				node.gain.gain.value = 0;
			} else {
				node.gain.gain.exponentialRampToValueAtTime(
					props.gain!,
					context.currentTime +
						MINIMUM_FALLOFF_MS / 1000
				);
			}
		});
	}, [props?.gain]);

	const play = (note: MidiNote) => {
		const frequency = midiNoteToFrequency(note);
		const oscillator = context.createOscillator();
		oscillator.type = "triangle";
		oscillator.frequency.value = frequency;
		oscillator.onended = () => {
			setNodes(omit(note.note));
		};

		const volume = Math.min(
			note.velocity / 127,
			props?.gain ?? 1
		);

		const gain = context.createGain();
		gain.gain.value = 0;
		gain.gain.exponentialRampToValueAtTime(
			volume,
			context.currentTime + MINIMUM_FALLOFF_MS / 1000
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
		nodes()
			[note].gain.gain.cancelScheduledValues(
				context.currentTime
			)
			.setTargetAtTime(0, context.currentTime, 0.1)
			.exponentialRampToValueAtTime(
				0.0001,
				context.currentTime + MINIMUM_FALLOFF_MS / 1000
			);
		setTimeout(() => {
			nodes()[note].oscillator.stop();
		}, MINIMUM_FALLOFF_MS);
	};

	return { play, stop };
};

export default useAudio;
