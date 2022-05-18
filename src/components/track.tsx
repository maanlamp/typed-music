import Recording, {
	type Recording as RecordingType
} from "components/recording";
import { darken } from "lib/color";
import { styleVars } from "lib/utils";
import "./track.css";

export type Track = RecordingType[];

type TrackProps = Readonly<{
	track: Track;
	color: string;
}>;

const Track = ({ track, color }: TrackProps) => {
	const grey = `#F9F9F9`;
	const darkerGrey = darken(grey, 0.2);

	return (
		<div
			className="track"
			style={styleVars({
				grey,
				darkerGrey,
				color
			})}>
			{track.map(recording => (
				<Recording
					key={recording.start}
					recording={recording}
					color={color}
				/>
			))}
		</div>
	);
};

export default Track;
