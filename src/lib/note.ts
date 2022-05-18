export enum NoteName {
	A = 0,
	B = 2,
	C = 3,
	D = 5,
	E = 7,
	F = 8,
	G = 10
}

export enum Accidental {
	Sharp = 1,
	Flat = -1,
	Natural = 0
}

export type QualifiedNote = Readonly<{
	name: NoteName;
	accidental?: Accidental;
}>;

export type Octave = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Note = QualifiedNote &
	Readonly<{
		octave: Octave;
	}>;

export type Chord = Note[];

export const pitch = (note: Note) =>
	note.name +
	12 * (note.octave - 1) +
	(note.accidental ?? 0);

export const interval = (a: Note, b: Note) =>
	pitch(b) - pitch(a);

export const constants = {
	A_4_FREQ: 440,
	A_4: { name: NoteName.A, octave: 4 } as Note,
	FREQ_SCALE: 2 ** (1 / 12)
};

export const noteToFrequency = (note: Note) =>
	constants.A_4_FREQ *
	constants.FREQ_SCALE **
		interval(constants.A_4, note);

export const noteFromFrequency = (
	frequency: number
) => {
	const semitonesFromA4 = Math.round(
		12 * Math.log2(frequency / constants.A_4_FREQ)
	);
	const octaveDifference = Math.ceil(
		semitonesFromA4 / 12
	);
	const absmod12 = Math.abs(semitonesFromA4 % 12);
	let accidental = Accidental.Natural;
	const name = NoteName[absmod12]
		? absmod12
		: absmod12 + (accidental = Accidental.Sharp);
	const note: Note = {
		name,
		octave: (constants.A_4.octave +
			octaveDifference) as Octave,
		accidental
	};

	return note;
};

export const accidentalToString = (
	accidental: Accidental
) => {
	switch (accidental) {
		case Accidental.Flat:
			return "♭";
		case Accidental.Natural:
			return "♮";
		case Accidental.Sharp:
			return "♯";
	}
};

export const noteToString = (note: Note) => {
	let string = NoteName[note.name];
	if (note.accidental)
		string += accidentalToString(note.accidental);
	string += ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈"][
		note.octave - 1
	];
	return string;
};
