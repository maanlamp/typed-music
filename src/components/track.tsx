import Recording, {
	type Recording as RecordingType
} from "components/recording";
import { darken } from "lib/color";
import usePlayback from "lib/playback";
import { styleVars } from "lib/utils";
import "./track.css";

export type Track = RecordingType[];

type TrackProps = Readonly<{
	track: Track;
	color: string;
	units: ReturnType<typeof usePlayback>["units"];
	playback: (recording: RecordingType) => void;
}>;

const Track = ({
	track,
	color,
	units,
	playback
}: TrackProps) => {
	const grey = `#F9F9F9`;
	const darkerGrey = darken(grey, 0.2);

	return (
		<div
			className="track"
			style={styleVars({
				grey,
				darkerGrey,
				color,
				pixelsPerBar: `${units.pixelsPerBeat}px`
			})}>
			{track.map(recording => (
				<Recording
					key={recording.start}
					recording={recording}
					color={color}
					units={units}
					playback={playback}
				/>
			))}
		</div>
	);
};

export default Track;
