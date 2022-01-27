import { useEffect, useRef } from "react";
import {
	Note,
	noteToFrequency,
	noteToString
} from "./note";

const useAudio = () => {
	const context = useRef<AudioContext>();
	const oscillators = useRef<
		Record<string, OscillatorNode>
	>({});

	useEffect(() => {
		context.current = new AudioContext();
	}, []);

	const play = async (
		note: Note,
		velocity: number = 127
	) => {
		if (!context.current) return () => {};

		if (context.current.state === "suspended")
			await context.current.resume();

		const inCache =
			!!oscillators.current[noteToString(note)];
		const oscillator = (oscillators.current[
			noteToString(note)
		] ??= new OscillatorNode(context.current));

		const gain = context.current.createGain();
		gain.gain.setValueAtTime(
			(velocity / 127) * 0.33,
			context.current.currentTime
		);
		gain.connect(context.current.destination);

		if (!inCache) {
			oscillator.type = "sine";
			oscillator.frequency.value =
				noteToFrequency(note);
			oscillator.connect(gain);
			oscillator.onended = () => {
				delete oscillators.current[noteToString(note)];
			};
			oscillator.start();
		}

		return () => {
			if (context.current) {
				// This is a way to ramp down the gain value to prevent an audible "pop".
				gain.gain
					.cancelScheduledValues(
						context.current.currentTime
					)
					.setTargetAtTime(
						0,
						context.current.currentTime,
						0.1
					)
					.exponentialRampToValueAtTime(
						0.0001,
						context.current.currentTime + 0.03
					);
			}
			setTimeout(() => oscillator.stop(), 150);
		};
	};

	return { play, oscillators };
};

export default useAudio;
