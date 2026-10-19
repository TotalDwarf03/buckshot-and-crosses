# Buckshot and Crosses

![Buckshot and Crosses Thumbnail](./src/assets/branding/buckshot-and-crosses-thumbnail.png)

A web game, written in pure HTML, CSS and JavaScript, giving a Buckshot Roulette flavour to classic Noughts and Crosses.

This project was created as part of IS3S664 - Advanced Internet and Mobile Computing at the University of South Wales (USW).

The curriculum for the module can be found here: [IS3S664 - Advanced Internet and Mobile Computing](https://curriculum.southwales.ac.uk/Module/Details?moduleId=MOD009108)

## Contents

- [Buckshot and Crosses](#buckshot-and-crosses)
  - [Contents](#contents)
  - [Getting Started](#getting-started)
  - [Disclaimer](#disclaimer)
  - [About the Game](#about-the-game)
  - [Documentation](#documentation)
  - [Linting and Formatting](#linting-and-formatting)
    - [Prettier](#prettier)
    - [Markdownlint](#markdownlint)
  - [AI Usage Disclaimer](#ai-usage-disclaimer)
  - [Credits and Acknowledgements](#credits-and-acknowledgements)

## Getting Started

To get started with the project, you can simply clone the repository and open the `src/index.html` file in your web browser.

## Disclaimer

**Please Note:** This game does not support mobile devices. It is designed to be played on a desktop or laptop computer with a keyboard and mouse.

Although the layout is responsive for smaller screens, the game mechanics and controls are not designed for touch input. For the best experience, please play the game on a device with a physical keyboard and mouse.

## About the Game

Buckshot and Crosses is a single-player, desktop browser game that combines a 3×3 Noughts and Crosses board with a shotgun loaded with random X, O, and blank shells. The player and the dealer take turns firing at empty squares; the shooter who completes a line of three matching marks wins the round.

The player must win 2 rounds to win the game. The player starts with two health points and can collect single-use items to change the odds.

Click **Start** and then the waiver to begin. Click the shotgun to aim, move the pointer over an empty square, and click to shoot. Press **Space** to pump the shotgun or **Escape** to stop aiming. The game requires a keyboard and mouse.

For more information about game mechanics and rules, please refer to the documentation in the `docs` directory. This does also include some technical details about the implementation and structure of the project.

## Documentation

Further documentation about the project can be found in the `docs` directory.

## Linting and Formatting

This project uses GitHub Actions to run Prettier and Markdownlint on pushes and pull requests to the `main` branch. These workflows are in the `.github/workflows` directory.

These workflows check for formatting and linting issues in the codebase. If any issues are found, the workflow will fail and provide feedback on what needs to be fixed.

To fix any issues, you will need to run the tools locally using the instructions below.

**Credit:**

- [Prettier](https://prettier.io/)
- [Markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli)

### Prettier

To run Prettier locally, you will need to have Node.js and npm installed. You can then run Prettier using the following command:

```bash
npx prettier . --write
```

This will format all files in the project according to Prettier's default configuration.

### Markdownlint

To run Markdownlint locally, you will need to have Node.js and npm installed. You can then run Markdownlint using the following command:

```bash
npx markdownlint . --fix
```

This will lint all Markdown files in the project and automatically fix any issues that can be fixed.

## AI Usage Disclaimer

AI has been used in this project to assist in the following areas:

- Art and graphics generation (i.e. game assets, branding, etc.)
- CSS styling and layout suggestions.
- Animations and transitions

The functionality of the game has been implemented by hand, alongside brainstorming and planning of the game mechanics, rules and logic.

## Credits and Acknowledgements

- Game inspired by [Buckshot Roulette](https://store.steampowered.com/app/2835570/Buckshot_Roulette/), developed by Mike Klubnika.
- Audio and music largely taken from Buckshot Roulette, alongside some non-copyrighted sound effects.
