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

	const playback = (
		recording: Recording,
		synth: Synthesiser
	) => {
		for (const note of recording.notes) {
			audio.play({
				note,
				synth,
				afterMs: recording.start + note.time
			});
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
		setTime
	};
};

export default usePlayback;
