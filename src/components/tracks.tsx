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
import useAudio, { Synthesiser } from "lib/audio";
import { darken } from "lib/color";
import useMidi, {
	MidiNoteWithDuration
} from "lib/midi";
import usePlayback from "lib/playback";
import { concat, withoutIndex } from "lib/state";
import { range, repeat, styleVars } from "lib/utils";
import { useState } from "react";
import "./tracks.css";

const colors = [
	"#53E46E",
	"#EEE82C",
	"#B4ADEA",
	"#F476C2",
	"#FF9447"
];

const Tracks = () => {
	const [signature, setSignature] = useState<
		readonly [number, number]
	>([4, 4]);
	const [bpm, setBpm] = useState(100);
	const [volume, setVolume] = useState(0.05);
	const audio = useAudio({ volume });
	const {
		playback,
		units,
		time,
		playing,
		setPlaying,
		reset,
		cancel,
		setTime
	} = usePlayback({
		bpm,
		signature,
		audio
	});

	// TODO: Move recording/solo/mono/track state into global state
	// Maybe start using reducers?
	const [tracks, setTracks] = useState<TrackType[]>([
		{
			recordings: [
				{
					start: 0,
					end: units.millisecondsPerBar * 2,
					notes: (
						[
							[81, 2],
							[76, 1],
							[74, 1],
							[73, 2],
							[null, 1],
							[73, 1],
							[73, 1],
							[74, 1],
							[76, 1],
							[78, 1],
							[74, 2],
							[null, 2],
							[78, 1],
							[76, 1],
							[74, 1],
							[73, 1],
							[71, 1],
							[73, 1],
							[74, 1],
							[78, 1],
							[76, 1],
							[74, 1],
							[73, 1],
							[71, 1],
							[69, 2]
						] as [null | number, number][]
					)
						.map(
							([note, duration], i, all) =>
								note && {
									note,
									velocity: 127,
									time:
										all
											.slice(0, i)
											.map(([, d]) => d)
											.reduce((x, d) => x + d, 0) *
										(units.millisecondsPerBeat / 4),
									duration:
										(units.millisecondsPerBeat / 4) *
										duration
								}
						)
						.filter(Boolean) as MidiNoteWithDuration[]
				},
				{
					start: units.millisecondsPerBar * 2,
					end: units.millisecondsPerBar * 4,
					notes: (
						[
							[73, 1],
							[71, 1],
							[73, 2],
							[73, 2],
							[71, 1],
							[73, 1],
							[74, 2],
							[73, 1],
							[71, 1],
							[73, 2],
							[69, 2],
							[69, 1],
							[71, 1],
							[73, 1],
							[74, 1],
							[73, 1],
							[71, 1],
							[69, 1],
							[76, 1],
							[73, 2]
						] as [number | null, number][]
					)
						.map(
							([note, duration], i, all) =>
								note && {
									note,
									velocity: 127,
									time:
										all
											.slice(0, i)
											.map(([, d]) => d)
											.reduce((x, d) => x + d, 0) *
										(units.millisecondsPerBeat / 4),
									duration:
										(units.millisecondsPerBeat / 4) *
										duration
								}
						)
						.filter(Boolean) as MidiNoteWithDuration[]
				},
				{
					start: units.millisecondsPerBar * 4,
					end: units.millisecondsPerBar * 6,
					notes: (
						[
							[73, 1],
							[71, 1],
							[73, 2],
							[73, 2],
							[71, 1],
							[73, 1],
							[74, 2],
							[73, 1],
							[71, 1],
							[73, 2],
							[69, 2],
							[69, 1],
							[71, 1],
							[73, 1],
							[74, 1],
							[73, 1],
							[71, 1],
							[69, 1],
							[76, 1],
							[73, 2]
						] as [number | null, number][]
					)
						.map(
							([note, duration], i, all) =>
								note && {
									note,
									velocity: 127,
									time:
										all
											.slice(0, i)
											.map(([, d]) => d)
											.reduce((x, d) => x + d, 0) *
										(units.millisecondsPerBeat / 4),
									duration:
										(units.millisecondsPerBeat / 4) *
										duration
								}
						)
						.filter(Boolean) as MidiNoteWithDuration[]
				}
			]
		},
		{
			recordings: [
				{
					start: units.millisecondsPerBar * 2,
					end: units.millisecondsPerBar * 6,
					notes: (
						repeat(2)([
							[45, 3],
							[null, 1],
							[40, 3],
							[null, 1],
							[45, 3],
							[null, 1],
							[40, 3],
							[null, 1],
							[45, 3],
							[null, 1],
							[40, 3],
							[null, 1],
							[45, 3],
							[null, 1],
							[40, 3],
							[null, 1]
						]) as [number | null, number][]
					)
						.map(
							([note, duration], i, all) =>
								note && {
									note,
									velocity: 127,
									time:
										all
											.slice(0, i)
											.map(([, d]) => d)
											.reduce((x, d) => x + d, 0) *
										(units.millisecondsPerBeat / 4),
									duration:
										(units.millisecondsPerBeat / 4) *
										duration
								}
						)
						.filter(Boolean) as MidiNoteWithDuration[]
				}
			]
		}
	]);
	useMidi({
		play: note => audio.play({ note, synth: organ }),
		stop: note => audio.stop({ note, synth: organ })
	});

	const grey = `#F9F9F9`;
	const darkerGrey = darken(grey, 0.2);

	const [pos, setPos] = useState<number>();
	const [dragging, setDragging] = useState(false);
	const [recording, setRecording] = useState(false);
	const leftOffset =
		document
			.querySelector(".timeline")
			?.getBoundingClientRect().left ?? 0;

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
							setVolume(audio.gain.current.gain.value);
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
							type="number"
							value={signature[0]}
							onChange={({ target: { value } }) =>
								setSignature([
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
							type="number"
							value={signature[1]}
							onChange={({ target: { value } }) =>
								setSignature([
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
								reset({
									tracks,
									synth: organ
								})
							}>
							<Icon svg={RewindIcon} />
						</Button>
						<Button
							round
							onClick={() => {
								if (!playing) {
									playback({
										tracks,
										synth: organ,
										time
									});
								} else {
									cancel();
								}
								setPlaying(!playing);
							}}>
							{playing ? (
								<Icon svg={PauseIcon} />
							) : (
								<Icon svg={PlayIcon} />
							)}
						</Button>
						<Button
							round
							onClick={() => {
								setRecording(!recording);
							}}>
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
							type="number"
							value={bpm}
							style={{
								width: `${bpm.toString().length + 3}ch`
							}}
							onChange={({ target: { value } }) =>
								setBpm(parseInt(value))
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
						{tracks.map((track, i) => (
							<TrackThumb
								key={i}
								color={
									colors[i % colors.length] ??
									colors[0]
								}
								remove={() =>
									setTracks(withoutIndex(i))
								}
								mono={track.mono}
								muted={track.muted}
								solo={track.solo}
							/>
						))}
						<Button
							color={
								colors[
									tracks.length % colors.length
								] ?? colors[0]
							}
							onClick={() =>
								setTracks(
									concat<TrackType>({ recordings: [] })
								)
							}
							icon={PlusIcon}>
							<span>Add track</span>
						</Button>
					</Column>
					<Column
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
												i * units.pixelsPerBeat
											}px, var(--grey) ${
												(i + 1) * units.pixelsPerBeat -
												1
											}px, ${
												i === signature[0] - 1
													? "rgba(0,0,0,.4)"
													: "var(--darker-grey)"
											} ${
												(i + 1) * units.pixelsPerBeat
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
								setTime(time);
								setPos(undefined);
								setDragging(false);
								if (playing) {
									cancel();
									playback({
										tracks,
										synth: organ,
										time
									});
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
									height: `calc(16px + ${tracks.length} * 4rem)`
								}}
							/>
						</Row>
						{tracks?.map((track, i) => (
							<Track
								key={i}
								track={track}
								units={units}
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

enum Interval {
	Cent = 1,
	Semitone = 100,
	Tone = 200,
	Octave = 1200
}

const organ: Synthesiser = {
	id: 0,
	nodes: [
		{
			type: "sine",
			detune: Interval.Octave * -1,
			gain: 1
		},
		{
			type: "sine",
			detune: 0,
			gain: 1
		},
		{
			type: "sine",
			detune: Interval.Octave,
			gain: 0.5
		},
		{
			type: "sine",
			detune: Interval.Octave * 2,
			gain: 0.25
		},
		{
			type: "sine",
			detune: Interval.Octave * 3,
			gain: 0.125
		}
	]
};

const instruments: Synthesiser[] = [organ];

export default Tracks;
