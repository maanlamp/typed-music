import Track, {
	type Track as TrackType
} from "components/track";
import "index.css";
import useAudio, { Synthesiser } from "lib/audio";
import useMidi from "lib/midi";
import usePlayback from "lib/playback";
import { range } from "lib/utils";
import React, { useState } from "react";
import ReactDOM from "react-dom";

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

const colors = [
	"#53E46E",
	"#EEE82C",
	"#B4ADEA",
	"#F476C2",
	"#FF9447"
];

// TODO: Visualise current input with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

const App = () => {
	const [volume, setVolume] = useState(0.05);
	const audio = useAudio({ volume });
	const { play, stop, gain } = audio;
	const inputs = useMidi({
		play: note => play({ note, synth: organ }),
		stop
	});
	const { playback, units } = usePlayback({
		bpm: 100,
		signature: [4, 4],
		audio
	});
	const [tracks, setTracks] = useState<TrackType[]>([
		[
			{
				start: 0,
				end: units.millisecondsPerBar,
				notes: range(4).map(i => ({
					note: 50 + i * 2,
					velocity: 127,
					time: i * units.millisecondsPerBeat,
					duration: units.millisecondsPerBeat
				}))
			}
		]
	]);

	return (
		<main>
			<div>
				<div>
					<span>Gain</span>
					<input
						defaultValue={volume * 100}
						type="range"
						onChange={({ target: { value } }) => {
							gain.current.gain.value =
								parseInt(value) / 100;
							setVolume(gain.current.gain.value);
						}}
					/>
					<span>{volume}</span>
				</div>
				<br />
				{inputs?.map(input => (
					<div key={input.id}>
						<p>Name: {input.name}</p>
						<p>Manufacturer: {input.manufacturer}</p>
					</div>
				)) ?? "No MIDI inputs detected."}
			</div>
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
					/>
				))}
			</div>
		</main>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
