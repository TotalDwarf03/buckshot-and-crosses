# UI Layout

## Layers

The game splits its UI into 3 main sections:

- Base Layer
- Notification Layer
- HUD Layer

This approach simplifies the styling and positioning of the various UI elements, and allows for easy management of their visibility and interactivity.

The base layer is positioned at the bottom of the stack, and contains the main game elements, such as the game grid and background.

The notification layer is positioned above the base layer, and contains elements that provide feedback to the player, including the shell loader and game status messages.

The HUD layer is positioned at the top of the stack, and contains elements that the user interacts with directly, such as the shotgun and any inventory items.

There are some elements outside this system (i.e. the crosshair and aiming help), which are positioned separately on the screen, and are not part of the main UI stack.

## Positioning

The positioning and sizing of UI elements is handled using a mixture of CSS flexbox and absolute positioning. Flexbox is used for the main layout of the game grid and HUD, while absolute positioning is used for elements that need to be positioned relative to the viewport, such as the crosshair and aiming help.

## Padding / Spacing

Padding and spacing between UI elements is handled using `rem` units, which are relative to the root font size. This allows for consistent spacing across different screen sizes and resolutions.
