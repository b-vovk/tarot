# Design System - CSS Variables

## Typography Scale

### Font Sizes
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)

### Common Typography
- `--h1-size`: var(--font-size-4xl) (36px)
- `--h1-size-mobile`: var(--font-size-2xl) (24px)
- `--p-size`: var(--font-size-base) (16px)
- `--p-size-mobile`: var(--font-size-sm) (14px)
- `--small-text`: var(--font-size-xs) (12px)

## Spacing Scale

### Spacing Units
- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-5`: 1.25rem (20px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-10`: 2.5rem (40px)

## Single Page Specific

### Desktop
- `--single-title-size`: var(--font-size-3xl) (30px)
- `--single-body-size`: var(--font-size-base) (16px)

### Mobile
- `--single-title-size-mobile`: var(--font-size-2xl) (24px)
- `--single-body-size-mobile`: var(--font-size-sm) (14px)

## Usage Examples

### Before (hardcoded pixels)
```css
.singlePage .cardTitle {
  font-size: 29px !important;
  padding: 0 0 20px !important;
}
```

### After (using variables)
```css
.singlePage .cardTitle {
  font-size: var(--single-title-size) !important;
  padding: 0 0 var(--spacing-5) !important;
}
```

## Benefits

1. **Consistency**: All typography and spacing follows a systematic scale
2. **Maintainability**: Change values in one place, affects everywhere
3. **Responsiveness**: Easy to adjust mobile vs desktop sizes
4. **Scalability**: Easy to add new sizes following the established pattern
5. **Developer Experience**: Clear naming conventions and predictable values

## Best Practices

1. **Always use variables** instead of hardcoded pixels
2. **Follow the scale** - don't create arbitrary sizes
3. **Use semantic names** like `--single-title-size` not `--font-size-30`
4. **Group related variables** in logical sections
5. **Document changes** when adding new variables
