import useAudio, { Synthesiser } from "audio";
import "index.css";
import useMidi from "midi";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { range } from "utils";

enum Interval {
	Cent = 1,
	Semitone = 100,
	Tone = 200,
	Octave = 1200
}

const pipes = 32;
const falloff = 0.4;
const bassToTrebleRatio = 1 / 8;
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

// TODO: Visualise current input with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

const App = () => {
	const [volume, setVolume] = useState(0.05);
	const { play, stop, gain } = useAudio({ volume });
	const inputs = useMidi({
		play: note => play({ note, synth: organ }),
		stop
	});

	return (
		<main>
			<div>
				<div>
					<span>Gain</span>
					<input
						defaultValue={17.5}
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
		</main>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
