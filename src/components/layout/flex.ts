import {
	Classes,
	classes as makeClasses,
	Gap,
	Padding
} from "components/layout/layout";
import React, { ReactNode } from "react";

export enum FlexDirection {
	Row = "row",
	Column = "column"
}

export enum MainAxisAlignment {
	Start = "axis-main-flex-start",
	Center = "axis-main-center",
	End = "axis-main-flex-end",
	SpaceBetween = "axis-main-space-between"
}

export enum CrossAxisAlignment {
	Start = "axis-cross-flex-start",
	Center = "axis-cross-center",
	End = "axis-cross-flex-end",
	Stretch = "axis-cross-stretch",
	Baseline = "axis-cross-baseline"
}

export enum WrapAlignment {
	Start = "wrap-flex-start",
	Center = "wrap-center",
	End = "wrap-flex-end",
	Stretch = "wrap-stretch",
	Baseline = "wrap-baseline",
	SpaceBetween = "wrap-space-between"
}

export enum Positioning {
	Static = "position-static",
	Relative = "position-relative",
	Absolute = "position-absolute",
	Fixed = "position-fixed",
	Sticky = "position-sticky"
}

type Rect<T> = Readonly<{
	top: T;
	right: T;
	bottom: T;
	left: T;
}>;

export enum Overflow {
	Visible = "overflow-visible",
	Hidden = "overflow-hidden",
	Clip = "overflow-clip",
	Scroll = "overflow-scroll",
	Auto = "overflow-auto"
}

export type FlexProps = Readonly<{
	children?: ReactNode;

	/** TODO: Documentation */
	direction?: FlexDirection;

	/** TODO: Documentation */
	wrap?: true;

	/** TODO: Documentation */
	grow?: true | number;

	/** TODO: Documentation */
	shrink?: true | number;

	/** TODO: Documentation */
	mainAxisAlignment?: MainAxisAlignment;

	/** TODO: Documentation */
	crossAxisAlignment?: CrossAxisAlignment;

	/** TODO: Documentation */
	wrapAlignment?: WrapAlignment;

	/** TODO: Documentation */
	gap?: Gap;

	/** TODO: Documentation */
	padding?: Padding;

	/** TODO: Documentation */
	as?: keyof JSX.IntrinsicElements;

	/** TODO: Documentation */
	classes?: Classes;

	/** TODO: Documentation */
	style?: Partial<CSSStyleDeclaration>;

	/** TODO: Documentation */
	positioning?: Positioning;

	/** TODO: Documentation */
	offset?: Partial<Rect<number>>;

	/** TODO: Documentation */
	overflow?:
		| Overflow
		| Partial<Readonly<{ x: Overflow; y: Overflow }>>;

	/** TODO: Documentation */
	grid?: Readonly<{
		columnStart?: string | number;
		columnEnd?: string | number;
		rowStart?: string | number;
		rowEnd?: string | number;
	}>;
}> &
	JSX.IntrinsicElements["div"];

const Flex = ({
	children,
	direction,
	wrap,
	grow,
	shrink,
	mainAxisAlignment,
	crossAxisAlignment,
	wrapAlignment,
	gap,
	padding,
	as,
	classes,
	style,
	positioning,
	offset,
	overflow,
	grid,
	...props
}: FlexProps) =>
	React.createElement(as ?? "div", {
		...props,
		style: {
			flexGrow:
				grow !== undefined ? Number(grow) : undefined,
			flexShrink:
				shrink !== undefined
					? Number(shrink)
					: undefined,
			top: offset?.top && `${offset.top}px`,
			right: offset?.right && `${offset.right}px`,
			bottom: offset?.bottom && `${offset.bottom}px`,
			left: offset?.left && `${offset.left}px`,
			gridColumnStart: grid?.columnStart,
			gridColumnEnd: grid?.columnEnd,
			gridRowStart: grid?.rowStart,
			gridRowEnd: grid?.rowEnd,
			...style
		},
		className: makeClasses([
			"flex",
			direction,
			wrap && "wrap",
			gap,
			mainAxisAlignment,
			crossAxisAlignment,
			wrapAlignment,
			padding,
			positioning,
			overflow &&
				(typeof overflow === "string"
					? overflow
					: Object.entries(overflow).map(
							([axis, overflow]) =>
								overflow.split("-").join(`-${axis}-`)
					  )),
			classes
		]),
		children
	});

export default Flex;
