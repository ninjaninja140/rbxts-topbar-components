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

/** Complete theme configuration consumed by all topbar components. */
export interface Stylesheet {
	/** Default values for every {@link Icon} prop. */
	icon: Required<Omit<IconProps, 'style'>>;
	/** Default values for every {@link Dropdown} prop. */
	dropdown: Required<DropdownProps>;

	/** Topbar container layout settings. */
	provider: {
		/** Left padding of the topbar frame. */
		paddingLeft: number;
		/** Right padding of the topbar frame. */
		paddingRight: number;
		/** Top padding of the topbar frame. */
		paddingTop: number;
		/** Bottom padding of the topbar frame. */
		paddingBottom: number;
		/** Horizontal gap between adjacent icons. */
		iconSpacing: number;
		/** Background transparency of the topbar frame. */
		backgroundTransparency: number;
		/** Background color of the topbar frame. */
		backgroundColor: Color3;
		/** Anchor point of the topbar frame. */
		anchorPoint: Vector2;
		/** Position of the topbar frame. */
		position: UDim2;
		/** Multiplier applied to the topbar frame size. */
		sizeScale: Vector2;
		/** Pixels subtracted from the gui inset height. */
		insetHeightOffset: number;
		/** Extra horizontal gap between left/center and right/center icon groups. */
		iconGroupSpacing: number;
		/** Override for the topbar frame height. Uses inset height when `undefined`. */
		forceFrameHeight: number | undefined;
		/**
		 * Pixel offset that shifts the centre dock to the right to visually
		 * account for Roblox's default left-side CoreGui icons (menu button,
		 * chips bar, etc.). Auto-detected from the topbar type when `undefined`.
		 */
		centreOffset: number | undefined;
	};

	/** Sizing and spacing values shared by all icons. */
	sizing: {
		/** Fixed icon height. Uses the inset height when `undefined`. */
		iconHeight: number | undefined;
		/** Fixed icon width. Auto-fits to content when `undefined` or `0`. */
		iconWidth: number | undefined;
		/** Padding around the image inside the icon button. */
		imagePadding: number;
		/** Padding around the label inside the icon button. */
		labelPadding: number;
		/** Gap between the icon image and its text label. */
		imageToTextSpacing: number;
		/** Horizontal padding applied to icons. */
		iconHorizontalPadding: number;
		/** Vertical padding applied to icons. */
		iconVerticalPadding: number;
		/** Horizontal outer padding from button edge to content. */
		contentPaddingX: number;
		/** Vertical outer padding from button edge to content. */
		contentPaddingY: number;
		/** Width used when measuring text bounds. */
		textMeasurementWidth: number;
		/** Minimum label width padding when inside a dropdown. */
		minLabelWidthPadding: number;
		/** Fraction of icon height used for the label's vertical size. */
		buttonLabelHeightFraction: number;
		/** Transparency of the overlay shown on disabled icons. */
		disabledOverlayTransparency: number;
		/** Color of the overlay shown on disabled icons. */
		disabledOverlayColor: Color3;
	};

	/** Appearance of the {@link Dropdown} panel. */
	dropdownTheme: {
		/** Background color of the dropdown. */
		backgroundColor: Color3;
		/** Background transparency of the dropdown. */
		backgroundTransparency: number;
		/** Corner radius of the dropdown. */
		cornerRadius: UDim;
		/** Thickness of the dropdown border. */
		borderSize: number;
		/** Color of the dropdown border. */
		borderColor: Color3;
		/** Transparency of the dropdown border. */
		borderTransparency: number;
		/** Position of the dropdown relative to its parent icon. */
		position: UDim2;
	};

	/** Animation configuration. */
	animation: {
		/** Speed of the dropdown open/close spring. Higher = faster. */
		dropdownTransitionSpeed: number;
		/** Spring options used for icon state transitions and hover lift. */
		stateSpring: SpringOptions;
		/** Whether icons lift on hover. Set to `false` to disable globally. */
		hoverEnabled: boolean;
		/** How many pixels icons lift upward on hover. */
		hoverLift: number;
	};

	/** Appearance of the notification badge. */
	notification: {
		/** Background color of the badge. */
		backgroundColor: Color3;
		/** Background transparency of the badge. */
		backgroundTransparency: number;
		/** Text color inside the badge. */
		textColor: Color3;
		/** Font size of the badge text. */
		textSize: number;
		/** Font face of the badge text. */
		fontFace: Font;
		/** Position of the badge relative to the icon. */
		position: UDim2;
		/** Size of the badge. */
		size: UDim2;
		/** Corner radius of the badge. */
		cornerRadius: UDim;
		/** Border color of the badge. */
		borderColor: Color3;
		/** Border transparency of the badge. */
		borderTransparency: number;
	};

