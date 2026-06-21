import React, { useState } from '@rbxts/react';
import { LocationContext, useStylesheet } from '../context';
import { useGuiInset } from '../hooks/use-gui-inset';
import { useVoicechatEnabled } from '../hooks/use-voicechat-enabled';
import type { IconId } from './icon';

export type SelectionMode = 'Single' | 'Multiple';

interface ProviderProps extends React.PropsWithChildren {
	selectionMode?: SelectionMode;
	gameVoiceChatEnabled?: boolean;
}

export function TopbarProvider({ selectionMode = 'Single', gameVoiceChatEnabled, children }: ProviderProps) {
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const inset = useGuiInset();
	const voiceChatEnabled = useVoicechatEnabled();
	const stylesheet = useStylesheet().provider;

	const hasBetaLabel = gameVoiceChatEnabled && voiceChatEnabled;
	const leftPadding = hasBetaLabel ? stylesheet.paddingLeft + 16 : stylesheet.paddingLeft;
	const frameHeight = inset.Height - stylesheet.insetHeightOffset;

	return (
		<LocationContext.Provider
			value={{
				type: 'provider',
				selectedIcons: selectedIcons,
				iconSelected: (iconId) => {
					if (selectionMode === 'Single') {
						return setSelectedIcons([iconId]);
					}
					return setSelectedIcons((icons) => [...icons, iconId]);
				},
				iconDeselected: (iconId) => {
					if (selectionMode === 'Single' && selectedIcons.includes(iconId)) {
						return setSelectedIcons([]);
					}
					return setSelectedIcons((icons) => icons.filter((T) => T !== iconId));
				},
			}}
		>
			<frame
				key={'TopbarProvider'}
				BackgroundTransparency={stylesheet.backgroundTransparency}
				BackgroundColor3={stylesheet.backgroundColor}
				Size={UDim2.fromOffset(inset.Width * stylesheet.sizeScale.X, frameHeight * stylesheet.sizeScale.Y)}
				AnchorPoint={stylesheet.anchorPoint}
				Position={stylesheet.position}
			>
				<uipadding
					key={'UIPadding'}
					PaddingLeft={new UDim(0, leftPadding)}
					PaddingRight={new UDim(0, stylesheet.paddingRight)}
					PaddingTop={new UDim(0, stylesheet.paddingTop)}
					PaddingBottom={new UDim(0, stylesheet.paddingBottom)}
				/>
				<uilistlayout
					key={'UIListLayout'}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, stylesheet.iconSpacing)}
				/>
				{children}
			</frame>
		</LocationContext.Provider>
	);
}
