import { mapBinding, useMotion, useMountEffect } from '@rbxts/pretty-react-hooks';
import React, { useEffect, useMemo, useState } from '@rbxts/react';
import { LocationContext, useLocation, useStylesheet } from '../context';
import type { IconId } from './icon';
import type { SelectionMode } from './provider';

/** Properties accepted by {@link Dropdown}. */
export interface DropdownProps extends React.PropsWithChildren {
	/** Minimum width of the dropdown in pixels. */
	minWidth?: number;
	/** Maximum height before the dropdown becomes scrollable. */
	maxHeight?: number;
	/** Maximum width of the dropdown in pixels. */
	maxWidth?: number;
	/** Vertical padding between child icons. */
	padding?: UDim;
	/** Fixed height applied to child icons inside this dropdown. */
	forceHeight?: number;
	/** Corner radius applied to child icons inside this dropdown. */
	iconCornerRadius?: UDim;
	/** Scroll bar thickness in pixels. */
	scrollBarThickness?: number;
	/** Scroll bar transparency (0 = opaque, 1 = invisible). */
	scrollBarTransparency?: number;
	/** Image for the scroll bar top cap. */
	topImage?: string;
	/** Image for the scroll bar bottom cap. */
	bottomImage?: string;
	/** Image for the scroll bar middle segment. */
	midImage?: string;
	/** Color applied to the scroll bar images. */
	scrollBarImageColor?: Color3;
	/** Selection mode: `Single` deselects others, `Multiple` allows many. */
	selectionMode?: SelectionMode;
}

/**
 * A dropdown menu that appears below its parent icon.
 *
 * Child `<Icon>` components placed inside automatically register and size
 * themselves. The dropdown animates open/closed with a spring transition.
 */
export function Dropdown(componentProps: DropdownProps) {
	const location = useLocation();
	const fullStylesheet = useStylesheet();
	const stylesheet = fullStylesheet.dropdown;
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const [contents, setContents] = useState(new Map<number, Vector2>());

	assert(location.type === 'icon', 'Dropdowns can only be located under icons');
	const [transition, transitionMotion] = useMotion(location.isVisible ? 1 : 0);

	const props = { ...stylesheet, ...componentProps };
	const isNested = location.isUnderDropdown;
	const maxWidth = isNested ? location.width : props.maxWidth;
	const minWidth = isNested ? location.width : props.minWidth;
	const maxHeight = props.maxHeight;

	const contentSize = useMemo(() => {
		let y = 0;
		let x = minWidth;
		for (const [_, size] of contents) {
			x = math.min(maxWidth, math.max(x, size.X));
			y += size.Y + stylesheet.padding.Offset;
		}

		return new Vector2(x, y);
	}, [contents, maxWidth, minWidth, stylesheet.padding.Offset]);

	useEffect(() => {
		location.setAnimationState(true);
		transitionMotion.spring(location.isVisible ? 1 : 0, {
			tension: fullStylesheet.animation.dropdownTransitionSpeed * 15,
			friction: 26,
		});
	}, [location.isVisible]);

	useMountEffect(() => transitionMotion.onComplete(() => location.setAnimationState(false)));

	useEffect(() => {
		location.setContentSize(contentSize);
	}, [contentSize, location.setContentSize]);

	const scrollingEnabled = !isNested && contentSize.Y > maxHeight;
	return (
		<LocationContext.Provider
			value={{
				type: 'dropdown',
				selectedIcons: selectedIcons,
				iconSelected: (iconId) => {
					if (props.selectionMode === 'Single') return setSelectedIcons([iconId]);
					return setSelectedIcons((icons) => [...icons, iconId]);
				},
				iconDeselected: (iconId) => {
					if (props.selectionMode === 'Single' && selectedIcons.includes(iconId)) return setSelectedIcons([]);
					return setSelectedIcons((icons) => icons.filter((T) => T !== iconId));
				},
				registerChild: (id, size) => {
					setContents((contents) => new Map([...contents, [id, size]]));
				},
				removeChild: (id) => {
					setContents((contents) => new Map([...contents].filter((T) => T[0] !== id)));
				},
				desiredIconWidth: isNested ? location.width : contentSize.X,
			}}
		>
			<scrollingframe
				ClipsDescendants={true}
				Size={mapBinding(transition, (t) =>
					UDim2.fromOffset(
						contentSize.X + (scrollingEnabled ? props.scrollBarThickness : 0),
						t * math.min(contentSize.Y, isNested ? contentSize.Y : maxHeight)
					)
				)}
				BorderSizePixel={fullStylesheet.dropdownTheme.borderSize}
				BorderColor3={fullStylesheet.dropdownTheme.borderColor}
				BackgroundColor3={fullStylesheet.dropdownTheme.backgroundColor}
				Position={fullStylesheet.dropdownTheme.position}
				ScrollBarImageColor3={props.scrollBarImageColor}
				ScrollBarImageTransparency={scrollingEnabled && location.isVisible ? props.scrollBarTransparency : 1}
				ScrollingEnabled={scrollingEnabled}
				AutomaticCanvasSize={Enum.AutomaticSize.None}
				CanvasSize={UDim2.fromOffset(0, contentSize.Y)}
				ScrollBarThickness={scrollingEnabled ? props.scrollBarThickness : 0}
				BackgroundTransparency={fullStylesheet.dropdownTheme.backgroundTransparency}
				Change={{
					AbsoluteSize: (rbx) => location.setDropdownSize(rbx.AbsoluteSize),
				}}
				MidImage={props.midImage}
				TopImage={props.topImage}
				BottomImage={props.bottomImage}
			>
				<uicorner CornerRadius={fullStylesheet.dropdownTheme.cornerRadius} />
				<uistroke
					Thickness={fullStylesheet.dropdownTheme.borderSize}
					Color={fullStylesheet.dropdownTheme.borderColor}
					Transparency={fullStylesheet.dropdownTheme.borderTransparency}
				/>
				{props.children}
				{isNested && <uipadding PaddingTop={stylesheet.padding} />}
				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} Padding={stylesheet.padding} />
			</scrollingframe>
		</LocationContext.Provider>
	);
}
