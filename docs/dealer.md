# Dealer

## Overview

The dealer is the main opponent in the game. He is portrayed as a mobile phone on the table, which will buzz and display text messages to the player.

The dealer is used in 3 main ways:

- To create a startup sequence for the game, where he will display a message to the player and then prompt them to sign a waiver before the game begins.
- To provide a basic tutorial for the player, where he will display messages to guide the player through the game mechanics.
- To taunt the player in areas where the player is struggling, providing a sense of challenge and engagement.

## Why a phone?

The dealer is represented as a mobile phone to avoid any awkwardness in the UI.

If the dealer was to be represented as a person, say sat opposite the player, it would make the UI feel really awkward since the perspective would be different. The player would be looking down at the dealer, but the dealer would be looking up at the player, which would feel unnatural.

## Interaction with the Dealer

The player and dealer will interact in turns, with the player taking their turn first, followed by the dealer. They will alternate turns until the game is over.

Items that the player can use will be displayed in the player's HUD. The dealer will be without items. This is a stylistic choice to make the dealer feel more powerful. It's his house, and he doesn't need to use items to win. The player is the underdog, and must use their items to win.

_it also makes the UI cleaner and is less work for me to implement..._

## Dealer turn logic

TODO: define algorithm for dealer turn logic.
