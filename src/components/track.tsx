import Recording, {
	type Recording as RecordingType
} from "components/recording";
import Row from "components/row";
import usePlayback from "lib/playback";
import { styleVars } from "lib/utils";
import "./track.css";

export type Track = Readonly<{
	solo?: boolean;
	muted?: boolean;
	mono?: boolean;
	recordings: RecordingType[];
}>;

type TrackProps = Readonly<{
	track: Track;
	color: string;
	units: ReturnType<typeof usePlayback>["units"];
	bpm: number;
}>;

const Track = ({
	track,
	color,
	units,
	bpm
}: TrackProps) => (
	<Row
		classes="track-container"
		style={styleVars({
			color
		})}>
		<div className="track">
			{track.recordings.map(recording => (
				<Recording
					key={recording.start}
					recording={recording}
					color={
						track.solo || !track.muted ? color : "grey"
					}
					units={units}
					bpm={bpm}
				/>
			))}
		</div>
	</Row>
);

export default Track;
