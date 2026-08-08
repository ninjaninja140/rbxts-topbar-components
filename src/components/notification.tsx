import React from '@rbxts/react';
import { useStylesheet } from '../context';

/**
 * A red notification badge that overlays an icon.
 *
 * Displays a count number. Values over 99 show "99+".
 * Hides automatically when `count` is 0 or less.
 */
export function Notification({ count }: { /** Number to display. Hides when ≤ 0. */ count: number }) {
	const stylesheet = useStylesheet().notification;
	if (count <= 0) return <React.Fragment />;

	const exceeded99 = count > 99;
	const displayText = exceeded99 ? '99+' : tostring(count);

	return (
		<frame
			Size={stylesheet.size}
			Position={stylesheet.position}
			AnchorPoint={new Vector2(1, 0)}
			ZIndex={25}
			AutomaticSize={exceeded99 ? Enum.AutomaticSize.X : undefined}
			BackgroundColor3={stylesheet.backgroundColor}
			BackgroundTransparency={stylesheet.backgroundTransparency}
			BorderSizePixel={0}
		>
			<uicorner CornerRadius={stylesheet.cornerRadius} />
			<uistroke
				Color={stylesheet.borderColor}
				Transparency={stylesheet.borderTransparency}
				Thickness={1}
			/>
			<textlabel
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.515, 0)}
				AutomaticSize={exceeded99 ? Enum.AutomaticSize.X : undefined}
				BackgroundTransparency={1}
				FontFace={stylesheet.fontFace}
				Text={displayText}
				TextColor3={stylesheet.textColor}
				TextSize={stylesheet.textSize}
				TextWrapped={true}
				ZIndex={26}
			/>
		</frame>
	);
}
