# Accordion

A vertically stacked set of interactive headings that reveal or hide associated sections of content.

## Usage

```tsx
import { Accordion } from "./component";

export default function App() {
  return (
    <Accordion.Root defaultOpenValues={["shipping"]}>
      <Accordion.Item value="shipping">
        <Accordion.Trigger>What are your shipping options?</Accordion.Trigger>
        <Accordion.Content>
          Standard (5-7 days), express (2-3 days), or overnight.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="returns">
        <Accordion.Trigger>What is your return policy?</Accordion.Trigger>
        <Accordion.Content>
          Returns are accepted within 30 days.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

## Anatomy

Assemble the component parts in the following nested structure:

```tsx
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Trigger />
    <Accordion.Content />
  </Accordion.Item>
</Accordion.Root>
```

## API Reference

### `Accordion.Root`

Contains all the parts of an accordion and manages its **State**. Renders a `<div>` element.

| Prop                    | Type                    | Default | Description                                                        |
| :---------------------- | :---------------------- | :------ | :----------------------------------------------------------------- |
| `defaultOpenValues`     | `ReadonlyArray<string>` | `[]`    | The `value` of the item(s) to expand on initial render.            |
| `hasMultipleOpenPanels` | `boolean`               | `false` | Allows multiple items to remain open at the same time when `true`. |
| `children`              | `ReactNode`             | —       | **Required.** The `Accordion.Item` elements.                       |

### `Accordion.Item`

Contains all the parts of a collapsible section. Renders a `<div>` element.

| Prop         | Type        | Default | Description                                                             |
| :----------- | :---------- | :------ | :---------------------------------------------------------------------- |
| `value`      | `string`    | —       | **Required.** A unique identifier for the item.                         |
| `isDisabled` | `boolean`   | `false` | Prevents the user from interacting with the item when `true`.           |
| `children`   | `ReactNode` | —       | **Required.** Must contain `Accordion.Trigger` and `Accordion.Content`. |

### `Accordion.Trigger`

Toggles the collapsed **State** of its associated content. Renders an interactive `<button>` nested inside a heading tag.

| Prop           | Type        | Default             | Description                                                                                                 |
| :------------- | :---------- | :------------------ | :---------------------------------------------------------------------------------------------------------- |
| `headingProps` | `object`    | `{ heading: "h3" }` | **Props** forwarded to the heading wrapper. Accepts `heading` (`"h2"` – `"h6"`) to change the semantic tag. |
| `buttonProps`  | `object`    | —                   | **Props** forwarded directly to the inner `<button>` element.                                               |
| `children`     | `ReactNode` | —                   | **Required.** The visible label for the trigger.                                                            |

### `Accordion.Content`

Contains the collapsible content for an item. Renders a `<div>` element with `role="region"`.

| Prop       | Type        | Default | Description                                               |
| :--------- | :---------- | :------ | :-------------------------------------------------------- |
| `children` | `ReactNode` | —       | **Required.** The content revealed when the item is open. |

## Styling

Target the `data-part` and `data-state` attributes in your CSS to style the component.

### Data Attributes

| Attribute       | Values                                                                                                                                                             | Applied To                   |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| `data-part`     | `"accordion-root"`, `"accordion-item"`, `"accordion-header"`, `"accordion-trigger"`, `"accordion-content"`, `"accordion-content-clip"`, `"accordion-content-body"` | Respective DOM elements      |
| `data-state`    | `"open"` \| `"closed"`                                                                                                                                             | `Item`, `Trigger`, `Content` |
| `data-disabled` | `""` (present when disabled)                                                                                                                                       | `Item`, `Trigger`, `Content` |

### Animation Variables

Customize the open/close transition using CSS custom properties:

```css
[data-part="accordion-content"] {
  --accordion-duration: 300ms;
  --accordion-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

_Note: Transitions are automatically disabled if the user has `prefers-reduced-motion: reduce` enabled._

## Accessibility

- **ARIA Attributes**: Automatically links `Accordion.Trigger` and `Accordion.Content` using generated `id`, `aria-controls`, and `aria-labelledby` attributes, and updates `aria-expanded` based on **State**.
- **Semantic Headings**: Wraps triggers in an `<h3>` by default (configurable via `headingProps.heading`) so screen reader users can navigate sections by heading.
- **Keyboard Interaction**: Uses a native `<button>` element, providing built-in `Enter` and `Space` key toggling as well as `Tab` focus management.
