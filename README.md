# Buckshot and Crosses

![Buckshot and Crosses Thumbnail](./src/assets/branding/buckshot-and-crosses-thumbnail.png)

A web game, written in pure HTML, CSS and JavaScript, giving a Buckshot Roulette flavour to classic Noughts and Crosses.

This project was created as part of IS3S664 - Advanced Internet and Mobile Computing at the University of South Wales (USW).

The curriculum for the module can be found here: [IS3S664 - Advanced Internet and Mobile Computing](https://curriculum.southwales.ac.uk/Module/Details?moduleId=MOD009108)

## Contents

- [Buckshot and Crosses](#buckshot-and-crosses)
  - [Contents](#contents)
  - [Getting Started](#getting-started)
  - [About the Game](#about-the-game)
  - [Documentation](#documentation)
  - [Linting and Formatting](#linting-and-formatting)
    - [Prettier](#prettier)
    - [Markdownlint](#markdownlint)
  - [AI Usage Disclaimer](#ai-usage-disclaimer)
  - [Credits and Acknowledgements](#credits-and-acknowledgements)

## Getting Started

To get started with the project, you can simply clone the repository and open the `index.html` file in your web browser.

## About the Game

TBC

## Documentation

Further documentation about the project can be found in the `docs` directory.

## Linting and Formatting

This project uses GitHub Actions to run Prettier and Markdownlint on push and pull requests to the `main` branch. These action can be found in the `.github/workflows` directory.

These action will check for formatting and linting issues in the codebase. If any issues are found, the action will fail and provide feedback on what needs to be fixed.

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
- CSS styling and layout suggestions
- Animations and transitions

The functionality of the game has been implemented by hand, alongside brainstorming and planning of the game mechanics, rules and logic.

## Credits and Acknowledgements

TBC
