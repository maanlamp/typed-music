import { colors } from "lib/color";
import useTime from "lib/time";
import { Note, Track } from "lib/track";
import {
	createContext,
	Reducer,
	useContext,
	useEffect
} from "react";
import { v4 as uuid } from "uuid";

export type AppState = Readonly<{
	time: number;
	playing: boolean;
	bpm: number;
	pxPerMs: number;
	signature: readonly [number, number];
	tracks: Record<Track["id"], Track>;
	drawersOpen?: boolean;
	audio: AudioContext;
}>;

export type AppStateReducer = Reducer<
	AppState,
	AppStateActions
>;

type Action<
	K extends string,
	T extends Record<string, any> = {}
> = Readonly<
	{
		type: K;
	} & T
>;

type Setter<T> = T | ((previous: T) => T);
const set =
	<T>(setter: Setter<T>) =>
	(previous: T) =>
		typeof setter === "function"
			? (setter as Function)(previous)
			: setter;

export type AppStateActions =
	| Action<
			"setTime",
			{ time: Setter<AppState["time"]> }
	  >
	| Action<
			"setPlaying",
			{ playing: Setter<AppState["playing"]> }
	  >
	| Action<"addTrack", Pick<Track, "name">>
	| Action<"removeTrack", Pick<Track, "id">>
	| Action<"toggleTrackMute", Pick<Track, "id">>
	| Action<"toggleTrackIsRecording", Pick<Track, "id">>
	| Action<"toggleTrackLocked", Pick<Track, "id">>
	| Action<
			"panTrack",
			{ id: Track["id"]; pan: Setter<Track["pan"]> }
	  >
	| Action<
			"setTrackVolume",
			{
				id: Track["id"];
				volume: Setter<Track["volume"]>;
			}
	  >
	| Action<"setBpm", { bpm: Setter<AppState["bpm"]> }>
	| Action<
			"setSignature",
			{ signature: Setter<AppState["signature"]> }
	  >
	| Action<"toggleDrawers">;

const omit =
	<T extends Record<string, any>>(key: keyof T) =>
	(target: T) => {
		const { [key]: _, ...rest } = target;
		return rest;
	};

export const reducer: Reducer<
	AppState,
	AppStateActions
> = (state, action) => {
	switch (action.type) {
		case "setPlaying": {
			const playing = set(action.playing)(
				state.playing
			);
			if (playing) {
				state.audio.resume();
			} else {
				state.audio.suspend();
			}
			return {
				...state,
				playing
			};
		}
		case "setTime":
			return {
				...state,
				time: set(action.time)(state.time)
			};
		case "addTrack": {
			const id = uuid();
			const colorz = Object.values(colors);
			return {
				...state,
				tracks: {
					...state.tracks,
					[id]: {
						name: action.name,
						color:
							colorz[
								Object.keys(state.tracks).length %
									colorz.length
							]["500"],
						muted: false,
						volume: [1, 1],
						isRecording: false,
						locked: true,
						pan: 0,
						recordings: [],
						id
					}
				}
			};
		}
		case "removeTrack":
			return {
				...state,
				tracks: omit(action.id)(state.tracks)
			};
		case "toggleTrackMute":
			return {
				...state,
				tracks: {
					...state.tracks,
					[action.id]: {
						...state.tracks[action.id],
						muted: !state.tracks[action.id].muted
					}
				}
			};
		case "toggleTrackIsRecording":
			return {
				...state,
				tracks: {
					...state.tracks,
					[action.id]: {
						...state.tracks[action.id],
						isRecording:
							!state.tracks[action.id].isRecording
					}
				}
			};
		case "toggleTrackLocked":
			return {
				...state,
				tracks: {
					...state.tracks,
					[action.id]: {
						...state.tracks[action.id],
						locked: !state.tracks[action.id].locked
					}
				}
			};
		case "panTrack":
			return {
				...state,
				tracks: {
					...state.tracks,
					[action.id]: {
						...state.tracks[action.id],
						pan: set(action.pan)(
							state.tracks[action.id].pan
						)
					}
				}
			};
		case "setTrackVolume":
			return {
				...state,
				tracks: {
					...state.tracks,
					[action.id]: {
						...state.tracks[action.id],
						volume: set(action.volume)(
							state.tracks[action.id].volume
						)
					}
				}
			};
		case "setBpm": {
			const bpm = set(action.bpm)(state.bpm);
			return {
				...state,
				pxPerMs: (100 / bpm) * 0.15,
				bpm
			};
		}
		case "setSignature":
			return {
				...state,
				signature: set(action.signature)(
					state.signature
				)
			};
		case "toggleDrawers":
			return {
				...state,
				drawersOpen: !state.drawersOpen
			};
	}
};

