import { FlexProps } from "components/layout/flex";
import Stack from "components/layout/stack";
import Recording from "components/recording/recording";
import { darken, lighten, stringify } from "lib/color";
import { Track } from "lib/track";
import "./track-rail.css";

type TrackDrawerProps = FlexProps &
	Readonly<{
		track: Track;
	}>;

const TrackRail = ({
	track,
	...props
}: TrackDrawerProps) => (
	<Stack
		classes="track-rail"
		style={
			{
				"--track-color": stringify(track.color),
				"--track-color-light": stringify(
					lighten(track.color, 0.2)
				),
				"--track-color-dark": stringify(
					darken(track.color, 0.2)
				)
			} as Partial<CSSStyleDeclaration> &
				React.CSSProperties
		}
		grow
		{...props}>
		{track.recordings.map((recording, i) => (
			<Recording key={i} recording={recording} />
		))}
	</Stack>
);

export default TrackRail;
