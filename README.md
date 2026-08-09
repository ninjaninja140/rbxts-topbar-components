<div align="center" id="top">
    <img src="https://github.com/nn140/Branding/blob/main/LogoWhite-Full.png?raw=true" alt="NN140.UK logo" width="800"/>
    <img src="https://github.com/nn140/Branding/blob/main/LogoBlack-Full.png?raw=true" alt="NN140.UK logo" width="800"/>
    <br />
    <br />
    <img src="https://img.shields.io/badge/Stripe-Donate%20to%20support%20NN140.UK-1b1b1b?style=for-the-badge&labelColor=6860ff&logo=stripe&logoColor=ffffff&logoSize=auto&link=https%3A%2F%2Fdonate.stripe.com%2F9B6eVdbTd4n1a6H1yXa3u04&link=https%3A%2F%2Fdonate.stripe.com%2F9B6eVdbTd4n1a6H1yXa3u04" alt="Badge">
    <img src="https://img.shields.io/badge/Stripe-Donate%20to%20Support%20NN140.UK%20(RECCURING)-1b1b1b?style=for-the-badge&labelColor=6860ff&logo=stripe&logoColor=ffffff&logoSize=auto&link=https%3A%2F%2Fdonate.stripe.com%2FdRm9ATe1laLpgv5b9xa3u05&link=https%3A%2F%2Fdonate.stripe.com%2FdRm9ATe1laLpgv5b9xa3u05" alt="Badge">
</div>

<hr />

## @nrbx/topbar-components

- A Fork of @rbxts/topbar-components

