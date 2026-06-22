import type { SpringOptions } from '@rbxts/ripple';
import { SoundService } from '@rbxts/services';
import type { DropdownProps } from './components/dropdown';
import type { IconProps } from './components/icon';

function defaultPlaySound(id: string) {
	const sound = new Instance('Sound');
	sound.SoundId = id;
	sound.Parent = SoundService;

	sound.Play();
	sound.Ended.Once(() => sound.Destroy());
}

export function noop() {}

export interface Stylesheet {
	icon: Required<IconProps>;
	dropdown: Required<DropdownProps>;

	/**
	 * Configure the top-level provider frame: padding, spacing, background, sizing.
	 */
	provider: {
		paddingLeft: number;
		paddingRight: number;
		paddingTop: number;
		paddingBottom: number;
		iconSpacing: number;
		backgroundTransparency: number;
		backgroundColor: Color3;
		anchorPoint: Vector2;
		position: UDim2;
		sizeScale: Vector2;
		/** Offset subtracted from the gui inset height */
		insetHeightOffset: number;
		/** Extra gap between left, center, and right icon groups (default 0) */
		iconGroupSpacing: number;
		/**
		 * Explicit override for the provider frame Y size (in pixels).
		 * When set, this replaces the automatic `(inset.Height - insetHeightOffset) * sizeScale.Y` calculation.
		 */
		forceFrameHeight: number | undefined;
	};

	/**
	 * Fine-grained sizing & layout overrides for icon internals.
	 */
	sizing: {
		/**
		 * Explicit icon height override.
		 * When defined, this replaces the automatic `forceHeight ?? inset.Height - 12` calculation.
		 */
		iconHeight: number | undefined;
		/** Padding between the icon edge and the image (default 6) */
		imagePadding: number;
		/** Padding between the icon edge and the text label (default 6) */
		labelPadding: number;
		/** Gap between the image and the text label (default 6) */
		imageToTextSpacing: number;
		/** Max width passed to GetTextBoundsParams (default 99999) */
		textMeasurementWidth: number;
		/** Extra padding subtracted from the min label width inside a dropdown (default 12) */
		minLabelWidthPadding: number;
		/** Fraction of icon height used for the text button label size (default 0.8) */
		buttonLabelHeightFraction: number;
		/** Transparency of the dimming overlay when an icon is disabled (0 = fully visible, 1 = fully hidden) */
		disabledOverlayTransparency: number;
		/** Color of the dimming overlay when an icon is disabled */
		disabledOverlayColor: Color3;
	};

	/**
	 * Visual theming for the dropdown surface (background, border, position).
	 */
	dropdownTheme: {
		backgroundColor: Color3;
		backgroundTransparency: number;
		cornerRadius: UDim;
		borderSize: number;
		borderColor: Color3;
		borderTransparency: number;
		/** Position of the dropdown relative to its parent icon (default (0, 1)) */
		position: UDim2;
	};

	/**
	 * Global animation configuration.
	 */
	animation: {
		/** Speed value used by the dropdown transition motion (default 10) */
		dropdownTransitionSpeed: number;
		/** Spring options for icon state transitions (color, transparency, etc.) */
		stateSpring: SpringOptions;
	};
}

export const DefaultStylesheet: Stylesheet = {
	icon: {
		fontFace: new Font('rbxasset://fonts/families/GothamSSm.json', Enum.FontWeight.Medium, Enum.FontStyle.Normal),
		strokeColor: Color3.fromRGB(0, 0, 0),
		strokeThickness: 0,
		strokeTransparency: 0,
		textAlignment: Enum.TextXAlignment.Left,
		cornerRadius: new UDim(1, 0),
		textColor: {
			deselected: Color3.fromRGB(255, 255, 255),
			selected: Color3.fromRGB(57, 60, 65),
		},
		backgroundColor: {
			deselected: Color3.fromRGB(0, 0, 0),
			selected: Color3.fromRGB(245, 245, 245),
		},
		backgroundTransparency: 0.3,
		imageColor: {
			deselected: Color3.fromRGB(255, 255, 255),
			selected: Color3.fromRGB(57, 60, 65),
		},
		richText: false,
		textSize: 20,
		imageSizeOffset: -4,
		imageRectOffset: Vector2.zero,
		imageRectSize: Vector2.zero,
		leftClickSound: '',
		rightClickSound: '',
		playSound: defaultPlaySound,
		imageId: '',
		imageTransparency: 0,
		layoutOrder: 0,
		text: '',
		defaultState: 'deselected',
		forcedState: 'deselected',
		toggleStateOnClick: true,
		static: false,
		disabled: false,
		selected: noop,
		deselected: noop,
		stateChanged: noop,
		onClick: noop,
		onRightClick: noop,
		hover: noop,
		unhover: noop,
		children: [],
	},
	dropdown: {
		maxWidth: 300,
		minWidth: 200,
		maxHeight: 200,
		padding: new UDim(0, 2.5),
		forceHeight: 32,
		iconCornerRadius: new UDim(0, 0),
		selectionMode: 'Multiple',
		children: [],
		scrollBarThickness: 5,
		scrollBarTransparency: 0,
		scrollBarImageColor: new Color3(1, 1, 1),
		midImage: 'rbxasset://textures/ui/Scroll/scroll-middle.png',
		topImage: 'rbxasset://textures/ui/Scroll/scroll-top.png',
		bottomImage: 'rbxasset://textures/ui/Scroll/scroll-bottom.png',
	},
	provider: {
		paddingLeft: 8,
		paddingRight: 12,
		paddingTop: 11,
		paddingBottom: 0,
		iconSpacing: 12,
		backgroundTransparency: 1,
		backgroundColor: new Color3(0, 0, 0),
		anchorPoint: new Vector2(1, 0),
		position: UDim2.fromScale(1, 0),
		sizeScale: new Vector2(1, 1),
		insetHeightOffset: 0,
		iconGroupSpacing: 0,
		forceFrameHeight: undefined,
	},
	sizing: {
		iconHeight: undefined,
		imagePadding: 6,
		labelPadding: 6,
		imageToTextSpacing: 6,
		textMeasurementWidth: 99999,
		minLabelWidthPadding: 12,
		buttonLabelHeightFraction: 0.8,
		/** Transparency of the dimming overlay when an icon is disabled (0 = fully visible, 1 = fully hidden) */
		disabledOverlayTransparency: 0.55,
		/** Color of the dimming overlay when an icon is disabled */
		disabledOverlayColor: new Color3(0, 0, 0),
	},
	dropdownTheme: {
		backgroundColor: new Color3(1, 1, 1),
		backgroundTransparency: 0,
		cornerRadius: new UDim(0, 0),
		borderSize: 0,
		borderColor: new Color3(0, 0, 0),
		borderTransparency: 1,
		position: UDim2.fromScale(0, 1),
	},
	animation: {
		dropdownTransitionSpeed: 10,
		stateSpring: { tension: 400 },
	},
};
