import Column from "components/column";
import "components/layout.css";
import { type Track } from "components/track";
import Tracks from "components/tracks";
import "index.css";
import useAudio, { Synthesiser } from "lib/audio";
import useMidi, {
	MidiNoteWithDuration
} from "lib/midi";
import { set } from "lib/state";
import { repeat } from "lib/utils";
import React, {
	createContext,
	useContext,
	useState
} from "react";
import ReactDOM from "react-dom";

// TODO: Visualise current input with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

type AppState = Readonly<{
	instruments: readonly Synthesiser[];
	tracks: Record<Track["id"], Track>;
	bpm: number;
	volume: number;
	signature: readonly [number, number];
	playing: boolean;
	recording: boolean;
	time: number;
	units: {
		pixelsPerBeat: number;
		beatsPerBar: number;
		wholeNotesPerBeat: number;
		beatsPerSecond: number;
		beatsPerMillisecond: number;
		pixelsPerBar: number;
		pixelsPerSecond: number;
		pixelsPerMillisecond: number;
		millisecondsPerBeat: number;
		millisecondsPerBar: number;
	};
}>;

const defaultAppState: AppState = {
	instruments: [],
	tracks: {},
	bpm: 0,
	volume: 0,
	signature: [0, 0],
	playing: false,
	recording: false,
	time: 0,
	units: {
		pixelsPerBeat: 0,
		beatsPerBar: 0,
		wholeNotesPerBeat: 0,
		beatsPerSecond: 0,
		beatsPerMillisecond: 0,
		pixelsPerBar: 0,
		pixelsPerSecond: 0,
		pixelsPerMillisecond: 0,
		millisecondsPerBeat: 0,
		millisecondsPerBar: 0
	}
};

const app = createContext<
	| readonly [
			AppState,
			<V>(
				chain: string,
				value: V | ((old: V) => V)
			) => void
	  ]
>([defaultAppState, () => {}]);

enum Interval {
	Cent = 1,
	Semitone = 100,
	Tone = 200,
	Octave = 1200
}

const organ: Synthesiser = {
	id: 0,
	nodes: [
		{
			type: "sine",
			detune: Interval.Octave * -1,
			gain: 1
		},
		{
			type: "sine",
			gain: 1
		},
		{
			type: "sine",
			detune: Interval.Octave,
			gain: 0.5
		},
		{
			type: "sine",
			detune: Interval.Octave * 2,
			gain: 0.25
		},
		{
			type: "sine",
			detune: Interval.Octave * 3,
			gain: 0.125
		}
	]
};

const useAppState = () => useContext(app);

export default useAppState;

