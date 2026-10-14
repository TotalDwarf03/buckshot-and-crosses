# Project Structure

This file outlines the structure of the project including how code is organised and where to find specific files.

## General Structure

```bash
buckshot-and-crosses/
├── docs/                  # Documentation files
└── src/                   # Source files
 ├── index.html         # Main HTML file
 ├── assets/            # Static assets
 ├── components/        # Custom elements
 ├── scripts/           # JavaScript files
 │   └── ...
 └── styles/            # CSS files
  └── ...
```

## index.html

This is the main HTML file for the project. It contains the base structure of the application and links to the necessary stylesheets and scripts.

## assets/

This contains static assets (mainly images) used in the project. These assets are referenced in the HTML and CSS files.

## components/

This contains custom elements that are used in the project. Each component is defined in its own JavaScript file and loaded into the page via script tags in `src/index.html`.

Currently, these elements are used for game items since they have unique functionality with some shared traits.
Custom elements were used so that the items can be easily maintained and the objects can be easily created and destroyed as needed.

## scripts/

This contains the JavaScript files that handle the logic of the application.

The scripts are split across the following files, each handling a different aspect of the application:

- `main.js`: This is the entry point of the application. It initializes the game and sets up event listeners.
- `render.js`: This file contains functions that handle rendering the game state to the DOM. It updates the visual representation of the game based on the current state (i.e. updating the health and inventory).
- `gameplay.js`: This file contains turn flow and win resolution logic.
- `shotgun.js`: This file contains shotgun-specific interaction, pump, reload, and shell animation logic.
- `dealer.js`: This file contains dealer decision-making and dealer turn execution logic.
- `dialogue.js`: This file contains dealer dialogue data and helper logic for picking dialogue lines.
- `state.js`: This file manages the game state, including the player's health, inventory, and other relevant data. Splitting game state into its own file allows for easier management and potential future expansion of the game.
- `utils.js`: This file contains utility functions that are used throughout the application. These functions can be reused in different parts of the codebase, promoting code reusability and maintainability.

## styles/

This contains the CSS files that style the application. The main stylesheet is `main.css`, which defines the overall look and feel of the game. Additional stylesheets can be added as needed to support new features or components.
