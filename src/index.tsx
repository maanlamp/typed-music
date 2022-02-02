import React, { useState } from "react";
import ReactDOM from "react-dom";
import useAudio from "./audio";
import "./index.css";
import useMidi from "./midi";

const App = () => {
	const [maxVolume, setMaxVolume] = useState(1);
	const { play, stop } = useAudio();
	const inputs = useMidi({ play, stop });

	return (
		<main>
			<div>
				<input
					defaultValue={100}
					type="range"
					onChange={({ target: { value } }) => {
						setMaxVolume(parseInt(value) / 100);
					}}
				/>
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
		</main>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
