import { ReactComponent as CubeIcon } from "assets/icons/cube.svg";
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
import { darken } from "lib/color";
import { mean, styleVars } from "lib/utils";
import { useState } from "react";

type TrackThumbProps = Readonly<{
	color: string;
	remove: () => void;
	mono?: boolean;
	solo?: boolean;
	muted?: boolean;
	locked?: boolean;
}>;

const TrackThumb = ({
	color,
	remove,
	mono: defaultMono,
	solo: defaultSolo,
	muted: defaultMuted,
	locked: defaultLocked = true
}: TrackThumbProps) => {
	const [recording, setRecording] = useState(false);
	const [volume, setVolume] = useState<
		readonly [number, number]
	>([100, 100]);
	const [pan, setPan] = useState(0.5);
	const [solo, setSolo] = useState(defaultSolo);
	const [mono, setMono] = useState(defaultMono);
	const [muted, setMuted] = useState(defaultMuted);
	const [locked, setLocked] = useState(defaultLocked);

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
					icon={HeadphonesIcon}
					onClick={() => {
						if (!solo) {
							setMuted(false);
						}
						setSolo(!solo);
					}}
				/>
				<Button
					round
					onClick={() => setMuted(!muted)}
					icon={muted ? MutedIcon : VolumeIcon}
				/>
				<Button
					round
					onClick={() => {
						setRecording(!recording);
					}}>
					{recording ? (
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
							setVolume([
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
								setVolume([
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
							setVolume([avg, avg]);
						}
						setLocked(!locked);
					}}
					icon={locked ? LockIcon : UnlockIcon}
				/>
			</Row>
			<input
				disabled={muted}
				defaultValue={pan * 100}
				type="range"
				onChange={({ target: { value } }) => {
					setPan(parseInt(value) / 100);
				}}
			/>
		</Row>
	);
};

export default TrackThumb;
