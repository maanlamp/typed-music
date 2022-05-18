import { Recording } from "components/recording";
import Track, {
	type Track as TrackType
} from "components/track";
import "index.css";
import useAudio, { Synthesiser } from "lib/audio";
import useMidi from "lib/midi";
import { random, range } from "lib/utils";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

enum Interval {
	Cent = 1,
	Semitone = 100,
	Tone = 200,
	Octave = 1200
}

const pipes = 32;
const falloff = 0.4;
const bassToTrebleRatio = 28 / pipes;
const organ: Synthesiser = range(pipes).map(i => ({
	type: "sine",
	detune:
		(i - Math.floor(pipes * bassToTrebleRatio)) *
		Interval.Octave,
	gain:
		i <= Math.floor(pipes * bassToTrebleRatio)
			? 1
			: (1 - falloff) **
			  (i - Math.floor(pipes * bassToTrebleRatio))
}));

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
	const { play, stop, gain } = useAudio({ volume });
	const inputs = useMidi({
		play: note => play({ note, synth: organ }),
		stop
	});
	const [tracks, setTracks] = useState<TrackType[]>();

	useEffect(() => {
		const _tracks: TrackType[] = [];
		let i = colors.length;
		while (i-- > 0) {
			const track: TrackType = [];
			_tracks.push(track);
			const max = 1 + random(4);
			let j = 0;
			while (j < max) {
				const prevRecording = track[j - 1] as
					| Recording
					| undefined;
				const duration = 100 + random(400);
				const start = prevRecording
					? prevRecording.end
					: 0;
				const end =
					(prevRecording?.end ?? 0) + duration;
				track.push({
					start,
					end,
					notes: range(10).map(() => ({
						note: random(127),
						velocity: 127,
						time: random(1000000),
						duration: duration / 10
					}))
				});
				j += 1;
			}
		}
		setTracks(_tracks);
	}, []);

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
						color={
							colors[i % colors.length] || colors[0]
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
