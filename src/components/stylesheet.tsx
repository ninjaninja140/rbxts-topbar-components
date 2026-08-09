import React from '@rbxts/react';
import { StylesheetContext } from '../context';
import { DefaultStylesheet, type Stylesheet as StylesheetType } from '../style';
import { reconcile } from '../utilities/merge';
import type { DeepPartial } from '../utilities/types';

interface Props extends React.PropsWithChildren {
	/** A partial stylesheet that is deep-merged over the defaults. */
	stylesheet: PartialStylesheet;
}
type PartialStylesheet = DeepPartial<StylesheetType>;

export { DefaultStylesheet };
export type { StylesheetType };

/**
 * Applies a custom stylesheet to all descendant topbar components.
 *
 * Only the properties you provide will override the defaults — missing
 * keys fall back to {@link DefaultStylesheet}.
 */
export function Stylesheet({ stylesheet, children }: Props) {
	return (
		<StylesheetContext.Provider value={reconcile(stylesheet, DefaultStylesheet) as StylesheetType}>
			{children}
		</StylesheetContext.Provider>
	);
}
