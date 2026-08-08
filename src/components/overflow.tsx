import React, { useCallback, useMemo, useState } from '@rbxts/react';
import { useStylesheet } from '../context';
import { Icon } from './icon';

/**
 * Collects child icons and renders a "more" button (⋯) when they overflow
 * the available space. Overflowing icons appear in a dropdown.
 *
 * Simplified from TopbarPlus v3 overflow handler.
 */
export function Overflow({ children }: { children: React.ReactNode }) {
	const stylesheet = useStylesheet();
	const [expanded, setExpanded] = useState(false);

	const childArray = useMemo(() => {
		const arr = React.Children.toArray(children) as React.ReactElement[];
		return arr;
	}, [children]);

	const overflowCount = childArray.size();

	const handleToggle = useCallback(() => {
		setExpanded((prev) => !prev);
	}, []);

	if (overflowCount === 0) {
		return <React.Fragment />;
	}

	return (
		<Icon
			imageId="rbxassetid://6069276526"
			static={false}
			toggleStateOnClick={true}
			contentPaddingX={4}
			contentPaddingY={4}
		>
			{expanded && (
				<frame
					Size={new UDim2(0, 0, 0, 0)}
					Position={stylesheet.customDropdown.position ?? stylesheet.dropdownTheme.position}
					BackgroundColor3={stylesheet.dropdownTheme.backgroundColor}
					BackgroundTransparency={stylesheet.dropdownTheme.backgroundTransparency}
					BorderSizePixel={stylesheet.dropdownTheme.borderSize}
					BorderColor3={stylesheet.dropdownTheme.borderColor}
					ZIndex={50}
				>
					<uicorner CornerRadius={stylesheet.dropdownTheme.cornerRadius} />
					<uistroke
						Color={stylesheet.dropdownTheme.borderColor}
						Transparency={stylesheet.dropdownTheme.borderTransparency}
						Thickness={stylesheet.dropdownTheme.borderSize}
					/>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, 2)}
					/>
					{childArray}
				</frame>
			)}
		</Icon>
	);
}
