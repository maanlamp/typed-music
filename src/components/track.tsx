import Recording, {
	type Recording as RecordingType
} from "components/recording";
import Row from "components/row";
import { styleVars } from "lib/utils";
import "./track.css";

export type Track = Readonly<{
	id: string;
	muted: boolean;
	mono: boolean;
	locked: boolean;
	pan: number;
	isRecording: boolean;
	volume: readonly [number, number];
	solo: boolean;
	recordings: RecordingType[];
}>;

type TrackProps = Readonly<{
	track: Track;
	color: string;
}>;

const Track = ({ track, color }: TrackProps) => (
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
					color={!track.muted ? color : "grey"}
				/>
			))}
		</div>
	</Row>
);

export default Track;
