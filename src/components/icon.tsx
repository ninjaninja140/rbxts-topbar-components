import { deepEquals } from '@rbxts/object-utils';
import { mapBinding, useMotion, useMountEffect, useUnmountEffect, useUpdateEffect } from '@rbxts/pretty-react-hooks';
import React, { useBinding, useEffect, useRef, useState } from '@rbxts/react';
import type { MotionGoal } from '@rbxts/ripple';
import { TextService } from '@rbxts/services';
import { LocationContext, useLocation, useStylesheet } from '../context';
import { useAnimateableProps } from '../hooks/use-animateable-props';
import { useGuiInset } from '../hooks/use-gui-inset';
import { useId } from '../hooks/use-id';
import { useToggleKey } from '../hooks/use-toggle-key';
import { noop, type Stylesheet } from '../style';
import { stateful } from '../utilities/resolve-state-dependent';
import { Notification } from './notification';

/**
 * Properties accepted by {@link Icon}.
 *
 * Most visual props accept a `StateDependent<T>` — either a single value for
 * both states, or `{ deselected: T; selected: T }` to animate between them.
 */
export interface IconProps extends React.PropsWithChildren {
	/** Background transparency of the button. Animated on state change. */
	backgroundTransparency?: StateDependent<number>;
	/** Background color of the button. Animated on state change. */
	backgroundColor?: StateDependent<Color3>;
	/** Asset ID or full asset string for the icon image. */
	imageId?: StateDependent<string>;
	/** Color applied to the icon image. Animated on state change. */
	imageColor?: StateDependent<Color3>;
	/** Color applied to the label text. */
	textColor?: StateDependent<Color3>;
	/** Transparency of the icon image. Animated on state change. */
	imageTransparency?: StateDependent<number>;
	/** Transparency of the label text. Animated on state change. */
	textTransparency?: StateDependent<number>;
	/** Layout order used for horizontal sorting in docks. */
	layoutOrder?: StateDependent<number>;
	/** Text displayed next to or instead of the image. */
	text?: StateDependent<string>;
	/** Font size of the label text. */
	textSize?: StateDependent<number>;
	/** Pixel offset added to the computed image size. Negative values shrink the image. */
	imageSizeOffset?: StateDependent<number>;
	/** Offset into the source image to crop from. */
	imageRectOffset?: StateDependent<Vector2>;
	/** Size of the crop region from the source image. */
	imageRectSize?: StateDependent<Vector2>;
	/** Initial state when the icon first mounts. */
	defaultState?: IconState;
	/** Font face used for the label text. */
	fontFace?: StateDependent<Font>;
	/** Override that locks the icon to a specific state. */
	forcedState?: IconState;
	/** Sound played on left click (asset ID or empty for none). */
	leftClickSound?: StateDependent<string>;
	/** Sound played on right click (asset ID or empty for none). */
	rightClickSound?: StateDependent<string>;
	/** Corner radius of the button. */
	cornerRadius?: StateDependent<UDim>;
	/** Border thickness of the button in pixels. */
	borderSize?: StateDependent<number>;
	/** Border color of the button. */
	borderColor?: StateDependent<Color3>;
	/** Border transparency of the button (1 = fully transparent, 0 = opaque). */
	borderTransparency?: StateDependent<number>;
	/** Stroke transparency of the label text. */
	strokeTransparency?: StateDependent<number>;
	/** Stroke color of the label text. */
	strokeColor?: StateDependent<Color3>;
	/** Stroke thickness of the label text. */
	strokeThickness?: StateDependent<number>;
	/** Horizontal text alignment within the label. */
	textAlignment?: StateDependent<Enum.TextXAlignment>;
	/** Whether the label supports rich text markup. */
	richText?: StateDependent<boolean>;
	/**
	 * When `true`, clicking the icon toggles between selected and deselected.
	 * When `false` (the default), clicking briefly lights the icon up and fires
	 * {@link onClick} once without changing the selection state.
	 */
	toggle?: boolean;
	/** When `true`, the icon ignores all clicks, hover, and state changes. */
	static?: boolean;
	/** When `true`, the icon is dimmed and non-interactive. */
	disabled?: boolean;
	/** Inline overrides for icon props and sizing values. */
	style?: Partial<IconProps & Stylesheet['sizing']>;
	/** Explicit icon width in pixels. When undefined or `0`, auto-fits to content. */
	iconWidth?: number;
	/** Horizontal padding between the button edge and its content. */
	contentPaddingX?: number;
	/** Vertical padding between the button edge and its content. */
	contentPaddingY?: number;
	/** Gap between the image and the text label. */
	imageToTextSpacing?: number;
	/** KeyCode that toggles the icon when pressed. */
	toggleKey?: Enum.KeyCode;
	/** Shows a red notification badge with this count. Hides when `0` or `undefined`. */
	notificationCount?: number;
	/** Callback fired when the icon becomes selected. */
	selected?: () => void;
	/** Callback fired when the icon becomes deselected. */
	deselected?: () => void;
	/** Callback fired on mouse enter. */
	hover?: () => void;
	/** Callback fired on mouse leave. */
	unhover?: () => void;
	/** Callback fired whenever the state changes (receives the new state). */
	stateChanged?: (state: IconState) => void;
	/** Callback fired on left click. */
	onClick?: () => void;
	/** Callback fired on right click. */
	onRightClick?: () => void;
	/** Function used to play click sounds. Receives the sound asset ID. */
	playSound?: (id: string) => void;
	/**
	 * When placed as a direct child of `TopbarProvider`, this controls
	 * which dock the icon is automatically routed to.
	 * Defaults to `"left"`.
	 */
	position?: 'left' | 'right' | 'centre';
}

