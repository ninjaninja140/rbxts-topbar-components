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

```jsx
<TopbarProvider>
    <Icon text="Hello, World!" />
</TopbarProvider>
```

Every `<Icon />` can be in only two states `selected`, and `deselected`.
You can conditionally apply properties based on icon's current state, by providing a state markup object:

```jsx
<Icon text={{
    selected: "Selected!",
    deselected: "Deselected!",
}} />
```

You can add a dropdown to an icon by mounting `<Dropdown />` component as it's child:
Dropdowns & TopbarProvider have a property called `selectionMode`, which lets you specify how many icons can be selected at once.

```jsx
<Icon text="Skins">
    <Dropdown selectionMode="single">
        <Icon text="yellow" selected={() => chooseSkin("yellow")} />
        <Icon text="red" selected={() => chooseSkin("red")} />
    </Dropdown>
</Icon>
```

Dropdowns **can be nested.**

### 🎨 Stylesheets

You can use stylesheets to override default properties of all components within:
Stylesheets are partial, and work like patches to already established default properties within the package:

```jsx
<Stylesheet stylesheet={{
    icon: {
        textSize: 25,
        cornerRadius: new UDim(0.5, 0),
    }
}}>
    <Icon text="Skins">
        <Dropdown selectionMode="single">
            <Icon text="yellow" selected={() => chooseSkin("yellow")} />
            <Icon text="red" selected={() => chooseSkin("red")} />
        </Dropdown>
    </Icon>
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
