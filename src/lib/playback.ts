import { Recording } from "components/recording";
import useAudio, { Synthesiser } from "lib/audio";
import { useEffect, useState } from "react";

type UsePlaybackParams = Readonly<{
	bpm: number;
	signature: [number, number];
	audio: ReturnType<typeof useAudio>;
}>;

const usePlayback = ({
	bpm,
	signature,
	audio
}: UsePlaybackParams) => {
	const [time, setTime] = useState(0);
	const [playing, setPlaying] = useState(false);

	const beatsPerSecond = bpm / 60;
	const beatsPerBar = signature[0];
	const pixelsPerBeat = 32;
	const beatsPerMillisecond = beatsPerSecond / 1000;
	const millisecondsPerBeat = 1000 / beatsPerSecond;
	const units = {
		pixelsPerBeat,
		beatsPerBar,
		wholeNotesPerBeat: signature[1],
		beatsPerSecond,
		beatsPerMillisecond,
		pizelsPerBar: pixelsPerBeat * beatsPerBar,
		pixelsPerSecond: pixelsPerBeat * beatsPerSecond,
		pixelsPerMillisecond:
			pixelsPerBeat * beatsPerMillisecond,
		millisecondsPerBeat,
		millisecondsPerBar:
			millisecondsPerBeat * beatsPerBar
	};

	const playback = ({
		tracks,
		synth,
		time = 0
	}: {
		tracks: Recording[][];
		synth: Synthesiser;
		time?: number;
	}) => {
		for (const track of tracks) {
			for (const recording of track) {
				for (const note of recording.notes) {
					const afterMs =
						recording.start + note.time - time;
					if (afterMs < 0) continue;

					audio.play({
						note,
						synth,
						afterMs,
						time
					});
				}
			}
		}
	};

	const cancel = (tracks: Recording[][]) => {
		for (const track of tracks) {
			for (const recording of track) {
				for (const note of recording.notes) {
					audio.stop(note.note);
				}
			}
		}
	};

	useEffect(() => {
		if (!playing) return;
		let requestedFrame: number;
		let rep = true;
		const update = (start: number) => {
			requestedFrame = requestAnimationFrame(
				currentTime => {
					if (!rep) return;
					setTime(
						time => time + (currentTime - start)
					);
					update(currentTime);
				}
			);
			return requestedFrame;
		};
		update(performance.now());

		return () => {
			rep = false;
			cancelAnimationFrame(requestedFrame);
		};
	}, [playing]);

	return {
		units,
		playback,
		time,
		playing,
		setPlaying,
		setTime,
		cancel
	};
};

export default usePlayback;
