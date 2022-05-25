import {
	isMidiNoteWithDuration,
	MidiNote,
	midiNoteToFrequency,
	MidiNoteWithDuration
} from "lib/midi";
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

	// TODO: Separate playing a note and a recording,
	// as recordings need to know the bpm while normal
	// notes don't.
	const play = ({
		note,
		instrument,
		bpm = 100,
		afterMs = 0
	}: {
		note: MidiNote | MidiNoteWithDuration;
		instrument: Synthesiser;
		bpm?: number;
		afterMs?: number;
	}) => {
		// TODO: Find a way to create less objects and reuse oscillators
		// Probably stop using oscillator.start/stop and manipulate its gain instead.
		for (const node of instrument.nodes) {
			const oscillator =
				AUDIO_CONTEXT.createOscillator();
			oscillator.type = node.type;
			const frequency = midiNoteToFrequency(note);
			oscillator.frequency.value = frequency;
			const detune =
				typeof node.detune === "function"
					? node.detune(note)
					: node.detune ?? 0;
			oscillator.detune.value = detune;
			const _gain =
				typeof node.gain === "function"
					? node.gain(note)
					: node.gain ?? 1;
			const volume = (note.velocity / 127) * _gain;
			const gainNode = AUDIO_CONTEXT.createGain();
			gainNode.gain.value = 0;
			gainNode.gain.exponentialRampToValueAtTime(
				volume,
				AUDIO_CONTEXT.currentTime
			);
			oscillator.connect(gainNode);
			gainNode.connect(gain.current);
			nodes.current = {
				...nodes.current,
				[note.note]: {
					...nodes.current[note.note],
					[instrument.id]: (
						nodes.current[note.note]?.[
							instrument.id
						] ?? []
					).concat({
						oscillator,
						gain: gainNode
					})
				}
			};

			oscillator.start(
				AUDIO_CONTEXT.currentTime +
					(afterMs / 1000) * (100 / bpm)
			);

			if (isMidiNoteWithDuration(note)) {
				stop({
					note: note.note,
					synth: instrument,
					afterMs:
						(afterMs + note.duration) * (100 / bpm)
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

	const reset = () => {
		stop();
		nodes.current = {};
	};

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
