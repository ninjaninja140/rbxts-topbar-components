import React, { useState } from '@rbxts/react';
import { useStylesheet } from '../context';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
	/** Text displayed inside the tooltip. */
	content: string;
	/** The element that triggers the tooltip on hover. */
	children: React.ReactNode;
	/** Which side of the child the tooltip appears on. */
	side?: TooltipSide;
	/** Delay in milliseconds before the tooltip becomes visible. */
	delayMs?: number;
}

const positionMap: Record<TooltipSide, UDim2> = {
	top: new UDim2(0.5, 0, 0, -4),
	bottom: new UDim2(0.5, 0, 1, 4),
	left: new UDim2(0, -4, 0.5, 0),
	right: new UDim2(1, 4, 0.5, 0),
};

const anchorMap: Record<TooltipSide, Vector2> = {
	top: new Vector2(0.5, 1),
	bottom: new Vector2(0.5, 0),
	left: new Vector2(1, 0.5),
	right: new Vector2(0, 0.5),
};

export function Tooltip({ content, children, side = 'top', delayMs }: TooltipProps) {
	const stylesheet = useStylesheet().tooltip;
	const [visible, setVisible] = useState(false);
	const [showTimer, setShowTimer] = useState<thread | undefined>(undefined);

	const delay = delayMs ?? stylesheet.delayMs;

	const handleMouseEnter = () => {
		const timer = task.delay(delay / 1000, () => {
			setVisible(true);
		});
		setShowTimer(timer);
	};

	const handleMouseLeave = () => {
		if (showTimer) task.cancel(showTimer);
		setVisible(false);
	};

	return (
		<frame
			Size={new UDim2(0, 0, 0, 0)}
			AutomaticSize={Enum.AutomaticSize.XY}
			BackgroundTransparency={1}
			ClipsDescendants={true}
		>
			<textbutton
				Size={new UDim2(0, 0, 0, 0)}
				AutomaticSize={Enum.AutomaticSize.XY}
				AutoButtonColor={false}
				Text=""
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Event={{
					MouseEnter: handleMouseEnter,
					MouseLeave: handleMouseLeave,
				}}
			>
				{children}
			</textbutton>

			{visible && (
				<frame
					Position={positionMap[side]}
					AnchorPoint={anchorMap[side]}
					Size={new UDim2(0, 0, 0, 0)}
					AutomaticSize={Enum.AutomaticSize.XY}
					BackgroundColor3={stylesheet.backgroundColor}
					BackgroundTransparency={stylesheet.backgroundTransparency}
					BorderSizePixel={0}
					ZIndex={100}
					ClipsDescendants={true}
				>
					<uicorner CornerRadius={stylesheet.cornerRadius} />
					<uistroke
						Color={stylesheet.borderColor}
						Transparency={stylesheet.borderTransparency}
						Thickness={stylesheet.borderSize}
					/>
					<uipadding
						PaddingTop={new UDim(0, stylesheet.paddingY)}
						PaddingBottom={new UDim(0, stylesheet.paddingY)}
						PaddingLeft={new UDim(0, stylesheet.paddingX)}
						PaddingRight={new UDim(0, stylesheet.paddingX)}
					/>
					<textlabel
						Size={new UDim2(0, 0, 0, 0)}
						AutomaticSize={Enum.AutomaticSize.XY}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						FontFace={stylesheet.fontFace}
						Text={content}
						TextColor3={stylesheet.textColor}
						TextSize={stylesheet.textSize}
						TextXAlignment={Enum.TextXAlignment.Center}
						TextYAlignment={Enum.TextYAlignment.Center}
					/>
				</frame>
			)}
		</frame>
	);
}
