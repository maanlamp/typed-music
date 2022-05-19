import Track, {
	type Track as TrackType
} from "components/track";
import useAudio, { Synthesiser } from "lib/audio";
import { darken } from "lib/color";
import useMidi from "lib/midi";
import usePlayback from "lib/playback";
import { concat, withoutIndex } from "lib/state";
import { classes, styleVars } from "lib/utils";
import { useState } from "react";
import "./tracks.css";

const colors = [
	"#53E46E",
	"#EEE82C",
	"#B4ADEA",
	"#F476C2",
	"#FF9447"
];

const Tracks = () => {
	const [volume, setVolume] = useState(0.05);
	const [tracks, setTracks] = useState<TrackType[]>();
	const audio = useAudio({ volume });
	const {
		playback,
		units,
		time,
		playing,
		setPlaying,
		setTime
	} = usePlayback({
		bpm: 100,
		signature: [4, 4],
		audio
	});
	useMidi({
		play: note => audio.play({ note, synth: organ }),
		stop: audio.stop
	});

	const grey = `#F9F9F9`;
	const darkerGrey = darken(grey, 0.2);

	return (
		<div
			style={styleVars({
				grey,
				darkerGrey,
				pixelsPerBar: `${units.pixelsPerBeat}px`
			})}>
			<div>
				<span>Gain</span>
				<input
					defaultValue={volume * 100}
					type="range"
					onChange={({ target: { value } }) => {
						audio.gain.current.gain.value =
							parseInt(value) / 100;
						setVolume(audio.gain.current.gain.value);
					}}
				/>
				<span>{volume}</span>
			</div>
			<div>
				<button onClick={() => setTime(0)}>
					&nbsp; |&lt; &nbsp;
				</button>
				<button onClick={() => setPlaying(!playing)}>
					&nbsp;
					{playing ? "||" : ">"}
					&nbsp;
				</button>
			</div>
			<div className="tracks">
				<div className={classes(["timeline"])}>
					{/* TODO: Dragging */}
					<div
						className="timeline-thumb"
						style={{
							left: `${
								time * units.pixelsPerMillisecond
							}px`
						}}
					/>
				</div>
				<div
					className="timeline-cursor"
					style={{
						left: `${
							time * units.pixelsPerMillisecond
						}px`
					}}
				/>
				<div>
					{tracks?.map((track, i) => (
						<Track
							key={i}
							track={track}
							units={units}
							color={
								colors[i % colors.length] || colors[0]
							}
							playback={recording =>
								playback(recording, organ)
							}
							remove={() => setTracks(withoutIndex(i))}
						/>
					))}
				</div>
			</div>
			<button
				onClick={() =>
					setTracks(concat<TrackType>([]))
				}>
				Add track
			</button>
		</div>
	);
};

enum Interval {
	Cent = 1,
	Semitone = 100,
	Tone = 200,
	Octave = 1200
}

const organ: Synthesiser = [
	{
		type: "sine",
		detune: Interval.Octave * -1,
		gain: 1
	},
	{
		type: "sine",
		detune: 0,
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
];

// range(colors.length).map(() =>
// 			range(1 + random(6)).map(i => ({
// 				start: 0 + i * units.millisecondsPerBar,
// 				end:
// 					units.millisecondsPerBar +
// 					i * units.millisecondsPerBar,
// 				notes: [
// 					{
// 						note: 69,
// 						velocity: 127,
// 						time: (0 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat / 2
// 					},
// 					{
// 						note: 69 - 5,
// 						velocity: 127,
// 						time: (2 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat / 4
// 					},
// 					{
// 						note: 69 - 5,
// 						velocity: 127,
// 						time: (3 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat / 4
// 					},
// 					{
// 						note: 69 - 3,
// 						velocity: 127,
// 						time: (4 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat / 2
// 					},
// 					{
// 						note: 69 - 5,
// 						velocity: 127,
// 						time: (6 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat / 2
// 					},
// 					{
// 						note: 69 - 1,
// 						velocity: 127,
// 						time: (10 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat / 2
// 					},
// 					{
// 						note: 69,
// 						velocity: 127,
// 						time: (12 * units.millisecondsPerBeat) / 4,
// 						duration: units.millisecondsPerBeat
// 					}
// 				]
// 			}))
// 		)

export default Tracks;