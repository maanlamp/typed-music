import {
	MidiNote,
	midiNoteToFrequency
} from "lib/midi";
import { merge, omit, useRefState } from "lib/state";
import { useEffect, useMemo, useRef } from "react";

type AudioNode = Readonly<{
	oscillator: OscillatorNode;
	gain: GainNode;
	reverb?: ConvolverNode;
}>;

// TODO: Reverb? https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
// TODO: attack decay sustain release (ADSR envelope)

export type Synthesiser = Readonly<{
	type: OscillatorType;
	detune?: number | ((note: MidiNote) => number);
	gain?: number | ((note: MidiNote) => number);
}>[];

const MINIMUM_MS_TO_AVOID_CLIPPING = 30;

type UseAudioParams = Readonly<{
	volume?: number;
}>;

const useAudio = (props?: UseAudioParams) => {
	const context = useMemo(
		() => new AudioContext(),
		[]
	);

	const gain = useRef(
		(() => {
			const gain = context.createGain();
			gain.gain.value = props?.volume ?? 0;
			gain.connect(context.destination);
			return gain;
		})()
	);

	useEffect(() => {
		gain.current.gain.value = props?.volume ?? 0;
	}, [props?.volume]);

	const [nodes, setNodes] = useRefState<
		Record<number, AudioNode[]>
	>({});

	const play = ({
		note,
		synth
	}: {
		note: MidiNote;
		synth: Synthesiser;
	}) => {
		for (const synthNode of synth) {
			const oscillator = context.createOscillator();
			oscillator.type = synthNode.type;

			const frequency = midiNoteToFrequency(note);
			oscillator.frequency.value = frequency;

			const detune =
				typeof synthNode.detune === "function"
					? synthNode.detune(note)
					: synthNode.detune ?? 0;
			oscillator.detune.value = detune;

			const _gain =
				typeof synthNode.gain === "function"
					? synthNode.gain(note)
					: synthNode.gain ?? 1;
			const volume = (note.velocity / 127) * _gain;

			const gainNode = context.createGain();
			gainNode.gain.value = 0;
			gainNode.gain.exponentialRampToValueAtTime(
				volume,
				context.currentTime
			);

			oscillator.connect(gainNode);
			gainNode.connect(gain.current);
			oscillator.start();

			setNodes(
				merge({
					[note.note]: (
						nodes()[note.note] ?? []
					).concat({
						oscillator,
						gain: gainNode
					})
				})
			);
		}
	};

	const stop = (note: number) => {
		nodes()[note]?.forEach(node => {
			node.gain.gain
				.cancelScheduledValues(context.currentTime)
				.setTargetAtTime(0, context.currentTime, 0.1)
				.exponentialRampToValueAtTime(
					0.0001,
					context.currentTime +
						MINIMUM_MS_TO_AVOID_CLIPPING / 1000
				);
		});
		setTimeout(() => {
			nodes()[note]?.forEach(node => {
				node.oscillator.stop();
			});
			setNodes(omit(note));
		}, MINIMUM_MS_TO_AVOID_CLIPPING);
	};

	return { play, stop, gain };
};

export default useAudio;