type ValidKeys = ExtractKeys<Required<IconProps>, StateDependent<MotionGoal>>;

const ANIMATEABLE = [
	'backgroundColor',
	'backgroundTransparency',
	'imageColor',
	'imageTransparency',
	'textColor',
	'textTransparency',
] as const;

const FLASH_DURATION = 0.35;

/** Icon select/deselect state. */
export type IconState = 'selected' | 'deselected';
/**
 * A value that can change with icon state.
 * Pass a single value for both states, or `{ deselected, selected }` for
 * separate values that animate on state transitions.
 */
export type StateDependent<T> = Record<IconState, T> | T;
/** Extracts the inner type from a `StateDependent`. */
export type FromStateDependent<T> = T extends StateDependent<infer U> ? U : T;
/** Unique numeric identifier for an icon instance. */
export type IconId = number;

/**
 * A single icon in the topbar.
 *
 * Supports an image, a text label, state-dependent styling, animated state
 * transitions, hover lift, notification badges, toggle keys, and nested
 * dropdown content.
 */
export function Icon(componentProps: IconProps) {
	const { children, style } = componentProps;
	const inset = useGuiInset();
	const location = useLocation();
	const id = useId();

	const [currentState, setState] = useState<IconState>(componentProps.forcedState ?? 'deselected');

	/** Transiently lights the icon up on a single click when not in toggle mode. */
	const [flash, setFlash] = useState(false);
	const flashTimer = useRef<thread>();

	const [hovered, setHovered] = useState(false);
	const [hoverLift, hoverLiftMotion] = useMotion(0);

	const [dropdownAnimating, setAnimationState] = useState(false);
	const [contentSize, setContentSize] = useState(new Vector2(0, 0));
	const [dropdownSize, setDropdownSize] = useBinding(new Vector2(0, 0));

	const [textBounds, setTextBounds] = useState(Vector2.zero);
	const stylesheet = useStylesheet();

	assert(location.type !== 'icon', 'Icons cannot be nested');

	const sizing = {
		...stylesheet.sizing,
		...((style as Partial<Stylesheet['sizing']> | undefined) ?? {}),
	};

	const animateState: IconState = flash ? 'selected' : currentState;

	const animatedProps = useAnimateableProps(
		animateState,
		{ ...stylesheet.icon, ...componentProps } as Required<Pick<IconProps, ValidKeys>>,
		...ANIMATEABLE
	);

	const props = {
		...stylesheet.icon,
		...(style ?? {}),
		...componentProps,
		...animatedProps,
	};

	useMountEffect(() => {
		if (props.static) return;
		props.defaultState && !componentProps.forcedState && setState(props.defaultState);
	});

	useEffect(() => {
		if (props.static) return;
		if (!componentProps.forcedState) return;
		setState(componentProps.forcedState);
	}, [componentProps.forcedState]);

	useUpdateEffect(() => {
		if (props.static) return;
		props.stateChanged(currentState);
		if (currentState === 'selected') {
			location.iconSelected(id);
			props.selected();
		} else {
			location.iconDeselected(id);
			props.deselected();
		}
	}, [currentState]);

	useUpdateEffect(() => {
		if (props.static) return;
		if (componentProps.forcedState) return;
		if (currentState === 'selected' && !location.selectedIcons.includes(id)) setState('deselected');
	}, [location.selectedIcons]);

	useEffect(() => {
		if (stylesheet.animation.hoverEnabled) {
			hoverLiftMotion.spring(hovered ? 1 : 0, stylesheet.animation.stateSpring);
		}
	}, [hovered, stylesheet.animation.hoverEnabled]);

	if (componentProps.toggleKey && componentProps.toggleKey !== Enum.KeyCode.Unknown) {
		useToggleKey(componentProps.toggleKey, () => {
			if (props.static) return;
			if (props.toggle) setState(currentState === 'deselected' ? 'selected' : 'deselected');
		});
	}

	const currentImage = stateful(props.imageId, currentState);
	const currentText = stateful(props.text, currentState);
	const previousQueryRef = useRef<{ Font: Font; Size: number; Text: string }>();

	useEffect(() => {
		const currentQuery = {
			Font: stateful(props.fontFace, currentState),
			Size: stateful(props.textSize, currentState),
			Text: currentText,
		};
		if (deepEquals(currentQuery, previousQueryRef.current ?? {})) return;
		if (!currentText) return setTextBounds(Vector2.zero);

		const params = new Instance('GetTextBoundsParams');
		params.Text = currentText;
		params.Font = stateful(props.fontFace, currentState);
		params.Size = stateful(props.textSize, currentState);
		params.Width = sizing.textMeasurementWidth;

		const bounds = TextService.GetTextBoundsAsync(params);
		setTextBounds(bounds);
		previousQueryRef.current = currentQuery;
	}, [currentText, props.fontFace, props.textSize, currentState]);

	const imageSizeOff = stateful(props.imageSizeOffset, currentState);
	const forceHeight = location.type === 'dropdown' ? stylesheet.dropdown.forceHeight : undefined;
	const iconHeight = sizing.iconHeight ?? forceHeight ?? inset.Height - sizing.iconVerticalPadding * 2;

	const contentPadX = props.contentPaddingX ?? sizing.contentPaddingX;
	const contentPadY = props.contentPaddingY ?? sizing.contentPaddingY;
	const imageToTextGap = props.imageToTextSpacing ?? sizing.imageToTextSpacing;

	const imageSize = iconHeight - contentPadY * 2 + imageSizeOff;

	const contentWidth =
		(currentImage ? imageSize : 0) +
		(currentImage && currentText ? imageToTextGap : 0) +
		(currentText ? textBounds.X : 0);
	const autoWidth = contentWidth + contentPadX * 2;
	const iconWidth = props.iconWidth || sizing.iconWidth || math.max(iconHeight, autoWidth);

	const iconSize = new Vector2(iconWidth, iconHeight);

	useEffect(() => {
		if (props.static) return;
		if (location.type !== 'dropdown') return;
		const includeContents = currentState === 'selected' || dropdownAnimating;
		location.registerChild(
			id,
			new Vector2(iconSize.X, iconSize.Y).add(new Vector2(0, includeContents ? contentSize.Y : 0))
		);
	}, [currentState, contentSize.Y, dropdownAnimating, iconSize]);

	useUnmountEffect(() => {
		if (flashTimer.current) task.cancel(flashTimer.current);
	});

	useUnmountEffect(() => {
		if (props.static) return;
		if (location.type !== 'dropdown') return;
		location.removeChild(id);
	});

	const wrapSize = mapBinding(dropdownSize, (t) =>
		UDim2.fromOffset(location.type === 'dropdown' ? location.desiredIconWidth : iconSize.X, iconSize.Y + t.Y)
	);

	return (
		<LocationContext.Provider
			value={{
				type: 'icon',
				isVisible: currentState === 'selected',
				isUnderDropdown: location.type === 'dropdown',
				width: location.type === 'dropdown' ? location.desiredIconWidth : iconSize.X,
				setDropdownSize,
				setContentSize,
				setAnimationState,
			}}
		>
			<frame
				Size={wrapSize}
				LayoutOrder={stateful(props.layoutOrder, currentState)}
				Position={mapBinding(hoverLift, (t) => new UDim2(0, 0, 0, -t * stylesheet.animation.hoverLift))}
				BackgroundTransparency={1}
			>
				<textbutton
					Size={new UDim2(1, 0, 0, iconSize.Y)}
					Active={!props.static}
					Selectable={!props.static}
					AutoButtonColor={!props.static}
					Text={''}
					BorderSizePixel={0}
					BackgroundTransparency={animatedProps.backgroundTransparency as never}
					BackgroundColor3={animatedProps.backgroundColor as never}
					Event={{
						MouseButton1Click: () => {
							if (props.static) return;

							if (props.toggle) {
								setState(currentState === 'deselected' ? 'selected' : 'deselected');
							} else {
								if (flashTimer.current) task.cancel(flashTimer.current);
								setFlash(true);
								flashTimer.current = task.delay(FLASH_DURATION, () => {
									flashTimer.current = undefined;
									setFlash(false);
								});
							}

							props.onClick();

							const soundId = stateful(props.leftClickSound, currentState);
							if (!soundId) return;
							props.playSound(soundId);
						},
						MouseButton2Click: () => {
							if (props.static) return;
							if (props.onRightClick === noop) return;
							props.onRightClick();

							const soundId = stateful(props.rightClickSound, currentState);
							if (!soundId) return;
							props.playSound(soundId);
						},
						MouseEnter: () => {
							if (props.static) return;
							setHovered(true);
							props.hover();
						},
						MouseLeave: () => {
							if (props.static) return;
							setHovered(false);
							props.unhover();
						},
					}}
				>
					<uipadding
						PaddingLeft={new UDim(0, contentPadX)}
						PaddingRight={new UDim(0, contentPadX)}
						PaddingTop={new UDim(0, contentPadY)}
						PaddingBottom={new UDim(0, contentPadY)}
					/>
					<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							Padding={new UDim(0, imageToTextGap)}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						{currentImage !== undefined && currentImage !== '' && (
							<imagelabel
								Size={UDim2.fromOffset(imageSize, imageSize)}
								Image={currentImage}
								BackgroundTransparency={1}
								ImageColor3={animatedProps.imageColor as never}
								ImageTransparency={animatedProps.imageTransparency as never}
								ImageRectOffset={stateful(props.imageRectOffset, currentState)}
								ImageRectSize={stateful(props.imageRectSize, currentState)}
							/>
						)}
						{currentText !== undefined && currentText !== '' && (
							<textlabel
								FontFace={stateful(props.fontFace, currentState)}
								TextSize={stateful(props.textSize, currentState)}
								TextColor3={animatedProps.textColor as never}
								TextWrapped={false}
								Size={UDim2.fromOffset(textBounds.X, 0)}
								AutomaticSize={Enum.AutomaticSize.Y}
								TextXAlignment={stateful(props.textAlignment, currentState)}
								RichText={stateful(props.richText, currentState)}
								BackgroundTransparency={1}
								TextTransparency={animatedProps.textTransparency as never}
								Text={currentText}
							>
								<uistroke
									Thickness={stateful(props.strokeThickness, currentState)}
									Color={stateful(props.strokeColor, currentState)}
									Transparency={stateful(props.strokeTransparency, currentState)}
								/>
							</textlabel>
						)}
					</frame>
					{children}
					<uicorner
						CornerRadius={
							location.type === 'dropdown'
								? stylesheet.dropdown.iconCornerRadius
								: stateful(props.cornerRadius, currentState)
						}
					/>
					<uistroke
						Thickness={stateful(props.borderSize, currentState)}
						Color={stateful(props.borderColor, currentState)}
						Transparency={stateful(props.borderTransparency, currentState)}
					/>
					{props.disabled && (
						<frame
							Size={UDim2.fromScale(1, 1)}
							BackgroundTransparency={sizing.disabledOverlayTransparency}
							BackgroundColor3={sizing.disabledOverlayColor}
							BorderSizePixel={0}
							ZIndex={10}
						/>
					)}
				</textbutton>
				{componentProps.notificationCount !== undefined && (
					<Notification count={componentProps.notificationCount} />
				)}
			</frame>
		</LocationContext.Provider>
	);
}
