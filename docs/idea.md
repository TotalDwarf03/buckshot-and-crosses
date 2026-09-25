# Initial Idea

## Coursework Objective

The objective of this coursework is to create a basic noughts and crosses game in plain HTML, CSS and JavaScript.

The coursework has 3 options:

- **Option 1:** Enhance an existing game which has been developed during the module's tutorials.
- **Option 2:** Enhance an existing game which has been created externally (i.e. an open source GitHub project).
- **Option 3:** Create a new game from scratch.

### Marking Criteria

Depending on the option chosen, the marking criteria will vary.

- With options 1 and 3, it will be marked based on a functional base game and any enhancements made to it.
- With option 2, it will be marked based on the enhancements made to the existing game.

The goal of the coursework is to demonstrate technical ability with JavaScript, which the enhancements should highlight.
The HTML and CSS should be treated as an aside, with the focus being on the JavaScript code.

### Option Choice

For this coursework, I have chosen **Option 3**, to create a new game from scratch.

My idea is to create a [Buckshot Roulette](https://en.wikipedia.org/wiki/Buckshot_Roulette) flavour to classic Noughts and Crosses, which I will call **Buckshot and Crosses**.

The enhancements for the coursework will be the buckshot-inspired functionality which I will add.

## Buckshot Roulette

Buckshot Roulette is a game where players play russian roulette with a shotgun.
The shotgun is loaded with a number of shells, some of which are live and some of which are blanks.

Players take turns to fire the shotgun, with the option to either fire the shotgun at themselves or at another player.
The mystery of the game is that players do not know which shells are live and which are blanks, so they must take a risk when firing the shotgun.

If a player fires a live shell at themselves, they lose a life. If they fire a live shell at another player, that player loses a life.
If a blank shell is fired at themselves, they are safe and continue their turn. If a blank shell is fired at another player, the player's turn ends and the next player takes their turn.

During the game, there are various items which can be used to help players survive. To give some examples:

- **Burner Phone:** Gives the player an anonymous tip about which shells are live and which are blanks. These tips are not always accurate, so players must take a risk when using this item.
- **Beer:** Allows the player to pump the shotgun, using a shell and revealing it without firing it. This allows players to skip shells.
- **Handsaw:** Allows the player to saw off the barrel of the shotgun, increasing the damage from a shot.
- **Cigarette Pack:** Allows the player to smoke a cigarette, which gives them a health point back.
- **Magnifying Glass:** Allows the player to inspect the shotgun, revealing the status of the current shell.

Each time the shotgun is emptied, it is reloaded with a new set of shells of a random amount of live and blank shells.
When the shotgun is reloaded, players are given x amount of random items to help them survive the next round.

The game continues until only one player is left alive, who is declared the winner.

## Basic Idea for the Game

With an understanding of Buckshot Roulette, how does this relate to Noughts and Crosses?

In principle, the idea is that instead of shooting a gun at players, players will be shooting a gun at the squares on the Noughts and Crosses board.
Instead of players shooting live or blank shells, the shells will determine whether the square is filled with a nought, a cross or nothing at all.

The goal is for a player to get 3 of their symbols in a row, either horizontally, vertically or diagonally, before the other player does.

The player will need to use items to help them survive the game, as they will not know which symbol they will get when they shoot the gun at a square.

When the player creates a row of 3 symbols, they will remove a life from the other player (how they lose the life hasn't been decided yet).
The game will continue until one player has no lives left, at which point the other player is declared the winner.

There might be some other enhancements to the game, but this will be decided during development, depending on time (i.e. gambling / betting mechanics).

## Art Style

Since the game is based on Buckshot Roulette, the art style will be based on a gritty, realistic style, with a dark colour palette.
Additionally, since the game is limited to plain HTML, CSS and JavaScript, a top-down 2D art style will be used.

During research, I have considered JS game engines such as Pixi.js and Phaser, but this might skew the marking criteria which is a risk I do not want to take.
The game also has to be hosted on USW's Student Web Server, which is limited to static websites, so using a game engine might add unnecessary complexity to the project.

## Development Approach

During development, I will use a functionality-first approach, where the focus will be on getting the game and its mechanics to work before focusing on the art style and aesthetics of the game.
Marks are awarded primarily for the functionality of the game, so this is the best approach to take.
