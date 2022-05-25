import useAppState from "index";
import useAudio, { Synthesiser } from "lib/audio";
import { useEffect } from "react";

const usePlayback = (
	audio: ReturnType<typeof useAudio>
) => {
	const [{ time, tracks, playing, bpm }, set] =
		useAppState();

	const start = (synth: Synthesiser) => {
		for (const track of Object.values(tracks)) {
			for (const recording of track.recordings) {
				for (const note of recording.notes) {
					const afterMs =
						recording.start + note.time - time;
					if (afterMs < 0) continue;

					audio.play({
						note,
						instrument: synth,
						bpm,
						afterMs
					});
				}
			}
		}
	};

	const stop = () => {
		audio.stop();
	};

	useEffect(() => {
		if (!playing) return;
		let requestedFrame: number;
		let rep = true;
		const update = (start: number) => {
			requestedFrame = requestAnimationFrame(
				currentTime => {
					if (!rep) return;
					set<typeof time>(
						"time",
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

	const reset = (synth: Synthesiser) => {
		stop();
		set("time", 0);
		audio.reset();
		if (playing) start(synth);
	};

	return {
		start,
		reset,
		stop
	};
};

export default usePlayback;
