import { ReactComponent as MenuIcon } from "assets/icons/menu.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";
import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as FilledRecordIcon } from "assets/icons/record-solid.svg";
import { ReactComponent as RecordIcon } from "assets/icons/record.svg";
import { ReactComponent as RewindIcon } from "assets/icons/rewind.svg";
import { ReactComponent as VolumeIcon } from "assets/icons/sound.svg";
import Button from "components/button";
import Column from "components/column";
import {
	CrossAxisAlignment,
	MainAxisAlignment
} from "components/flex";
import Icon from "components/icon";
import { Gap, Padding } from "components/layout";
import Row from "components/row";
import Track, {
	type Track as TrackType
} from "components/track";
import TrackThumb from "components/track-thumb";
import useAppState from "index";
import useAudio from "lib/audio";
import { darken } from "lib/color";
import usePlayback from "lib/playback";
import { omit } from "lib/state";
import { range, styleVars } from "lib/utils";
import { useState } from "react";
import "./tracks.css";

const colors = [
	"#53E46E",
	"#EEE82C",
	"#B4ADEA",
	"#F476C2",
	"#FF9447"
];

type TracksProps = Readonly<{
	audio: ReturnType<typeof useAudio>;
}>;

const Tracks = ({ audio }: TracksProps) => {
	const [
		{
			tracks,
			bpm,
			volume,
			signature,
			playing,
			recording,
			instruments,
			time,
			units
		},
		update
	] = useAppState();
	const playback = usePlayback(audio);
	const [pos, setPos] = useState<number>();
	const [dragging, setDragging] = useState(false);

	const leftOffset =
		document
			.querySelector(".timeline")
			?.getBoundingClientRect().left ?? 0;
	const grey = `#F9F9F9`;
	const darkerGrey = darken(grey, 0.2);

	return (
		<Column
			style={styleVars({
				grey,
				darkerGrey,
				pixelsPerBar: `${units.pixelsPerBeat}px`
			})}
			grow>
			<Row
				mainAxisAlignment={
					MainAxisAlignment.SpaceBetween
				}
				crossAxisAlignment={CrossAxisAlignment.Center}
				padding={Padding.Small}>
				<Row
					crossAxisAlignment={
						CrossAxisAlignment.Center
					}
					gap={Gap.Small}>
					<Icon svg={VolumeIcon} />
					<input
						defaultValue={volume * 100}
						type="range"
						onChange={({ target: { value } }) => {
							audio.gain.current.gain.value =
								parseInt(value) / 100;
							update(
								"volume",
								audio.gain.current.gain.value
							);
						}}
					/>
					<span>{volume}</span>
				</Row>
				<Row gap={Gap.Medium}>
					<Row
						gap={Gap.Tiny}
						crossAxisAlignment={
							CrossAxisAlignment.Center
						}>
						<input
							disabled={playing}
							type="number"
							value={signature[0]}
							onChange={({ target: { value } }) =>
								update("signature", [
									parseInt(value),
									signature[1]
								])
							}
							style={{
								width: `${
									signature[0].toString().length + 3
								}ch`
							}}
						/>
						<span>/</span>
						<input
							disabled={playing}
							type="number"
							value={signature[1]}
							onChange={({ target: { value } }) =>
								update("signature", [
									signature[0],
									parseInt(value)
								])
							}
							style={{
								width: `${
									signature[1].toString().length + 3
								}ch`
							}}
						/>
					</Row>
					<Row gap={Gap.Tiny}>
						<Button
							round
							onClick={() =>
								playback.reset(instruments[0])
							}>
							<Icon svg={RewindIcon} />
						</Button>
						<Button
							round
							onClick={() => {
								if (!playing) {
									playback.start(instruments[0]);
								} else {
									playback.stop();
								}
								update("playing", !playing);
							}}>
							{playing ? (
								<Icon svg={PauseIcon} />
							) : (
								<Icon svg={PlayIcon} />
							)}
						</Button>
						<Button
							round
							onClick={() =>
								update("recording", !recording)
							}>
							{recording ? (
								<Icon
									svg={FilledRecordIcon}
									color={darken("#ffffff", 0.4)}
								/>
							) : (
								<Icon svg={RecordIcon} />
							)}
						</Button>
					</Row>
					<Row
						gap={Gap.Tiny}
						crossAxisAlignment={
							CrossAxisAlignment.Center
						}>
						<input
							disabled={playing}
							type="number"
							value={bpm}
							style={{
								width: `${bpm.toString().length + 3}ch`
							}}
							onChange={({ target: { value } }) =>
								update("bpm", parseInt(value))
							}
						/>
						<span>BPM</span>
					</Row>
				</Row>
				<Button round icon={MenuIcon} />
			</Row>
			<Row grow>
				{/* <Column classes="intstrument-rack">
					<h2>Instruments</h2>
					{instruments.map(instrument => (
						<Row>
							<Icon svg={CubeIcon} />
							<span>{instrument.id}</span>
						</Row>
					))}
				</Column> */}
				<Row classes="tracks" grow>
					<Column>
						<div className="tracks-spacer" />
						{Object.values(tracks).map((track, i) => (
							<TrackThumb
								key={track.id}
								color={
									colors[i % colors.length] ??
									colors[0]
								}
								remove={() =>
									update("tracks", omit(track.id))
								}
								track={track}
							/>
						))}
						<Button
							color={
								colors[
									Object.keys(tracks).length %
										colors.length
								] ?? colors[0]
							}
							onClick={() =>
								update<
									Record<TrackType["id"], TrackType>
								>("tracks", tracks => {
									const id =
										Object.values(
											tracks
										).length.toString();
									return {
										...tracks,
										[id]: {
											id,
											muted: false,
											mono: false,
											locked: true,
											pan: 0.5,
											isRecording: false,
											volume: [1, 1],
											recordings: [],
											solo: false
										} as TrackType
									};
								})
							}
							icon={PlusIcon}>
							<span>Add track</span>
						</Button>
					</Column>
					<Column
						// TODO: For some reason units.pixelsPerBeat
						// isn't linked properly to bpm?
						classes="recordings"
						style={
							{
								overflowX: "scroll",
								background: `local repeating-linear-gradient(90deg,${range(
									signature[0]
								)
									.map(
										i =>
											`var(--grey) ${
												i *
												(units.pixelsPerBeat *
													(100 / bpm))
											}px, var(--grey) ${
												(i + 1) *
													(units.pixelsPerBeat *
														(100 / bpm)) -
												1
											}px, ${
												i === signature[0] - 1
													? "rgba(0,0,0,.4)"
													: "var(--darker-grey)"
											} ${
												(i + 1) *
												(units.pixelsPerBeat *
													(100 / bpm))
											}px`
									)
									.join(",")}`
							} as any
						}
						grow>
						<Row
							classes="timeline"
							onMouseDown={(e: MouseEvent) => {
								setDragging(true);
								setPos(
									Math.max(0, e.clientX - leftOffset)
								);
							}}
							onMouseMove={(e: MouseEvent) => {
								if (!dragging) return;
								setPos(
									Math.max(0, e.clientX - leftOffset)
								);
							}}
							onMouseUp={() => {
								const time =
									pos! / units.pixelsPerMillisecond;
								update("time", time);
								setPos(undefined);
								setDragging(false);
								if (playing) {
									playback.stop();
									playback.start(instruments[0]);
								}
							}}>
							<div
								className="timeline-thumb"
								style={{
									left: `${
										pos ??
										time * units.pixelsPerMillisecond
									}px`
								}}
							/>
							<div
								className="timeline-cursor"
								style={{
									left: `${
										pos ??
										time * units.pixelsPerMillisecond
									}px`,
									height: `calc(16px + ${
										Object.values(tracks).length
									} * 4rem)`
								}}
							/>
						</Row>
						{Object.values(tracks).map((track, i) => (
							<Track
								key={i}
								track={track}
								color={
									colors[i % colors.length] ??
									colors[0]
								}
							/>
						))}
					</Column>
				</Row>
			</Row>
			{/* <Column className="detail-view" grow>
				<Center grow>
					<span>
						TODO: View currently selected thing in
						detail, such as a synth, or a
						track/recording?
					</span>
				</Center>
			</Column> */}
		</Column>
	);
};

export default Tracks;
