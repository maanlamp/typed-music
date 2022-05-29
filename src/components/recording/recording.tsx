import Text from "components/interface/text";
import Flex, {
	Positioning
} from "components/layout/flex";
import Stack from "components/layout/stack";
import Note from "components/recording/note";
import { useApp } from "lib/state";
import { type Recording as RecordingType } from "lib/track";
import "./recording.css";

type RecordingProps = Readonly<{
	recording: RecordingType;
}>;

const Recording = ({ recording }: RecordingProps) => {
	const [state] = useApp();
	const duration =
		((recording.end ?? 0) - recording.start) *
		state.pxPerMs;
	return (
		<Stack
			positioning={Positioning.Absolute}
			classes="recording"
			style={{
				width: `${duration}px`,
				left: `${recording.start * state.pxPerMs}px`
			}}>
			<Flex
				positioning={Positioning.Absolute}
				offset={{ left: 8, top: 4 }}>
				<Text weight={700} size="small">
					{recording.name}
				</Text>
			</Flex>
			{recording.notes.map((note, i) => (
				<Note
					key={i}
					recording={recording}
					note={note}
					{...state}
				/>
			))}
		</Stack>
	);
};

export default Recording;
