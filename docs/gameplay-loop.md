# Gameplay Loop

The gameplay loop follows a simple structure:

1. A random number of shells are loaded into the shotgun (between 2 and 5).
2. The player receives 1 item per round, with them being able to keep up to 2 items in their inventory at any given time.
   1. If the player's inventory is full, they will not receive any new items until they use an item.
3. The player takes their turn, which consists of using items (as many as they have), pumping the shotgun or shooting the shotgun at the grid. There are 3 possible outcomes of the player's turn:
   1. The player pumps the shotgun with a blank shell. This lets the player take another turn.
   2. The player pumps the shotgun with an x or o shell. This switches the turn to the dealer.
   3. The player shoots the shotgun at the grid. This will use the current shell in the shotgun and will either place an x or o on the grid, or will result in a miss. Once the player shoots, the turn switches to the dealer.
4. The dealer takes their turn. This process is outlined in the [dealer's turn](./dealer.md) documentation.
5. The turns will then keep switching until a player lines up 3 of their symbols in a row, or until the grid is full. Once one of these conditions is met, the following will happen:
   1. If a player lines up 3 of their symbols in a row, they will have beaten the dealer. This will result in a win for the player.
   2. If the grid is full and no player has lined up 3 of their symbols in a row, the game will result in a draw.
   3. If the dealer lines up 3 of their symbols in a row, the player will have lost to the dealer. This will result in a loss for the player.

## Dealer Wins

If the dealer wins, the player will lose 1 health point.

If the player has 0 health points, they will lose the game and something will happen (TODO: Decide what happens when the player loses the game).

If the player still has health points remaining, the board will reset and the player will continue playing.

## Player Wins

If the player wins, the win counter will increase by 1.

If the player wins twice, the game ends and a briefcase drops into the centre of the screen. The player can click it to open it. After a few seconds, the screen fades to black and displays a Restart button that reloads the page.

If the player has not won twice, the board will reset and the player will continue playing.

## Draw

If the game results in a draw, the board will reset and the player will continue playing.
