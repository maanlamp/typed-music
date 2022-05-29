import { FlexProps } from "components/layout/flex";
import { classes } from "components/layout/layout";
import Stack from "components/layout/stack";
import { useApp } from "lib/state";
import React, { useEffect, useState } from "react";
import "./timeline-rail.css";

type TimelineRailProps = FlexProps &
	Readonly<{
		tracks: number;
	}>;

const TimelineRail = ({
	tracks,
	...props
}: TimelineRailProps) => {
	const [state, dispatch] = useApp();
	const [dragging, setDragging] = useState(false);
	const [x, setX] = useState<number>();
	const [wasPlayingBefore, setWasPlayingBefore] =
		useState(state.playing);
	const rail = document.querySelector<HTMLDivElement>(
		".timeline-rail"
	);

	const line = 250 * state.pxPerMs;
	const threshold = 25 * state.pxPerMs;

	const calculateX = (
		e: MouseEvent | React.MouseEvent
	) => {
		if (!rail) return 0;
		const dimensions = rail.getBoundingClientRect();

		// TODO: Allow for smaller adjustments if mouse is
		// further away from thumb.
		const point = addSnapPoints(
			e.pageX,
			line,
			threshold
		);

		return Math.max(
			0,
			Math.min(point, dimensions.right) -
				dimensions.left
		);
	};

	useEffect(() => {
		const stopDragging = (e: MouseEvent) => {
			if (!dragging || !rail) return;
			dispatch({
				type: "setTime",
				time: calculateX(e) / state.pxPerMs
			});
			dispatch({
				type: "setPlaying",
				playing: wasPlayingBefore
			});
			setX(undefined);
			setDragging(false);
		};

		const onDrag = (e: MouseEvent) => {
			if (!dragging) return;
			setX(calculateX(e));
		};

		window.addEventListener("mouseup", stopDragging);
		window.addEventListener("mousemove", onDrag);

		return () => {
			window.removeEventListener(
				"mouseup",
				stopDragging
			);
			window.removeEventListener("mousemove", onDrag);
		};
	}, [dragging, rail]);

	return (
		<>
			<Stack
				classes="timeline-rail"
				onMouseDown={e => {
					if (e.button !== 0) return;
					setWasPlayingBefore(state.playing);
					dispatch({
						type: "setPlaying",
						playing: false
					});
					setDragging(true);
					setX(calculateX(e));
				}}
				{...props}>
				<div
					className={classes([
						"timeline-thumb",
						dragging && "dragging",
						state.playing && "playing"
					])}
					style={{
						left: `${
							x ?? state.time * state.pxPerMs
						}px`
					}}
				/>
			</Stack>
			<div
				className={classes([
					"timeline-cursor",
					dragging && "dragging",
					state.playing && "playing"
				])}
				style={{
					transform: `translateX(${
						(x ?? state.time * state.pxPerMs) +
						(Math.round(x ?? state.time) === 0 ? 0 : 1)
					}px)`,
					gridRow: `1 / ${tracks}`
				}}
			/>
		</>
	);
};

const addSnapPoints = (
	x: number,
	every: number,
	threshold: number
) => {
	const mod = x % every;
	return mod < threshold || every - mod < threshold
		? Math.round(x / every) * every
		: x;
};

export default TimelineRail;
