# Quarks OS Design System - Rules & Constraints
**Last Updated**: 2026-02-03
**Status**: ENFORCED 🛡️

## 1. Color Restrictions
### 🚫 Forbidden Colors
*   **Purple**: Explicitly banned from all UI elements. Do not use `purple` tokens anywhere.

### ⚠️ Semantic Color Usage
*   **No Background Fills**: Semantic colors (Red, Green, Blue, Yellow, etc.) cannot be used as background fills for components (Badges, Cards, Containers).
*   **Allowed Usage**:
    *   **Text**: (`text-emerald-700`)
    *   **Borders**: (`border-red-200`)
    *   **Markers**: (`w-2 h-2 rounded-full bg-blue-500` - "Dots" only)
*   **Standard Badges**: Must use **Outline Style** (White Background + Colored Border + Colored Text).

## 2. Branding (Tokens)
*   **Solar**: `bg-solar-500` (Primary Action)
*   **Petroleum**: `text-petroleum-900` (Primary Text / Headers)
*   **Neutral**: `slate-50` to `slate-900` (Structure & Backgrounds)

## 3. Components
### 👤 Standard Avatar
*   **Implementation**: `StandardAvatar.jsx`
*   **Style**: Neutral Slate Background (`bg-slate-100`), Slate Text, Circular.
*   **No Random Colors**: Avatars must be uniform.

## 4. MCP Stitch Compliance
This document serves as the ground truth for all Stitch-generated UIs. Any generated screen must adhere to these constraints.
