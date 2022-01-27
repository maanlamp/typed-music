import React from "react";
import ReactDOM from "react-dom";
import useAudio from "./audio";
import "./index.css";
import useMidi from "./midi";

const App = () => {
	// TODO: expose only play and stop from useAudio
	// which are now implemented as state in this component
	const { play, oscillators } = useAudio();

	const inputs = useMidi({
		playNote: play
	});

	return (
		<main>
			<div>
				{inputs?.length
					? inputs.map(input => (
							<div key={input.id}>
								<p>Name: {input.name}</p>
								<p>
									Manufacturer: {input.manufacturer}
								</p>
							</div>
					  ))
					: "No MIDI inputs detected."}
			</div>
			<div style={{ color: "red" }}>
				{Object.keys(oscillators.current).map(note => (
					<p key={note}>{note}</p>
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
