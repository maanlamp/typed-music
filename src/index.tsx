import Column from "components/column";
import "components/layout.css";
import Tracks from "components/tracks";
import "index.css";
import React from "react";
import ReactDOM from "react-dom";

// TODO: Visualise current input with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

const App = () => {
	//

	return (
		<Column as="main" grow>
			<Tracks />
		</Column>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
