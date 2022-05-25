type UseUnitsProps = Readonly<{
	bpm: number;
	signature: readonly [number, number];
}>;

const useUnits = ({
	bpm,
	signature
}: UseUnitsProps) => {
	const beatsPerSecond = bpm / 60;
	const beatsPerBar = signature[0];
	const pixelsPerBeat = 32 * (100 / bpm);
	const beatsPerMillisecond = beatsPerSecond / 1000;
	const millisecondsPerBeat = 1000 / beatsPerSecond;

	return {
		pixelsPerBeat,
		beatsPerBar,
		wholeNotesPerBeat: signature[1],
		beatsPerSecond,
		beatsPerMillisecond,
		pixelsPerBar: pixelsPerBeat * beatsPerBar,
		pixelsPerSecond: pixelsPerBeat * beatsPerSecond,
		pixelsPerMillisecond:
			pixelsPerBeat * beatsPerMillisecond,
		millisecondsPerBeat,
		millisecondsPerBar:
			millisecondsPerBeat * beatsPerBar
	};
};

export default useUnits;