const App = () => {
	const [signature, setSignature] = useState<
		readonly [number, number]
	>([4, 4]);
	const [bpm, setBpm] = useState(100);
	const [volume, setVolume] = useState(0.05);
	const audio = useAudio({ volume });
	useMidi({
		play: note =>
			audio.play({ note, instrument: organ }),
		stop: note => audio.stop({ note, synth: organ })
	});
	const beatsPerSecond = bpm / 60;
	const beatsPerBar = signature[0];
	const pixelsPerBeat = 32 * (100 / bpm);
	const beatsPerMillisecond = beatsPerSecond / 1000;
	const millisecondsPerBeat = 1000 / beatsPerSecond;
	const units = {
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

	const [state, setState] = useState<AppState>({
		units,
		time: 0,
		signature: [4, 4],
		bpm: 100,
		volume: 0.05,
		instruments: [organ],
		playing: false,
		recording: false,
		tracks: {
			"0": {
				id: "0",
				isRecording: false,
				mono: false,
				pan: 0.5,
				muted: false,
				locked: true,
				volume: [1, 1],
				solo: false,
				recordings: [
					{
						start: 0,
						end: units.millisecondsPerBar * 2,
						bpm: 100,
						notes: (
							[
								[81, 2],
								[76, 1],
								[74, 1],
								[73, 2],
								[null, 1],
								[73, 1],
								[73, 1],
								[74, 1],
								[76, 1],
								[78, 1],
								[74, 2],
								[null, 2],
								[78, 1],
								[76, 1],
								[74, 1],
								[73, 1],
								[71, 1],
								[73, 1],
								[74, 1],
								[78, 1],
								[76, 1],
								[74, 1],
								[73, 1],
								[71, 1],
								[69, 2]
							] as [null | number, number][]
						)
							.map(
								([note, duration], i, all) =>
									note && {
										note,
										velocity: 127,
										time:
											all
												.slice(0, i)
												.map(([, d]) => d)
												.reduce((x, d) => x + d, 0) *
											(units.millisecondsPerBeat / 4),
										duration:
											(units.millisecondsPerBeat / 4) *
											duration
									}
							)
							.filter(
								Boolean
							) as MidiNoteWithDuration[]
					},
					{
						start: units.millisecondsPerBar * 2,
						end: units.millisecondsPerBar * 4,
						bpm: 100,
						notes: (
							[
								[73, 1],
								[71, 1],
								[73, 2],
								[73, 2],
								[71, 1],
								[73, 1],
								[74, 2],
								[73, 1],
								[71, 1],
								[73, 2],
								[69, 2],
								[69, 1],
								[71, 1],
								[73, 1],
								[74, 1],
								[73, 1],
								[71, 1],
								[69, 1],
								[76, 1],
								[73, 2]
							] as [number | null, number][]
						)
							.map(
								([note, duration], i, all) =>
									note && {
										note,
										velocity: 127,
										time:
											all
												.slice(0, i)
												.map(([, d]) => d)
												.reduce((x, d) => x + d, 0) *
											(units.millisecondsPerBeat / 4),
										duration:
											(units.millisecondsPerBeat / 4) *
											duration
									}
							)
							.filter(
								Boolean
							) as MidiNoteWithDuration[]
					},
					{
						start: units.millisecondsPerBar * 4,
						end: units.millisecondsPerBar * 6,
						bpm: 100,
						notes: (
							[
								[73, 1],
								[71, 1],
								[73, 2],
								[73, 2],
								[71, 1],
								[73, 1],
								[74, 2],
								[73, 1],
								[71, 1],
								[73, 2],
								[69, 2],
								[69, 1],
								[71, 1],
								[73, 1],
								[74, 1],
								[73, 1],
								[71, 1],
								[69, 1],
								[76, 1],
								[73, 2]
							] as [number | null, number][]
						)
							.map(
								([note, duration], i, all) =>
									note && {
										note,
										velocity: 127,
										time:
											all
												.slice(0, i)
												.map(([, d]) => d)
												.reduce((x, d) => x + d, 0) *
											(units.millisecondsPerBeat / 4),
										duration:
											(units.millisecondsPerBeat / 4) *
											duration
									}
							)
							.filter(
								Boolean
							) as MidiNoteWithDuration[]
					}
				]
			},
			"1": {
				id: "1",
				isRecording: false,
				mono: false,
				pan: 0.5,
				muted: false,
				locked: true,
				volume: [1, 1],
				solo: false,
				recordings: [
					{
						start: units.millisecondsPerBar * 2,
						end: units.millisecondsPerBar * 6,
						bpm: 100,
						notes: (
							repeat(2)([
								[45, 3],
								[null, 1],
								[40, 3],
								[null, 1],
								[45, 3],
								[null, 1],
								[40, 3],
								[null, 1],
								[45, 3],
								[null, 1],
								[40, 3],
								[null, 1],
								[45, 3],
								[null, 1],
								[40, 3],
								[null, 1]
							]) as [number | null, number][]
						)
							.map(
								([note, duration], i, all) =>
									note && {
										note,
										velocity: 127,
										time:
											all
												.slice(0, i)
												.map(([, d]) => d)
												.reduce((x, d) => x + d, 0) *
											(units.millisecondsPerBeat / 4),
										duration:
											(units.millisecondsPerBeat / 4) *
											duration
									}
							)
							.filter(
								Boolean
							) as MidiNoteWithDuration[]
					}
				]
			}
		}
	});

	const update = (...args: Parameters<typeof set>) => {
		if (
			["signature", "bpm", "volume"].includes(args[0])
		) {
			((
				{
					signature: setSignature,
					bpm: setBpm,
					volume: setVolume
				}[args[0]] as Function
			)(args[1]));
		}
		setState(set(...args));
	};

	if (!state) return <div>Loading...</div>;

	return (
		<app.Provider value={[state, update]}>
			<Column as="main" grow>
				<Tracks audio={audio} />
			</Column>
		</app.Provider>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
