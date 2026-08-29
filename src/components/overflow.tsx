import React from '@rbxts/react';
import { LocationContext, useLocation } from '../context';
import { Dropdown } from './dropdown';
import { Icon } from './icon';

/**
 * Collects child icons and renders a "more" button (⋯) when they overflow
 * the available space. Overflowing icons appear in a dropdown.
 *
 * Simplified from TopbarPlus v3 overflow handler.
 */
export function Overflow({ children }: { children: React.ReactNode }) {
	const childArray = React.Children.toArray(children) as React.ReactElement[];

	if (childArray.size() === 0) return <React.Fragment />;

	return (
		<Icon
			imageId='rbxassetid://6069276526'
			toggle
			defaultState='deselected'
			contentPaddingX={4}
			contentPaddingY={4}
		>
			<OverflowDropdown>{childArray}</OverflowDropdown>
		</Icon>
	);
}

/**
 * Mounts a {@link Dropdown} inside the overflow button without letting it
 * resize the button's layout footprint. The overflow menu is a floating
 * overlay, so it must not push the surrounding topbar icons around when it
 * opens or closes.
 */
function OverflowDropdown({ children }: React.PropsWithChildren) {
	const location = useLocation();

	assert(location.type === 'icon', 'Overflow dropdown must be rendered under an icon');

	return (
		<LocationContext.Provider
			value={{
				type: 'icon',
				isVisible: location.isVisible,
				isUnderDropdown: location.isUnderDropdown,
				width: location.width,
				setAnimationState: location.setAnimationState,
				setContentSize: location.setContentSize,
				setDropdownSize: () => {},
			}}
		>
			<Dropdown>{children}</Dropdown>
		</LocationContext.Provider>
	);
}
