# Gameplay Loop

## Setup

The player starts with two health points, with a maximum of three. The first shotgun load begins the player's turn. Each load contains 2 to 5 randomly selected shells: X, O, or blank. The set is rerolled until it contains at least one X shell and one O shell; blank shells are not guaranteed.

One random item is added per load if an inventory slot is available. The inventory has two slots, and a full inventory receives no new item.

## Turns

On their turn, the player can use inventory items, pick up the shotgun to aim and shoot an empty square, or pump the shotgun with Space. Escape cancels aiming. The dealer takes its turn automatically after the player's turn; see [Dealer](./dealer.md) for its decision logic.

A shot consumes the current shell. An X or O shell places that mark in the chosen square; a blank shell leaves the square empty. After a shot, the turn passes to the other side, except that using the last shell triggers a reload before the turn changes.

Pumping consumes and reveals the current shell. Pumping a blank gives the same side another turn. Pumping an X or O passes the turn to the other side. Items can alter this behavior; see [Items](./items.md).

## Round Outcomes

The shooter wins the round by completing a row, column, or diagonal of three matching nonblank marks. The marks are determined by the shells, not by which side fired them. If all nine squares are filled without a line, the round is a draw.

When the dealer wins, the player loses one health point. If the player had one health point before the loss, the game ends with a loss screen. Otherwise, the board and shotgun are reset for another round, and the player goes next.

When the player wins, the win counter increases. Their first round win resets the board and shotgun for another round. Winning twice ends the game: the player can open the briefcase, after which the restart screen appears.

A draw resets the board and reloads the shotgun without changing health or the win counter; turns continue according to the side that was due to act next.
