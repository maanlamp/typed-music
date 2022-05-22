import {
	Classes,
	classes as makeClasses,
	Gap,
	Padding
} from "components/layout";
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
	as?: keyof HTMLElementTagNameMap;

	/** TODO: Documentation */
	classes?: Classes;

	/** TODO: Documentation */
	style?: CSSStyleDeclaration;

	/** TODO: Documentation */
	[key: string]: any;
}>;

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
	...props
}: FlexProps) =>
	React.createElement(as ?? "div", {
		...props,
		style:
			grow || shrink
				? {
						flexGrow:
							grow !== undefined
								? Number(grow)
								: undefined,
						flexShrink:
							shrink !== undefined
								? Number(shrink)
								: undefined,
						...style
				  }
				: style,
		className: makeClasses([
			"flex",
			direction,
			wrap && "wrap",
			gap,
			mainAxisAlignment,
			crossAxisAlignment,
			wrapAlignment,
			padding,
			classes
		]),
		children
	});

export default Flex;
