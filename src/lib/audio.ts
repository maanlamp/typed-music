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

export type Synthesiser = Readonly<{
	type: OscillatorType;
	detune?: number | ((note: MidiNote) => number);
	gain?: number | ((note: MidiNote) => number);
}>[];

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

	const nodes = useRef<Record<number, AudioNode[]>>(
		{}
	);

	useEffect(() => {
		gain.current.gain.value = props?.volume ?? 0;
	}, [props?.volume]);

	const play = ({
		note,
		synth,
		afterMs
	}: {
		note: MidiNote | MidiNoteWithDuration;
		synth: Synthesiser;
		afterMs?: number;
	}) => {
		for (const synthNode of synth) {
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
				Record<number, AudioNode[]>
			>({
				[note.note]: (
					nodes.current[note.note] ?? []
				).concat({
					oscillator,
					gain: gainNode
				})
			})(nodes.current);

			oscillator.start(
				AUDIO_CONTEXT.currentTime +
					(afterMs ?? 0) / 1000
			);

			if (isMidiNoteWithDuration(note)) {
				stop(note.note, note.time + note.duration);
			}
		}
	};

	const stop = (note: number, afterMs?: number) => {
		const afterSeconds = (afterMs ?? 0) / 1000;
		const endSeconds =
			AUDIO_CONTEXT.currentTime +
			afterSeconds +
			MINIMUM_S_TO_AVOID_CLIPPING;
		nodes.current[note]?.forEach(node => {
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
		});
	};

	return { play, stop, gain };
};

export default useAudio;
