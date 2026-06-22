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

## 📦 Installation

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

### ⚡ Quick Start

Instantiate `<TopbarProvider />` to be a root of your topbar component tree.

```tsx
<TopbarProvider>
    <Icon text="Hello, World!" />
</TopbarProvider>
```

#### 📍 Positioning icons with dock containers

Icons placed directly inside `<TopbarProvider>` default to the left side. Use the dock container components to position icons at the center or right of the bar:

```tsx
<TopbarProvider>
    <LeftDock>
        <Icon text="Home" />
        <Icon text="Settings" />
    </LeftDock>
    <CenterDock>
        <Icon text="Server Time" static />
    </CenterDock>
    <RightDock>
        <Icon text="Profile" imageId="rbxassetid://..." />
    </RightDock>
</TopbarProvider>
```

| Container | Anchor | Purpose |
|---|---|---|
| `<LeftDock>` | left edge | Default — icons flow left-to-right from the left |
| `<CenterDock>` | center (50%) | Centers icons in the bar |
| `<RightDock>` | right edge | Right-aligns icons |

Each dock container renders its own horizontal list with the configured `iconSpacing` and vertical centering. Center and right docks automatically apply `iconGroupSpacing` for visual separation.

#### 🏷️ Icon props: `static` and `disabled`

- **`static`** — turns the icon into a non-interactive label (no clicks, no hovers, no state toggling, no sounds)
- **`disabled`** — dims the icon with a configurable semi-transparent overlay

```tsx
<Icon text="Read Only" static />       {/* label, not clickable */}
<Icon text="Locked" disabled />         {/* dimmed */}
<Icon text="Both" static disabled />    {/* dimmed label */}
```

The disabled overlay transparency and color are configurable via the stylesheet `sizing` section.

#### 🔽 Dropdowns

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

### 🎨 Stylesheets

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
    // ── Icon defaults (all IconProps) ──
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

    // ── Dropdown defaults (all DropdownProps) ──
    dropdown: {
        maxWidth: 300,
        minWidth: 200,
        maxHeight: 200,
        forceHeight: 32,
        padding: new UDim(0, 2.5),
        selectionMode: "Multiple",
        // ... all other DropdownProps
    },

    // ── Provider frame ──
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
    },

    // ── Icon internal sizing ──
    sizing: {
        iconHeight: undefined,    // explicit override
        imagePadding: 6,
        labelPadding: 6,
        imageToTextSpacing: 6,
        textMeasurementWidth: 99999,
        minLabelWidthPadding: 12,
        buttonLabelHeightFraction: 0.8,
        disabledOverlayTransparency: 0.55,
        disabledOverlayColor: new Color3(0, 0, 0),
    },

    // ── Dropdown surface theme ──
    dropdownTheme: {
        backgroundColor: new Color3(1, 1, 1),
        backgroundTransparency: 0,
        cornerRadius: new UDim(0, 0),
        borderSize: 0,            borderColor: new Color3(0, 0, 0),
        borderTransparency: 1,
        position: UDim2.fromScale(0, 1),
    },

    // ── Animation ──
    animation: {
        dropdownTransitionSpeed: 10,
        stateSpring: { tension: 400 },
    },
}}>
    {/* children */}
</Stylesheet>
```

### 📝 License

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