**Topbar Components** is a react component package that mimics [*topbar-plus*](https://devforum.roblox.com/t/v3-topbarplus-v300-construct-intuitive-topbar-icons-customise-them-with-themes-dropdowns-captions-labels-and-much-more/1017485) for [Roblox-TS](https://roblox-ts.com), with JSX markup support.

## Installation

**@nrbx/topbar-components** is available on NPM and can be installed with the following commands:

```bash
npm install @nrbx/topbar-components
yarn add @nrbx/topbar-components
pnpm add @nrbx/topbar-components
```

Then add the following to your Rojo project file, under your `node_modules` configuration.

```json
"node_modules": {
  "$className": "Folder",
  "@rbxts": {
    "$path": "node_modules/@rbxts"
  },
  "@nrbx": {
    "$path": "node_modules/@nrbx"
  }
}
```

And this to your `tsconfig.json`

```json
"typeRoots": ["node_modules/@rbxts", "node_modules/@nrbx"],
```

### Quick Start

Instantiate `<TopbarProvider />` to be a root of your topbar component tree.

```tsx
<TopbarProvider>
    <Icon text="Hello, World!" />
</TopbarProvider>
```

Icons without a `position` prop default to the **left** dock.

#### Positioning icons with the `position` prop

Use the `position` prop on `<Icon>` components to automatically route them into the left, centre, or right dock:

```tsx
<TopbarProvider>
    <Icon position="left" text="Home" />
    <Icon position="left" text="Settings" />
    <Icon position="centre" text="Server Time" static />
    <Icon position="right" text="Profile" imageId="rbxassetid://..." />
</TopbarProvider>
```

All three docks render automatically — no manual dock wrappers needed.

| Position | Behaviour |
|---|---|
| `"left"` (default) | Icons flow left-to-right from the left edge |
| `"centre"` | Centers icons in the bar |
| `"right"` | Right-aligns icons |

Dock containers (`<LeftDock>`, `<CenterDock>`, `<RightDock>`) are still available for advanced layouts requiring nested structure.

#### Icon props: `static` and `disabled`

- **`static`** - turns the icon into a non-interactive label (no clicks, no hovers, no state toggling, no sounds)
- **`disabled`** - dims the icon with a configurable semi-transparent overlay

```tsx
<Icon text="Read Only" static />       {/* label, not clickable */}
<Icon text="Locked" disabled />         {/* dimmed */}
<Icon text="Both" static disabled />    {/* dimmed label */}
```

The disabled overlay transparency and color are configurable via the stylesheet `sizing` section.

#### Dropdowns

You can add a dropdown to an icon by mounting `<Dropdown />` component as it's child.
Dropdowns & TopbarProvider have a property called `selectionMode`, which lets you specify how many icons can be selected at once.

```tsx
<Icon text="Skins">
    <Dropdown selectionMode="Single">
        <Icon text="yellow" selected={() => chooseSkin("yellow")} />
        <Icon text="red" selected={() => chooseSkin("red")} />
    </Dropdown>
</Icon>
```

Dropdowns **can be nested.**

#### Hover animations

Icons can lift upward on hover for a subtle interactive feel. Enable or disable it globally via the stylesheet:

```tsx
<Stylesheet stylesheet={{
    animation: {
        hoverEnabled: true,   // turn hover lift on/off
        hoverLift: 4,         // pixels to lift
    },
}}>
    <TopbarProvider>
        <Icon text="Hover Me" />
    </TopbarProvider>
</Stylesheet>
```

Hover lift uses the same spring configuration as state transitions (`animation.stateSpring`).

#### Notification badges

Add a red notification badge to any icon with the `notificationCount` prop. Counts over 99 display as `99+`. The badge hides automatically when the count is 0.

```tsx
<Icon text="Inbox" notificationCount={3} />
<Icon text="Mail" notificationCount={150} />   {/* shows "99+" */}
<Icon text="Clear" notificationCount={0} />     {/* badge hidden */}
```

Badge styling (colors, position, corner radius, border) is controlled via `stylesheet.notification`.

#### Toggle keys

Bind a keyboard key to toggle an icon on/off with the `toggleKey` prop:

```tsx
<Icon text="Menu" toggleKey={Enum.KeyCode.M} toggleStateOnClick />
```

Any `Enum.KeyCode` value works. The key binding only activates while the icon is mounted.

#### Tooltips

Wrap any element in a `<Tooltip>` to show a hover tooltip after a configurable delay:

```tsx
<Tooltip content="Go home" side="bottom" delayMs={500}>
    <Icon imageId="rbxassetid://..." />
</Tooltip>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | required | Text displayed inside the tooltip |
| `side` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Which side of the child to appear on |
| `delayMs` | `number` | stylesheet value | Milliseconds before the tooltip appears |

Tooltip appearance (colors, font, padding, border) is controlled via `stylesheet.tooltip`.

#### Custom Dropdowns

Use `<CustomDropdown>` when you need to show rich, arbitrary content in a dropdown panel - not just child `<Icon>` elements:

```tsx
<Icon text="Info" toggleStateOnClick>
    <CustomDropdown width={250} maxHeight={180}>
        <textlabel Text="Custom content here!" />
        <textbutton Text="A button" />
    </CustomDropdown>
</Icon>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | - | Whether the dropdown is open (usually driven by icon state) |
| `width` | `number` | `200` | Width in pixels |
| `maxHeight` | `number` | `200` | Max height before scrolling |
| `position` | `UDim2` | stylesheet value | Position relative to the parent icon |

Appearance is controlled via `stylesheet.customDropdown`.

#### Automatic overflow

`TopbarProvider` accepts an `overflowAmount` prop that caps the visible icons per dock:

```tsx
<TopbarProvider overflowAmount={4}>
    <Icon text="Home" />
    <Icon text="Settings" />
    <Icon text="Profile" />
    <Icon text="Messages" />
    <Icon text="Help" />
    {/* Icons beyond 4 in any dock collapse into a "⋯" overflow menu */}
</TopbarProvider>
```

When `overflowAmount` is **omitted**, the provider automatically detects whether icons from different docks overlap and progressively overflows them to prevent visual collisions. Icons moved into overflow appear in a dropdown behind the "⋯" button.

#### Manual overflow

For advanced cases, you can still wrap icons directly in `<Overflow>` inside a dock container:

```tsx
<LeftDock>
    <Overflow>
        <Icon text="Home" />
        <Icon text="Settings" />
        {/* ... many more ... */}
    </Overflow>
</LeftDock>
```

### Stylesheets

You can use stylesheets to override default properties of all components within.
Stylesheets are partial, and work like patches to already established default properties within the package:

```tsx
import { Stylesheet } from "@nrbx/topbar-components";

<Stylesheet stylesheet={{
    icon: {
        textSize: 25,
        cornerRadius: new UDim(0.5, 0),
    },
}}>
    <TopbarProvider>
        <LeftDock>
            <Icon text="Skins">
                <Dropdown selectionMode="Single">
                    <Icon text="yellow" selected={() => chooseSkin("yellow")} />
                    <Icon text="red" selected={() => chooseSkin("red")} />
                </Dropdown>
            </Icon>
        </LeftDock>
    </TopbarProvider>
</Stylesheet>
```

#### Complete stylesheet shape

The stylesheet exposes the following sections for full control:

```tsx
<Stylesheet stylesheet={{
    // Icon defaults (all IconProps)
    icon: {
        textSize: 20,
        textColor: { selected: Color3.fromRGB(57, 60, 65), deselected: Color3.fromRGB(255, 255, 255) },
        backgroundColor: { selected: Color3.fromRGB(245, 245, 245), deselected: Color3.fromRGB(0, 0, 0) },
        backgroundTransparency: 0.3,
        cornerRadius: new UDim(1, 0),
        fontFace: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Medium, Enum.FontStyle.Normal),
        static: false,
        disabled: false,
        // ... all other IconProps
    },

    // Dropdown defaults (all DropdownProps)
    dropdown: {
        maxWidth: 300,
        minWidth: 200,
        maxHeight: 200,
        forceHeight: 32,
        padding: new UDim(0, 2.5),
        selectionMode: "Multiple",
        // ... all other DropdownProps
    },

    // Provider frame
    provider: {
        paddingLeft: 8,           paddingRight: 12,
        paddingTop: 11,           paddingBottom: 0,
        iconSpacing: 12,          iconGroupSpacing: 0,
        backgroundTransparency: 1,
        anchorPoint: new Vector2(1, 0),
        position: UDim2.fromScale(1, 0),
        sizeScale: new Vector2(1, 1),
        insetHeightOffset: 0,
        forceFrameHeight: undefined,  // override auto height (e.g. 55)
        centreOffset: undefined,       // right-shift for centre dock (auto: 0 on new topbar, 12 on old)
    },

    // Icon internal sizing
    sizing: {
        iconHeight: undefined,       // explicit override
        iconWidth: undefined,        // explicit override (auto-fits when undefined/0)
        imagePadding: 6,
        labelPadding: 6,
        imageToTextSpacing: 6,
        contentPaddingX: 6,          // horizontal pad from button edge to content
        contentPaddingY: 6,          // vertical pad from button edge to content
        textMeasurementWidth: 99999,
        minLabelWidthPadding: 12,
        buttonLabelHeightFraction: 0.8,
        disabledOverlayTransparency: 0.55,
        disabledOverlayColor: new Color3(0, 0, 0),
    },

    // Dropdown surface theme
    dropdownTheme: {
        backgroundColor: new Color3(1, 1, 1),
        backgroundTransparency: 0,
        cornerRadius: new UDim(0, 0),
        borderSize: 0,            borderColor: new Color3(0, 0, 0),
        borderTransparency: 1,
        position: UDim2.fromScale(0, 1),
    },

    // Animation
    animation: {
        dropdownTransitionSpeed: 10,
        stateSpring: { tension: 400 },
        hoverEnabled: true,           // whether icons lift on hover
        hoverLift: 4,                 // pixels to lift
    },

    // Notification badge
    notification: {
        backgroundColor: Color3.fromRGB(255, 59, 48),
        backgroundTransparency: 0,
        textColor: new Color3(1, 1, 1),
        textSize: 12,
        fontFace: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Bold),
        position: new UDim2(0.5, 4, 0, -4),
        size: new UDim2(0, 18, 0, 18),
        cornerRadius: new UDim(1, 0),
        borderColor: new Color3(1, 1, 1),
        borderTransparency: 0,
    },

    // Tooltip
    tooltip: {
        backgroundColor: new Color3(0.1, 0.1, 0.1),
        backgroundTransparency: 0.2,
        textColor: new Color3(1, 1, 1),
        textSize: 14,
        fontFace: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Medium),
        cornerRadius: new UDim(0, 4),
        borderColor: new Color3(0.4, 0.4, 0.4),
        borderTransparency: 0,
        borderSize: 1,
        paddingX: 8,
        paddingY: 4,
        delayMs: 500,
    },

    // Custom dropdown
    customDropdown: {
        backgroundColor: new Color3(1, 1, 1),
        backgroundTransparency: 0,
        cornerRadius: new UDim(0, 6),
        borderSize: 0,
        borderColor: new Color3(0, 0, 0),
        borderTransparency: 1,
        position: UDim2.fromScale(0, 1),
    },
}}>
    {/* children */}
</Stylesheet>
```

### License

Package is licensed under the MIT License.

<hr />

<div align="center" id="top">
    <img src="https://img.shields.io/badge/Stripe-Donate%20to%20support%20NN140.UK-1b1b1b?style=for-the-badge&labelColor=6860ff&logo=stripe&logoColor=ffffff&logoSize=auto&link=https%3A%2F%2Fdonate.stripe.com%2F9B6eVdbTd4n1a6H1yXa3u04&link=https%3A%2F%2Fdonate.stripe.com%2F9B6eVdbTd4n1a6H1yXa3u04" alt="Badge">
    <img src="https://img.shields.io/badge/Stripe-Donate%20to%20Support%20NN140.UK%20(RECCURING)-1b1b1b?style=for-the-badge&labelColor=6860ff&logo=stripe&logoColor=ffffff&logoSize=auto&link=https%3A%2F%2Fdonate.stripe.com%2FdRm9ATe1laLpgv5b9xa3u05&link=https%3A%2F%2Fdonate.stripe.com%2FdRm9ATe1laLpgv5b9xa3u05" alt="Badge">
    <br />
    <br />
    <img src="https://github.com/nn140/Branding/blob/main/LogoBlack-Full.png?raw=true" alt="NN140.UK logo" width="800"/>
    <img src="https://github.com/nn140/Branding/blob/main/LogoWhite-Full.png?raw=true" alt="NN140.UK logo" width="800"/>
</div>
