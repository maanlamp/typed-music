import { ReactComponent as ArrowFromRightIcon } from "assets/icons/arrow-from-right.svg";
import { ReactComponent as ArrowToRightIcon } from "assets/icons/arrow-to-right.svg";
import { ReactComponent as MetronomeIcon } from "assets/icons/metronome.svg";
import { ReactComponent as MusicIcon } from "assets/icons/music.svg";
import { ReactComponent as PauseIcon } from "assets/icons/pause.svg";
import { ReactComponent as PlayIcon } from "assets/icons/play.svg";
import { ReactComponent as AddIcon } from "assets/icons/plus.svg";
import { ReactComponent as RepeatIcon } from "assets/icons/repeat.svg";
import { ReactComponent as RewindIcon } from "assets/icons/rewind.svg";
import { ReactComponent as ShareIcon } from "assets/icons/share.svg";
import Button from "components/interface/button";
import Icon from "components/interface/icon";
import IconButton from "components/interface/icon-button";
import Text from "components/interface/text";
import Textfield from "components/interface/textfield";
import Column from "components/layout/column";
import {
	CrossAxisAlignment,
	MainAxisAlignment,
	Overflow
} from "components/layout/flex";
import Grid from "components/layout/grid";
import {
	Gap,
	Padding
} from "components/layout/layout";
import "components/layout/layout.css";
import Row from "components/layout/row";
import TimelineRail from "components/timeline/timeline-rail";
import TrackDrawer from "components/track/track-drawer";
import TrackRail from "components/track/track-rail";
import "index.css";
import {
	AppContext,
	initialState,
	reducer
} from "lib/state";
import React, { useReducer } from "react";
import ReactDOM from "react-dom";

// TODO: Visualise each track's gain with https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode

const App = () => {
	const [state, dispatch] = useReducer(
		reducer,
		initialState
	);

	const tracks = Object.values(state.tracks);
	const trackCount = tracks.length;

	return (
		<AppContext.Provider value={[state, dispatch]}>
			<Column as="main" grow>
				<Row
					padding={Padding.Medium}
					mainAxisAlignment={
						MainAxisAlignment.SpaceBetween
					}
					crossAxisAlignment={
						CrossAxisAlignment.Center
					}
					gap={Gap.Huge}>
					<Row
						crossAxisAlignment={
							CrossAxisAlignment.Center
						}
						gap={Gap.Small}>
						<Icon svg={MusicIcon} />
						<Text weight={600}>Web Band</Text>
					</Row>
					<Row
						crossAxisAlignment={
							CrossAxisAlignment.Center
						}
						gap={Gap.Large}>
						<Row
							gap={Gap.Small}
							crossAxisAlignment={
								CrossAxisAlignment.Baseline
							}>
							<Textfield
								type="number"
								value={state.signature[0]}
								onChange={value =>
									dispatch({
										type: "setSignature",
										signature: signature => [
											parseInt(value),
											signature[1]
										]
									})
								}
							/>
							<span>/</span>
							<Textfield
								type="number"
								value={state.signature[1]}
								onChange={value =>
									dispatch({
										type: "setSignature",
										signature: signature => [
											signature[0],
											parseInt(value)
										]
									})
								}
							/>
						</Row>
						<Row>
							<IconButton
								icon={RewindIcon}
								onClick={() =>
									dispatch({
										type: "setTime",
										time: 0
									})
								}
							/>
							<IconButton
								icon={
									state.playing ? PauseIcon : PlayIcon
								}
								onClick={() =>
									dispatch({
										type: "setPlaying",
										playing: !state.playing
									})
								}
							/>
							<IconButton
								icon={RepeatIcon}
								onClick={() => {
									throw new Error(
										"TODO: Repeat playback to selected range/entire timeline"
									);
								}}
							/>
						</Row>
						<Row
							crossAxisAlignment={
								CrossAxisAlignment.Center
							}
							gap={Gap.Small}>
							<IconButton
								icon={MetronomeIcon}
								onClick={() => {
									throw new Error(
										"TODO: Toggle metronome"
									);
								}}
							/>
							<Row
								as="label"
								crossAxisAlignment={
									CrossAxisAlignment.Baseline
								}
								gap={Gap.Small}>
								<Textfield
									type="number"
									value={state.bpm}
									onChange={value =>
										dispatch({
											type: "setBpm",
											bpm: parseInt(value)
										})
									}
								/>
								<Text weight={600}>BPM</Text>
							</Row>
						</Row>
					</Row>
					<IconButton
						icon={ShareIcon}
						onClick={() => {
							throw new Error(
								"TODO: Implement sharing by hashing all tracks and instruments?"
							);
						}}
					/>
				</Row>
				<Grid
					rows={["min-content", "min-content"]}
					overflow={{
						x: Overflow.Hidden,
						y: Overflow.Auto
					}}>
					<Row
						style={{
							position: "sticky",
							top: "0",
							zIndex: "1",
							background: "white"
						}}
						grid={{
							columnStart: 0,
							columnEnd: 1,
							rowStart: 1
						}}
						padding={Padding.Small}
						mainAxisAlignment={
							MainAxisAlignment.SpaceBetween
						}
						crossAxisAlignment={
							CrossAxisAlignment.Center
						}
						gap={Gap.Medium}>
						<Button
							icon={AddIcon}
							onClick={() =>
								dispatch({
									type: "addTrack",
									name: "New track"
								})
							}>
							<Text weight={600}>Add track</Text>
						</Button>
						<IconButton
							icon={
								state.drawersOpen
									? ArrowFromRightIcon
									: ArrowToRightIcon
							}
							onClick={() =>
								dispatch({ type: "toggleDrawers" })
							}
						/>
					</Row>
					{tracks.map((track, i) => (
						<TrackDrawer
							grid={{
								columnStart: 0,
								columnEnd: 1,
								rowStart: i + 2
							}}
							key={track.id}
							track={track}
						/>
					))}
					<TimelineRail
						style={{
							position: "sticky",
							top: "0",
							zIndex: "1"
						}}
						grid={{
							columnStart: 1,
							columnEnd: 2,
							rowStart: 1,
							rowEnd: 2
						}}
						tracks={trackCount + 2}
					/>
					{tracks.map((track, i) => (
						<TrackRail
							grid={{
								columnStart: 1,
								rowStart: i + 2
							}}
							key={track.id}
							track={track}
						/>
					))}
				</Grid>
			</Column>
		</AppContext.Provider>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
