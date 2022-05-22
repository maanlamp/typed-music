import {
	isMidiNoteWithDuration,
	MidiNote,
	midiNoteToFrequency,
	MidiNoteWithDuration
} from "lib/midi";
import { merge } from "lib/state";
import { useEffect, useRef } from "react";

type AudioNode = Readonly<{
	oscillator: OscillatorNode;
	gain: GainNode;
	reverb?: ConvolverNode;
}>;

// TODO: Reverb? https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
// TODO: attack decay sustain release (ADSR envelope)

type SynthNode = Readonly<{
	type: OscillatorType;
	detune?: number | ((note: MidiNote) => number);
	gain?: number | ((note: MidiNote) => number);
}>;

export type Synthesiser = Readonly<{
	id: number;
	nodes: SynthNode[];
}>;

const MINIMUM_MS_TO_AVOID_CLIPPING = 30;
const MINIMUM_S_TO_AVOID_CLIPPING =
	MINIMUM_MS_TO_AVOID_CLIPPING / 1000;
const AUDIO_CONTEXT = new AudioContext();

type UseAudioParams = Readonly<{
	volume?: number;
}>;

const useAudio = (props?: UseAudioParams) => {
	const gain = useRef(
		(() => {
			const gain = AUDIO_CONTEXT.createGain();
			gain.gain.value = props?.volume ?? 0;
			gain.connect(AUDIO_CONTEXT.destination);
			return gain;
		})()
	);

	const nodes = useRef<
		Record<
			MidiNote["note"],
			Record<Synthesiser["id"], AudioNode[]>
		>
	>({});

	useEffect(() => {
		gain.current.gain.value = props?.volume ?? 0;
	}, [props?.volume]);

	const play = ({
		note,
		synth,
		afterMs = 0
	}: {
		note: MidiNote | MidiNoteWithDuration;
		synth: Synthesiser;
		afterMs?: number;
	}) => {
		// TODO: Find a way to create less objects and reuse oscillators
		// Probably stop using oscillator.start/stop and manipulate its gain instead.
		for (const synthNode of synth.nodes) {
			const oscillator =
				AUDIO_CONTEXT.createOscillator();
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
			const gainNode = AUDIO_CONTEXT.createGain();
			gainNode.gain.value = 0;
			gainNode.gain.exponentialRampToValueAtTime(
				volume,
				AUDIO_CONTEXT.currentTime
			);
			oscillator.connect(gainNode);
			gainNode.connect(gain.current);
			nodes.current = merge<
				Record<
					MidiNote["note"],
					Record<Synthesiser["id"], AudioNode[]>
				>
			>({
				[note.note]: {
					[synth.id]: (
						nodes.current[note.note]?.[synth.id] ?? []
					).concat({
						oscillator,
						gain: gainNode
					})
				}
			})(nodes.current);

			oscillator.start(
				AUDIO_CONTEXT.currentTime + afterMs / 1000
			);

			if (isMidiNoteWithDuration(note)) {
				stop({
					note: note.note,
					synth: synth,
					afterMs: afterMs + note.duration
				});
			}
		}
	};

	const stop = (props?: {
		note: number;
		synth: Synthesiser;
		afterMs?: number;
	}) => {
		if (!props) {
			return Object.values(nodes.current).forEach(
				instruments =>
					Object.values(instruments).forEach(nodes =>
						nodes.forEach(queueStop)
					)
			);
		}

		nodes.current[props.note][props.synth.id].forEach(
			node => queueStop(node, props.afterMs)
		);
	};

	console.log(nodes.current);

	const reset = () => {
		stop();
		nodes.current = {};
	};

	console.log(nodes.current);

	return { play, stop, gain, reset };
};

const queueStop = (
	node: AudioNode,
	afterMs: number = 0
) => {
	const afterSeconds = afterMs / 1000;
	const endSeconds =
		AUDIO_CONTEXT.currentTime +
		afterSeconds +
		MINIMUM_S_TO_AVOID_CLIPPING;

	node.gain.gain
		.cancelScheduledValues(
			AUDIO_CONTEXT.currentTime + afterSeconds
		)
		.setTargetAtTime(
			0,
			AUDIO_CONTEXT.currentTime + afterSeconds,
			0.1
		)
		.exponentialRampToValueAtTime(
			0.0000001,
			endSeconds
		);

	node.oscillator.stop(endSeconds);
};

export default useAudio;
