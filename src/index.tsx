import Tracks from "components/tracks";
import "index.css";
import React from "react";
import ReactDOM from "react-dom";

// TODO: Visualise current input with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

const App = () => {
	//

	return (
		<main>
			{/* <div>
				<br />
				{inputs?.map(input => (
					<div key={input.id}>
						<p>Name: {input.name}</p>
						<p>Manufacturer: {input.manufacturer}</p>
					</div>
				)) ?? "No MIDI inputs detected."}
			</div> */}
			<Tracks />
		</main>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
