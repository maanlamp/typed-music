import { ReactComponent as LockIcon } from "assets/icons/lock.svg";
import { ReactComponent as UnmuteIcon } from "assets/icons/muted.svg";
import { ReactComponent as PianoIcon } from "assets/icons/piano.svg";
import { ReactComponent as RecordOffIcon } from "assets/icons/record-solid.svg";
import { ReactComponent as RecordIcon } from "assets/icons/record.svg";
import { ReactComponent as MuteIcon } from "assets/icons/sound.svg";
import { ReactComponent as SquareIcon } from "assets/icons/square.svg";
import { ReactComponent as DeleteIcon } from "assets/icons/trash.svg";
import { ReactComponent as UnlockIcon } from "assets/icons/unlock.svg";
import Button from "components/interface/button";
import Icon from "components/interface/icon";
import IconButton from "components/interface/icon-button";
import Text from "components/interface/text";
import Column from "components/layout/column";
import {
	CrossAxisAlignment,
	FlexProps,
	MainAxisAlignment
} from "components/layout/flex";
import {
	Gap,
	Padding
} from "components/layout/layout";
import Row from "components/layout/row";
import { darken, stringify } from "lib/color";
import { useApp } from "lib/state";
import { Track } from "lib/track";
import "./track-drawer.css";

type TrackDrawerProps = FlexProps &
	Readonly<{
		track: Track;
	}>;

const TrackDrawer = ({
	track,
	...props
}: TrackDrawerProps) => {
	const [state, dispatch] = useApp();

	const darkenedTrackColor = stringify(
		darken(track.color, 0.6)
	);

	return (
		<Row
			classes="track-drawer"
			padding={Padding.Medium}
			crossAxisAlignment={CrossAxisAlignment.Center}
			mainAxisAlignment={
				MainAxisAlignment.SpaceBetween
			}
			gap={Gap.Small}
			{...props}>
			<Row
				crossAxisAlignment={CrossAxisAlignment.Center}
				gap={Gap.Inherit}>
				<Icon svg={PianoIcon} />
				<Button
					icon={{
						color: track.color,
						svg: SquareIcon
					}}
					onClick={() => {
						throw new Error(
							"TODO: Implement changing track color & name"
						);
					}}>
					<Text weight={600}>{track.name}</Text>
				</Button>
			</Row>
			{state.drawersOpen && (
				<Row gap={Gap.Inherit}>
					<Row>
						<IconButton
							icon={{
								svg: DeleteIcon,
								color: darkenedTrackColor
							}}
							onClick={() =>
								dispatch({
									type: "removeTrack",
									id: track.id
								})
							}
						/>
						<IconButton
							icon={{
								svg: track.muted
									? UnmuteIcon
									: MuteIcon,
								color: darkenedTrackColor
							}}
							onClick={() =>
								dispatch({
									type: "toggleTrackMute",
									id: track.id
								})
							}
						/>
						<IconButton
							icon={{
								svg: track.isRecording
									? RecordOffIcon
									: RecordIcon,
								color: darkenedTrackColor
							}}
							onClick={() =>
								dispatch({
									type: "toggleTrackIsRecording",
									id: track.id
								})
							}
						/>
					</Row>
					<Row
						crossAxisAlignment={
							CrossAxisAlignment.Center
						}
						gap={Gap.Tiny}>
						<Column gap={Gap.Tiny}>
							<input
								type="range"
								min={0}
								max={1}
								step={0.01}
								disabled={track.muted}
								value={track.volume[0]}
								onChange={({ target: { value } }) => {
									const parsed = parseFloat(value);
									return dispatch({
										type: "setTrackVolume",
										id: track.id,
										volume: [
											parsed,
											track.locked
												? parsed
												: track.volume[1]
										]
									});
								}}
							/>
							<input
								type="range"
								min={0}
								max={1}
								step={0.01}
								disabled={track.muted || track.locked}
								value={track.volume[1]}
								onChange={({ target: { value } }) =>
									dispatch({
										type: "setTrackVolume",
										id: track.id,
										volume: [
											track.volume[0],
											parseFloat(value)
										]
									})
								}
							/>
						</Column>
						<IconButton
							icon={{
								svg: track.locked
									? LockIcon
									: UnlockIcon,
								color: darkenedTrackColor
							}}
							onClick={() =>
								dispatch({
									type: "toggleTrackLocked",
									id: track.id
								})
							}
						/>
					</Row>
					<input
						type="range"
						min={-1}
						max={1}
						step={0.01}
						value={track.pan}
						onChange={({ target: { value } }) =>
							dispatch({
								type: "panTrack",
								id: track.id,
								pan: parseFloat(value)
							})
						}
					/>
				</Row>
			)}
		</Row>
	);
};

export default TrackDrawer;
