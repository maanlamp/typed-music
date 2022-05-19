import Recording, {
	type Recording as RecordingType
} from "components/recording";
import usePlayback from "lib/playback";
import { classes, styleVars } from "lib/utils";
import { useState } from "react";
import "./track.css";

export type Track = RecordingType[];

type TrackProps = Readonly<{
	track: Track;
	color: string;
	units: ReturnType<typeof usePlayback>["units"];
	remove: () => void;
}>;

const Track = ({
	track,
	color,
	units,
	remove
}: TrackProps) => {
	const [open, setOpen] = useState(false);

	const toggleOpen = () => setOpen(!open);

	return (
		<div
			className="track-container"
			style={styleVars({
				color
			})}>
			<div
				className={classes([
					"track-thumb",
					open && "open"
				])}
				onClick={toggleOpen}>
				{open && (
					<>
						<button onClick={remove}>
							Delete track
						</button>
					</>
				)}
			</div>
			<div className="track">
				{track.map(recording => (
					<Recording
						key={recording.start}
						recording={recording}
						color={color}
						units={units}
					/>
				))}
			</div>
		</div>
	);
};

export default Track;
