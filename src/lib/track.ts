import { Color } from "lib/color";

export type Track = Readonly<{
	id: string;
	name: string;
	muted: boolean;
	volume: readonly [number, number];
	isRecording: boolean;
	locked: boolean;
	pan: number;
	recordings: Recording[];
	color: Color;
}>;

export type Recording = Readonly<{
	id: string;
	name: string;
	start: number;
	end?: number;
	notes: TemporalNote[];
}>;

export type Note = Readonly<{
	id: string;
	note: number;
	velocity: number;
	duration?: number;
}>;

export type TemporalNote = Note &
	Readonly<{
		time: number;
	}>;
