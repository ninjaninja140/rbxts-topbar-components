import { mapBinding, useMotion, useMountEffect } from '@rbxts/pretty-react-hooks';
import React, { useBinding, useRef } from '@rbxts/react';
import { useStylesheet } from '../context';

interface CustomDropdownProps extends React.PropsWithChildren {
	/** Whether the dropdown is visible. Typically driven by parent icon state. */
	visible: boolean;
	/** Width of the dropdown in pixels. */
	width?: number;
	/** Maximum height before scrolling. */
	maxHeight?: number;
	/** Position relative to the parent icon. */
	position?: UDim2;
}

/**
 * A dropdown panel for arbitrary custom content (not just child icons).
 *
 * Use this when you need rich UI inside a dropdown — forms, text, images —
 * rather than a list of `<Icon>` children. Animated open/closed with a spring.
 */
export function CustomDropdown({ visible, width = 200, maxHeight = 200, position, children }: CustomDropdownProps) {
	const stylesheet = useStylesheet();
	const theme = stylesheet.customDropdown;
	const animation = stylesheet.animation;

	const [transition, transitionMotion] = useMotion(visible ? 1 : 0);
	const [contentSize, setContentSize] = useBinding(Vector2.zero);
	const frameRef = useRef<ScrollingFrame>();

	React.useEffect(() => {
		transitionMotion.spring(visible ? 1 : 0, {
			tension: animation.dropdownTransitionSpeed * 15,
			friction: 26,
		});
	}, [visible]);

	useMountEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;

		setContentSize(frame.AbsoluteCanvasSize);

		const conn = frame.GetPropertyChangedSignal('AbsoluteCanvasSize').Connect(() => {
			setContentSize(frame.AbsoluteCanvasSize);
		});

		return () => conn.Disconnect();
	});

	const pos = position ?? theme.position;

	return (
		<scrollingframe
			ref={frameRef}
			ClipsDescendants={true}
			Size={mapBinding(transition, (t) =>
				UDim2.fromOffset(
					width,
					t * math.min(contentSize.getValue().Y, maxHeight),
				)
			)}
			BorderSizePixel={theme.borderSize}
			BorderColor3={theme.borderColor}
			BackgroundColor3={theme.backgroundColor}
			BackgroundTransparency={theme.backgroundTransparency}
			Position={pos}
			CanvasSize={UDim2.fromOffset(0, contentSize.getValue().Y)}
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			ScrollBarThickness={5}
			ScrollBarImageColor3={new Color3(1, 1, 1)}
			ScrollBarImageTransparency={0.8}
			ScrollingEnabled={false}
			ZIndex={30}
		>
			<uicorner CornerRadius={theme.cornerRadius} />
			<uistroke
				Color={theme.borderColor}
				Transparency={theme.borderTransparency}
				Thickness={theme.borderSize}
			/>
			{children}
		</scrollingframe>
	);
}
