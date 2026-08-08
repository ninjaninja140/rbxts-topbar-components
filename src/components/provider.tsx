import React, { useState } from '@rbxts/react';
import { LocationContext, useStylesheet } from '../context';
import { useGuiInset } from '../hooks/use-gui-inset';
import { useVoicechatEnabled } from '../hooks/use-voicechat-enabled';
import { debugLog } from '../utilities/debug';
import type { IconId } from './icon';

export type SelectionMode = 'Single' | 'Multiple';

/**
 * Anchors children to a side of the topbar.
 * Uses a horizontal list layout with icon spacing from the stylesheet.
 */
function DockFrame(props: {
	anchor: Vector2;
	position: UDim2;
	paddingLeft?: UDim;
	paddingRight?: UDim;
	children: React.ReactNode;
}) {
	const stylesheet = useStylesheet().provider;
	return (
		<frame
			BackgroundTransparency={1}
			AnchorPoint={props.anchor}
			Position={props.position}
			Size={UDim2.fromScale(0, 1)}
			AutomaticSize={Enum.AutomaticSize.X}
		>
			{(props.paddingLeft !== undefined || props.paddingRight !== undefined) && (
				<uipadding
					PaddingLeft={props.paddingLeft ?? new UDim(0, 0)}
					PaddingRight={props.paddingRight ?? new UDim(0, 0)}
				/>
			)}
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
				Padding={new UDim(0, stylesheet.iconSpacing)}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			{props.children}
		</frame>
	);
}

/** Docks icons to the left side of the topbar. */
export function LeftDock({ children }: React.PropsWithChildren) {
	return <DockFrame anchor={new Vector2(0, 0.5)} position={new UDim2(0, 0, 0.5, 0)} children={children} />;
}

/** Docks icons to the center of the topbar. */
export function CenterDock({ children }: React.PropsWithChildren) {
	const stylesheet = useStylesheet().provider;
	return (
		<DockFrame
			anchor={new Vector2(0.5, 0.5)}
			position={new UDim2(0.5, 0, 0.5, 0)}
			paddingLeft={new UDim(0, stylesheet.iconGroupSpacing)}
			paddingRight={new UDim(0, stylesheet.iconGroupSpacing)}
			children={children}
		/>
	);
}

/** Docks icons to the right side of the topbar. */
export function RightDock({ children }: React.PropsWithChildren) {
	const stylesheet = useStylesheet().provider;
	return (
		<DockFrame
			anchor={new Vector2(1, 0.5)}
			position={new UDim2(1, 0, 0.5, 0)}
			paddingLeft={new UDim(0, stylesheet.iconGroupSpacing)}
			children={children}
		/>
	);
}

interface ProviderProps extends React.PropsWithChildren {
	/**
	 * How icon selection works across the topbar.
	 * `Single` deselects all other icons when one is selected;
	 * `Multiple` allows any number to be selected at once.
	 */
	selectionMode?: SelectionMode;
	/** When `true`, shows a "Beta" label if voice chat is enabled on the client. */
	gameVoiceChatEnabled?: boolean;
}

/**
 * Root provider for the topbar system.
 *
 * Must wrap all topbar components. Manages global selection state,
 * gui inset tracking, and the topbar frame bounds.
 */
export function TopbarProvider({ selectionMode = 'Single', gameVoiceChatEnabled, children }: ProviderProps) {
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const inset = useGuiInset();
	const voiceChatEnabled = useVoicechatEnabled();
	const stylesheet = useStylesheet().provider;

	const hasBetaLabel = gameVoiceChatEnabled && voiceChatEnabled;
	const leftPadding = hasBetaLabel ? stylesheet.paddingLeft + 16 : stylesheet.paddingLeft;

	const rawHeight = inset.Height - stylesheet.insetHeightOffset;
	const frameHeight = stylesheet.forceFrameHeight !== undefined ? stylesheet.forceFrameHeight : rawHeight;

	debugLog(
		`TopbarProvider frame: inset.Height=${inset.Height}, inset.Width=${inset.Width}`,
		`insetHeightOffset=${stylesheet.insetHeightOffset}`,
		`rawHeight=${rawHeight}`,
		`forceFrameHeight=${stylesheet.forceFrameHeight}`,
		`finalHeight=${frameHeight}`,
		`sizeScale=(${stylesheet.sizeScale.X}, ${stylesheet.sizeScale.Y})`
	);

	return (
		<LocationContext.Provider
			value={{
				type: 'provider',
				selectedIcons: selectedIcons,
				iconSelected: (iconId) => {
					if (selectionMode === 'Single') return setSelectedIcons([iconId]);
					return setSelectedIcons((icons) => [...icons, iconId]);
				},
				iconDeselected: (iconId) => {
					if (selectionMode === 'Single' && selectedIcons.includes(iconId)) return setSelectedIcons([]);
					return setSelectedIcons((icons) => icons.filter((T) => T !== iconId));
				},
			}}
		>
			<frame
				BackgroundTransparency={stylesheet.backgroundTransparency}
				BackgroundColor3={stylesheet.backgroundColor}
				Size={UDim2.fromOffset(inset.Width * stylesheet.sizeScale.X, frameHeight * stylesheet.sizeScale.Y)}
				AnchorPoint={stylesheet.anchorPoint}
				Position={stylesheet.position}
			>
				<uipadding
					PaddingLeft={new UDim(0, leftPadding)}
					PaddingRight={new UDim(0, stylesheet.paddingRight)}
					PaddingTop={new UDim(0, stylesheet.paddingTop)}
					PaddingBottom={new UDim(0, stylesheet.paddingBottom)}
				/>
				{children}
			</frame>
		</LocationContext.Provider>
	);
}
