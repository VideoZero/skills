# Icons

Icons are available via the `Icon` component from `@motion-canvas/2d`, powered by Iconify (150,000+ icons across 158 icon sets).

## Usage

```ts
import {Icon} from '@motion-canvas/2d';

<Icon icon={'mdi:home'} size={100} color={'#ffffff'} />
```

## Popular Icon Sets

| Prefix | Set | Examples |
|--------|-----|---------|
| `mdi` | Material Design Icons | `mdi:home`, `mdi:heart`, `mdi:settings` |
| `fa` | Font Awesome | `fa:user`, `fa:check`, `fa:star` |
| `carbon` | Carbon (IBM) | `carbon:code`, `carbon:cloud`, `carbon:data` |
| `lucide` | Lucide | `lucide:github`, `lucide:file`, `lucide:search` |
| `ph` | Phosphor | `ph:lightning`, `ph:book`, `ph:chart-bar` |
| `tabler` | Tabler Icons | `tabler:brand-react`, `tabler:database` |

## Best Practices

- **Recolor icons** to match your theme — use the `color` prop
- **Maintain consistent style** — stick to one style (outline OR filled) and one icon set within a scene
- **Animate icon changes:**

```ts
const iconRef = createRef<Icon>();
<Icon ref={iconRef} icon={'mdi:heart-outline'} size={100} />

yield* iconRef().icon('mdi:heart', 0.5);
yield* iconRef().color('#e13238', 0.5);
```

## Full Icon Catalog

Over 226,000 icons are available across 158 icon sets. Browse the full catalog at [Icones](https://icones.js.org/).
