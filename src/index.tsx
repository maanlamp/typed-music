import Tracks from "components/tracks";
import "index.css";
import React from "react";
import ReactDOM from "react-dom";

// TODO: Visualise current input with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

const App = () => {
	//

	return (
		<main>
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
