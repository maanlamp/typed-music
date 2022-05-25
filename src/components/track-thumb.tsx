import { ReactComponent as CubeIcon } from "assets/icons/cube.svg";
import { ReactComponent as HeadphonesOffIcon } from "assets/icons/headphones-off.svg";
import { ReactComponent as HeadphonesIcon } from "assets/icons/headphones.svg";
import { ReactComponent as LockIcon } from "assets/icons/lock.svg";
import { ReactComponent as MutedIcon } from "assets/icons/mute.svg";
import { ReactComponent as FilledRecordIcon } from "assets/icons/record-solid.svg";
import { ReactComponent as RecordIcon } from "assets/icons/record.svg";
import { ReactComponent as VolumeIcon } from "assets/icons/sound.svg";
import { ReactComponent as TrashIcon } from "assets/icons/trash.svg";
import { ReactComponent as UnlockIcon } from "assets/icons/unlock.svg";
import Button from "components/button";
import Column from "components/column";
import { CrossAxisAlignment } from "components/flex";
import Icon from "components/icon";
import { Gap, Padding } from "components/layout";
import Row from "components/row";
import { type Track } from "components/track";
import useAppState from "index";
import { darken } from "lib/color";
import { mean, styleVars } from "lib/utils";

type TrackThumbProps = Readonly<{
	color: string;
	remove: () => void;
	track: Track;
}>;

const TrackThumb = ({
	color,
	remove,
	track
}: TrackThumbProps) => {
	const [{ tracks }, update] = useAppState();
	const {
		isRecording,
		volume,
		pan,
		mono,
		muted,
		locked,
		solo
	} = tracks[track.id];

	return (
		<Row
			style={styleVars({
				color
			})}
			classes="track-thumb"
			crossAxisAlignment={CrossAxisAlignment.Center}
			gap={Gap.Small}
			padding={Padding.Medium}>
			<Icon svg={CubeIcon} />
			<Row>
				<Button round onClick={remove}>
					<Icon svg={TrashIcon} />
				</Button>
				<Button
					round
					icon={
						track.solo
							? HeadphonesOffIcon
							: HeadphonesIcon
					}
					onClick={() => {
						Object.values(tracks).forEach(({ id }) => {
							update(
								`tracks.${id}.muted`,
								solo ? false : id !== track.id
							);
							update(`tracks.${id}.solo`, false);
						});
						update(`tracks.${track.id}.solo`, !solo);
					}}
				/>
				<Button
					round
					onClick={() => {
						Object.values(tracks).forEach(track => {
							if (track.solo) {
								update(
									`tracks.${track.id}.solo`,
									false
								);
							}
						});
						update(`tracks.${track.id}.muted`, !muted);
					}}
					icon={muted ? MutedIcon : VolumeIcon}
				/>
				<Button
					round
					onClick={() => {
						update(
							`tracks.${track.id}.isRecording`,
							!isRecording
						);
					}}>
					{isRecording ? (
						<Icon
							svg={FilledRecordIcon}
							color={darken(color, 0.6)}
						/>
					) : (
						<Icon svg={RecordIcon} />
					)}
				</Button>
			</Row>
			<Row>
				<Column>
					<input
						disabled={muted}
						value={volume[0] * 100}
						type="range"
						onChange={({ target: { value } }) => {
							const parsed = parseInt(value) / 100;
							update(`tracks.${track.id}.volume`, [
								parsed,
								locked ? parsed : volume[1]
							]);
						}}
					/>
					{!mono && (
						<input
							disabled={muted}
							value={volume[1] * 100}
							type="range"
							onChange={({ target: { value } }) => {
								const parsed = parseInt(value) / 100;
								update(`tracks.${track.id}.volume`, [
									locked ? parsed : volume[0],
									parsed
								]);
							}}
						/>
					)}
				</Column>
				<Button
					round
					onClick={() => {
						if (!locked) {
							const avg = mean(volume);
							update(`tracks.${track.id}.volume`, [
								avg,
								avg
							]);
						}
						update(
							`tracks.${track.id}.locked`,
							!locked
						);
					}}
					icon={locked ? LockIcon : UnlockIcon}
				/>
			</Row>
			<input
				disabled={muted}
				defaultValue={pan * 100}
				type="range"
				onChange={({ target: { value } }) => {
					update(
						`tracks.${track.id}.pan`,
						parseInt(value) / 100
					);
				}}
			/>
		</Row>
	);
};

export default TrackThumb;
