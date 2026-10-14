# Items

Items are single-use effects inspired by Buckshot Roulette. The player can use them to change the state of a turn or board.

## Item Generation and Inventory

One random item is added whenever the shotgun is loaded, if there is an empty inventory slot. The inventory holds at most two items. Items are consumed when used.

## Item List

### Handcuffs

Skips the dealer's next turn.

### Flashlight

Reveals the current shell without consuming it or changing turns.

### Cigarette Pack

Restores one health point, up to the maximum of three.

### Strange Contraption

Has a chance to remove the most recent shot from the board, do nothing, or reset the board and cost the player one health point. If there is no previous shot, the remove-shot outcome has no effect.

### Expired Vodka

Pumps and consumes the current shell without passing the turn, regardless of whether it is blank, X, or O. If that empties the shotgun, it is reloaded.
