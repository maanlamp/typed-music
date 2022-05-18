import { Recording } from "components/recording";
import useAudio, { Synthesiser } from "lib/audio";

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
			setTimeout(() => {
				console.log("play", note, synth);
				audio.play({ note, synth });
				setTimeout(() => {
					console.log("stop", note);
					audio.stop(note.note);
				}, note.duration);
			}, note.time);
		}
	};

	return { units, playback };
};

export default usePlayback;
