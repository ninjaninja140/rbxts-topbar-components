import React, { useEffect, useMemo, useRef, useState } from '@rbxts/react';
import { LocationContext, useStylesheet } from '../context';
import { useGuiInset } from '../hooks/use-gui-inset';
import { useVoicechatEnabled } from '../hooks/use-voicechat-enabled';
import { debugLog } from '../utilities/debug';
import type { IconId } from './icon';
import { Overflow } from './overflow';

export type SelectionMode = 'Single' | 'Multiple';

type DockPosition = 'left' | 'centre' | 'right';

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
	frameRef?: React.Ref<Frame>;
}) {
	const stylesheet = useStylesheet().provider;
	return (
		<frame
			ref={props.frameRef}
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
function LeftDock({ children, frameRef }: React.PropsWithChildren & { frameRef?: React.Ref<Frame> }) {
	return (
		<DockFrame
			frameRef={frameRef}
			anchor={new Vector2(0, 0.5)}
			position={new UDim2(0, 0, 0.5, 0)}
			children={children}
		/>
	);
}

/** Docks icons to the center of the topbar. */
function CenterDock({
	children,
	frameRef,
	centreOffset = 0,
}: React.PropsWithChildren & { frameRef?: React.Ref<Frame>; centreOffset?: number }) {
	const stylesheet = useStylesheet().provider;
	return (
		<DockFrame
			frameRef={frameRef}
			anchor={new Vector2(0.5, 0.5)}
			position={new UDim2(0.5, centreOffset, 0.5, 0)}
			paddingLeft={new UDim(0, stylesheet.iconGroupSpacing)}
			paddingRight={new UDim(0, stylesheet.iconGroupSpacing)}
			children={children}
		/>
	);
}

/** Docks icons to the right side of the topbar. */
function RightDock({ children, frameRef }: React.PropsWithChildren & { frameRef?: React.Ref<Frame> }) {
	const stylesheet = useStylesheet().provider;
	return (
		<DockFrame
			frameRef={frameRef}
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
	/**
	 * Maximum number of icons shown per dock before overflow kicks in.
	 * When set, icons beyond this limit are moved into an overflow dropdown.
	 * When `undefined`, auto-detects overflow by measuring dock sizes to
	 * prevent icons from different docks overlapping each other.
	 */
	overflowAmount?: number;
}

/**
 * Root provider for the topbar system.
 *
 * Must wrap all topbar components. Manages global selection state,
 * gui inset tracking, and the topbar frame bounds.
 *
 * Icons with a `position` prop placed as direct children are
 * automatically routed into the left, centre, or right dock.
 * Icons without a `position` prop are rendered as-is.
 */
export function TopbarProvider({
	selectionMode = 'Single',
	gameVoiceChatEnabled,
	overflowAmount,
	children,
}: ProviderProps) {
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const inset = useGuiInset();
	const voiceChatEnabled = useVoicechatEnabled();
	const stylesheet = useStylesheet().provider;

	/**
	 * Pixel offset that shifts the centre dock right to visually account for
	 * Roblox's default left-side CoreGui icons (menu button, chips bar, etc.).
	 *
	 * Mirrors TopbarPlus's startInset logic:
	 * - New topbar (height > 36): no offset — icons are mathematically centered
	 * - Old topbar (height ≤ 36): 12px offset to account for the classic menu button
	 *
	 * Set `centreOffset` explicitly in the stylesheet to override.
	 */
	const centreOffset = useMemo(() => {
		if (stylesheet.centreOffset !== undefined) return stylesheet.centreOffset;
		const isOldTopbar = inset.Height <= 36;
		return isOldTopbar ? 12 : 0;
	}, [stylesheet.centreOffset, inset.Height]);

	const containerRef = useRef<Frame>();
	const leftDockRef = useRef<Frame>();
	const centerDockRef = useRef<Frame>();
	const rightDockRef = useRef<Frame>();

	const [autoOverflow, setAutoOverflow] = useState<Record<DockPosition, number>>({
		left: 0,
		centre: 0,
		right: 0,
	});

	/** Sort direct children into docks based on the `position` prop. Defaults to left. */
	const sorted = useMemo(() => {
		const groups: Record<DockPosition, React.ReactElement[]> = { left: [], centre: [], right: [] };
		const other: React.ReactElement[] = [];

		for (const child of React.Children.toArray(children)) {
			if (!React.isValidElement(child)) continue;
			const pos = ((child.props as Record<string, unknown>).position ?? 'left') as DockPosition;
			if (groups[pos] !== undefined) groups[pos].push(child);
			else other.push(child);
		}

		return { groups, other };
	}, [children]);

	// get overflow count for a dock
	const getOverflowCount = (dock: DockPosition, total: number): number => {
		if (overflowAmount !== undefined) return math.max(0, total - overflowAmount);
		return autoOverflow[dock];
	};

	// auto-detect overflow when overflowAmount is not set
	useEffect(() => {
		if (overflowAmount !== undefined) return;

		const container = containerRef.current;
		if (!container) return;

		const check = () => {
			const leftFrame = leftDockRef.current;
			const centerFrame = centerDockRef.current;
			const rightFrame = rightDockRef.current;

			if (!leftFrame || !centerFrame || !rightFrame) return;

			const containerWidth = container.AbsoluteSize.X;
			const groupSpacing = stylesheet.iconGroupSpacing;

			// AbsolutePosition is the frame's top-left corner (after the anchor
			// point is applied), so the dock edges are:
			// - left dock:  [X, X + W]
			// - centre dock: [X, X + W] (X is already centreX - W/2)
			// - right dock: [X, X + W] (X is already W - padding - W)
			const leftRightEdge = leftFrame.AbsolutePosition.X + leftFrame.AbsoluteSize.X;
			const centerLeftEdge = centerFrame.AbsolutePosition.X;
			const centerRightEdge = centerFrame.AbsolutePosition.X + centerFrame.AbsoluteSize.X;
			const rightLeftEdge = rightFrame.AbsolutePosition.X;

			const overlapThreshold = groupSpacing + 10; // some padding

			let leftOverflow = 0;
			let centreOverflow = 0;
			let rightOverflow = 0;

			if (leftRightEdge + overlapThreshold > centerLeftEdge) {
				const overflowPixels = leftRightEdge + overlapThreshold - centerLeftEdge;
				const iconEstimate = 52;
				leftOverflow = math.max(1, math.ceil(overflowPixels / iconEstimate));
			}

			if (centerRightEdge + overlapThreshold > rightLeftEdge) {
				const overflowPixels = centerRightEdge + overlapThreshold - rightLeftEdge;
				const iconEstimate = 52;
				const totalOverflow = math.max(1, math.ceil(overflowPixels / iconEstimate));

				// Only place a "more" button in a dock that actually has icons.
				// Splitting unconditionally gives an empty centre dock a phantom
				// ⋯ button, which widens the centre dock, shifts its position,
				// and re-triggers this measurement — the feedback loop that makes
				// the topbar flap. Empty dock → push all overflow to the other.
				const centreCount = sorted.groups.centre.size();
				const rightCount = sorted.groups.right.size();

				if (centreCount > 0 && rightCount > 0) {
					centreOverflow = math.ceil(totalOverflow / 2);
					rightOverflow = totalOverflow - centreOverflow;
				} else if (rightCount > 0) {
					rightOverflow = totalOverflow;
				} else if (centreCount > 0) {
					centreOverflow = totalOverflow;
				}
			}

			if (leftRightEdge > containerWidth - 10) {
				const overflowPixels = leftRightEdge - containerWidth + 10;
				leftOverflow = math.max(leftOverflow, math.ceil(overflowPixels / 52));
			}

			if (rightFrame.AbsolutePosition.X < 10) rightOverflow = math.max(rightOverflow, 1);

			setAutoOverflow((prev) => {
				if (prev.left === leftOverflow && prev.centre === centreOverflow && prev.right === rightOverflow)
					return prev;
				return { left: leftOverflow, centre: centreOverflow, right: rightOverflow };
			});
		};

		// Defer measurement to let layout complete
		task.spawn(() => check());

		const connections: RBXScriptConnection[] = [];
		for (const frame of [leftDockRef.current, centerDockRef.current, rightDockRef.current])
			if (frame)
				connections.push(
					frame.GetPropertyChangedSignal('AbsoluteSize').Connect(() => task.spawn(() => check())),
					frame.GetPropertyChangedSignal('AbsolutePosition').Connect(() => task.spawn(() => check()))
				);

		return () =>
			connections.forEach((c) => {
				c.Disconnect();
			});
	}, [sorted, overflowAmount, stylesheet.iconGroupSpacing]);

	// build dock content with optional overflow
	const buildDockContent = (icons: React.ReactElement[], dock: DockPosition): React.ReactNode => {
		const total = icons.size();
		const overflowCount = getOverflowCount(dock, total);

		if (overflowCount <= 0) return icons;

		const visibleCount = total - overflowCount;
		const visible: React.ReactElement[] = [];
		const overflowed: React.ReactElement[] = [];
		for (const i of $range(1, total)) {
			if (i <= visibleCount) visible.push(icons[i - 1]);
			else overflowed.push(icons[i - 1]);
		}

		return (
			<React.Fragment>
				{visible}
				<Overflow>{overflowed}</Overflow>
			</React.Fragment>
		);
	};

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
				ref={containerRef}
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
				<LeftDock frameRef={leftDockRef}>{buildDockContent(sorted.groups.left, 'left')}</LeftDock>
				<CenterDock frameRef={centerDockRef} centreOffset={centreOffset}>
					{buildDockContent(sorted.groups.centre, 'centre')}
				</CenterDock>
				<RightDock frameRef={rightDockRef}>{buildDockContent(sorted.groups.right, 'right')}</RightDock>
				{sorted.other}
			</frame>
		</LocationContext.Provider>
	);
}
