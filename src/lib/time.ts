import { AppContext } from "lib/state";
import { useContext, useEffect } from "react";

// TODO: Remove this global somehow
let started = false;

// TODO: Generalise to `useAnimationFrame`
const useTime = () => {
	const [state, dispatch] = useContext(AppContext);

	useEffect(() => {
		if (!state.playing || started) return;

		started = true;
		let requestedFrame: number;

		const update = (start: number) => {
			requestedFrame = requestAnimationFrame(
				currentTime => {
					if (!started) return;
					dispatch({
						type: "setTime",
						time: time => time + (currentTime - start)
					});
					update(currentTime);
				}
			);
			return requestedFrame;
		};

		update(performance.now());
		return () => {
			started = false;
			cancelAnimationFrame(requestedFrame);
		};
	}, [state.playing]);
};

export default useTime;