	/** Appearance of the {@link Tooltip} component. */
	tooltip: {
		/** Background color of the tooltip. */
		backgroundColor: Color3;
		/** Background transparency of the tooltip. */
		backgroundTransparency: number;
		/** Text color inside the tooltip. */
		textColor: Color3;
		/** Font size of the tooltip text. */
		textSize: number;
		/** Font face of the tooltip text. */
		fontFace: Font;
		/** Corner radius of the tooltip. */
		cornerRadius: UDim;
		/** Border color of the tooltip. */
		borderColor: Color3;
		/** Border transparency of the tooltip. */
		borderTransparency: number;
		/** Border thickness of the tooltip. */
		borderSize: number;
		/** Horizontal padding inside the tooltip. */
		paddingX: number;
		/** Vertical padding inside the tooltip. */
		paddingY: number;
		/** Delay in milliseconds before the tooltip appears. */
		delayMs: number;
	};

	/** Appearance of the {@link CustomDropdown} component. */
	customDropdown: {
		/** Background color of the custom dropdown. */
		backgroundColor: Color3;
		/** Background transparency of the custom dropdown. */
		backgroundTransparency: number;
		/** Corner radius of the custom dropdown. */
		cornerRadius: UDim;
		/** Thickness of the custom dropdown border. */
		borderSize: number;
		/** Color of the custom dropdown border. */
		borderColor: Color3;
		/** Transparency of the custom dropdown border. */
		borderTransparency: number;
		/** Position of the custom dropdown relative to its parent. */
		position: UDim2;
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
		textTransparency: 0,
		layoutOrder: 0,
		text: '',
		defaultState: 'deselected',
		forcedState: 'deselected',
		toggle: false,
		static: false,
		disabled: false,
		toggleKey: Enum.KeyCode.None,
		notificationCount: 0,
		iconWidth: 0,
		contentPaddingX: 10,
		contentPaddingY: 2,
		imageToTextSpacing: 6,
		selected: noop,
		deselected: noop,
		stateChanged: noop,
		onClick: noop,
		onRightClick: noop,
		hover: noop,
		unhover: noop,
		children: [],
		position: 'left',
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
		paddingTop: 12,
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
		centreOffset: -80, // auto-detected when undefined
	},
	sizing: {
		iconHeight: undefined,
		iconWidth: undefined,
		imagePadding: 6,
		labelPadding: 6,
		imageToTextSpacing: 6,
		iconHorizontalPadding: 6,
		iconVerticalPadding: 6,
		contentPaddingX: 10,
		contentPaddingY: 2,
		textMeasurementWidth: 99999,
		minLabelWidthPadding: 12,
		buttonLabelHeightFraction: 0.8,
		disabledOverlayTransparency: 0.55,
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
		hoverEnabled: true,
		hoverLift: 2,
	},

	notification: {
		backgroundColor: new Color3(1, 1, 1),
		backgroundTransparency: 0,
		textColor: Color3.fromRGB(57, 60, 65),
		textSize: 12,
		fontFace: new Font('rbxasset://fonts/families/GothamSSm.json', Enum.FontWeight.Bold, Enum.FontStyle.Normal),
		position: new UDim2(1, 17 / 4, 0, -(17 / 4)),
		size: new UDim2(0, 17, 0, 17),
		cornerRadius: new UDim(1, 0),
		borderColor: new Color3(1, 1, 1),
		borderTransparency: 0.5,
	},

	tooltip: {
		backgroundColor: new Color3(0.12, 0.12, 0.14),
		backgroundTransparency: 0.08,
		textColor: new Color3(1, 1, 1),
		textSize: 12,
		fontFace: new Font('rbxasset://fonts/families/GothamSSm.json', Enum.FontWeight.Medium, Enum.FontStyle.Normal),
		cornerRadius: new UDim(0, 6),
		borderColor: new Color3(1, 1, 1),
		borderTransparency: 0.72,
		borderSize: 1,
		paddingX: 8,
		paddingY: 6,
		delayMs: 200,
	},

	customDropdown: {
		backgroundColor: new Color3(0.12, 0.12, 0.14),
		backgroundTransparency: 0.08,
		cornerRadius: new UDim(0, 6),
		borderSize: 1,
		borderColor: new Color3(1, 1, 1),
		borderTransparency: 0.72,
		position: UDim2.fromScale(0, 1),
	},
};
