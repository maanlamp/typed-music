import React, { useState } from "react";
import ReactDOM from "react-dom";
import useAudio from "./audio";
import "./index.css";
import useMidi from "./midi";

const App = () => {
	const [gain, setGain] = useState(0.03);
	const { play, stop } = useAudio({ gain });
	const inputs = useMidi({ play, stop });

	return (
		<main>
			<div>
				<div>
					<span>Gain</span>
					<input
						defaultValue={gain * 100}
						type="range"
						onChange={({ target: { value } }) => {
							setGain(parseInt(value) / 100);
						}}
					/>
					<span>{gain}</span>
				</div>
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