const midiNoteToFrequency = ({ note }: Note) =>
	2 ** ((note - 69) / 12) * 440;

const repeat =
	(n: number) =>
	<T>(f: (i: number) => T): T[] =>
		[...Array(n).keys()].map(f);

export const initialState: AppState = {
	audio: new AudioContext(),
	playing: false,
	time: 0,
	bpm: 100,
	pxPerMs: 0.15,
	signature: [4, 4],
	drawersOpen: true,
	tracks: Object.fromEntries(
		(
			[
				{
					color: colors["malachite"]["500"],
					name: "Synth (Organ)",
					locked: true,
					volume: [1, 1],
					pan: 0,
					muted: false,
					isRecording: false,
					recordings: [
						{
							id: uuid(),
							name: "test.midi",
							start: 0,
							end: 3000,
							notes: [...Array(127).keys()].map(
								note => ({
									id: uuid(),
									note,
									velocity: 127,
									time: (note / 127) * 3000,
									duration: (1 / 127) * 3000
								})
							)
						}
					]
				},
				...repeat(12)(
					i =>
						({
							color: Object.values(colors).map(
								col => col["500"]
							)[
								(i + 1) % Object.values(colors).length
							],
							name: "Synth (Bass)",
							locked: true,
							volume: [1, 1],
							pan: 0,
							muted: false,
							isRecording: false,
							recordings: repeat(2)(i => ({
								id: uuid(),
								name: "bass.midi",
								start: i * 3000,
								end: (i + 1) * 3000,
								notes: [
									{
										id: uuid(),
										note: 69 - 12 - 12,
										velocity: 127,
										time: 0,
										duration: 3000
									}
								]
							}))
						} as Omit<Track, "id">)
				)
			] as Omit<Track, "id">[]
		).map(track => {
			const id = uuid();
			return [id, { ...track, id }];
		})
	) as any
};

export const AppContext = createContext<
	readonly [AppState, React.Dispatch<AppStateActions>]
>([initialState, () => initialState]);

let started = false;
let oscillators: Record<Note["id"], OscillatorNode>;
let gain: GainNode;
let timeouts: any[] = [];
export const useApp = () => {
	const context = useContext(AppContext);
	const [state, dispatch] = context;

	useTime();

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--px-per-ms",
			`${state.pxPerMs}px`
		);
	}, [state.pxPerMs]);

	useEffect(() => {
		if (started) return;

		if (!oscillators && !gain) {
			oscillators = Object.fromEntries(
				Object.values(state.tracks)
					.flatMap(track =>
						Object.values(track.recordings)
					)
					.flatMap(recording => recording.notes)
					.map(
						note =>
							[
								note.id,
								new OscillatorNode(state.audio, {
									type: "sine",
									frequency: midiNoteToFrequency(note)
								})
							] as const
					)
			);
			gain = new GainNode(state.audio, {
				gain: 0.01
			});
			gain.connect(state.audio.destination);
			Object.values(state.tracks)
				.flatMap(track =>
					Object.values(track.recordings)
				)
				.flatMap(recording => recording.notes)
				.forEach(note => {
					oscillators[note.id].start();
				});
		}

		if (state.playing) {
			started = true;
			Object.values(state.tracks)
				.flatMap(track =>
					Object.values(track.recordings)
				)
				.forEach(recording =>
					recording.notes.forEach(note => {
						const whenStart =
							recording.start + note.time - state.time;
						const whenStop =
							whenStart + (note.duration ?? 0);
						if (whenStart >= 0 && whenStop > 0) {
							timeouts.push(
								setTimeout(() => {
									oscillators[note.id].connect(gain);
								}, whenStart)
							);
							timeouts.push(
								setTimeout(() => {
									oscillators[note.id].disconnect(
										gain
									);
								}, whenStop)
							);
						}
					})
				);
		}

		return () => {
			Object.values(state.tracks)
				.flatMap(track =>
					Object.values(track.recordings)
				)
				.flatMap(recording => recording.notes)
				.forEach(note => {
					if (
						started &&
						oscillators[note.id].numberOfOutputs
					)
						oscillators[note.id].disconnect();
				});
			timeouts.forEach(clearTimeout);
			started = false;
		};
	}, [state.playing]);

	return context;
};
