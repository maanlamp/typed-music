import { ReactComponent as CubeIcon } from "assets/icons/cube.svg";
import { ReactComponent as HeadphonesIcon } from "assets/icons/headphones.svg";
import { ReactComponent as FilledRecordIcon } from "assets/icons/record-solid.svg";
import { ReactComponent as RecordIcon } from "assets/icons/record.svg";
import { ReactComponent as TrashIcon } from "assets/icons/trash.svg";
import { ReactComponent as VolumeIcon } from "assets/icons/volume.svg";
import Button from "components/button";
import Column from "components/column";
import { CrossAxisAlignment } from "components/flex";
import Icon from "components/icon";
import { Gap, Padding } from "components/layout";
import Row from "components/row";
import { darken } from "lib/color";
import { styleVars } from "lib/utils";
import { useState } from "react";

type TrackThumbProps = Readonly<{
	color: string;
	remove: () => void;
	mono?: boolean;
	solo?: boolean;
	muted?: boolean;
}>;

const TrackThumb = ({
	color,
	remove,
	mono: defaultMono,
	solo: defaultSolo,
	muted: defaultMuted
}: TrackThumbProps) => {
	const [recording, setRecording] = useState(false);
	const [volume, setVolume] = useState<
		readonly [number, number]
	>([100, 100]);
	const [pan, setPan] = useState(0.5);
	const [solo, setSolo] = useState(defaultSolo);
	const [mono, setMono] = useState(defaultMono);
	const [muted, setMuted] = useState(defaultMuted);

	return (
		<Row
			style={styleVars({
				color
			})}
			classes="track-thumb"
			crossAxisAlignment={CrossAxisAlignment.Center}
			gap={Gap.Small}
			padding={Padding.Small}>
			<Icon svg={CubeIcon} />
			<Row>
				<Button round onClick={remove}>
					<Icon svg={TrashIcon} />
				</Button>
				<Button round onClick={() => setSolo(!solo)}>
					{solo ? "x" : <Icon svg={HeadphonesIcon} />}
				</Button>
				<Button round onClick={() => setMuted(!muted)}>
					{muted ? "x" : <Icon svg={VolumeIcon} />}
				</Button>
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
			<Column>
				<input
					defaultValue={volume[0] * 100}
					type="range"
					onChange={({ target: { value } }) => {
						// audio.gain.current.gain.value =
						// 	parseInt(value) / 100;
						setVolume([
							parseInt(value) / 100,
							volume[1]
						]);
					}}
				/>
				{!mono && (
					<input
						defaultValue={volume[1] * 100}
						type="range"
						onChange={({ target: { value } }) => {
							// audio.gain.current.gain.value =
							// 	parseInt(value) / 100;
							setVolume([
								volume[0],
								parseInt(value) / 100
							]);
						}}
					/>
				)}
			</Column>
			<input
				defaultValue={pan * 100}
				type="range"
				onChange={({ target: { value } }) => {
					// audio.gain.current.gain.value =
					// 	parseInt(value) / 100;
					setPan(parseInt(value) / 100);
				}}
			/>
		</Row>
	);
};

export default TrackThumb;
