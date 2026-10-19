# Audio

Audio files are stored in `src/assets/audio/` and played by `src/scripts/audio.js`.
The audio script is loaded by `src/index.html` before the game scripts.

## Playback

`playSound(name)` plays a mapped effect. Each playback uses a cloned audio element
so the same effect can be triggered again without waiting for the previous one to
finish. Sound effects play at volume `0.65`.

`playMusic(name)` stops the current music before starting another track. The home
and in-game background tracks loop at volume `0.35`; the ending track plays once.
The browser may block audio until the user interacts with the page. The home track
starts on the first pointer or keyboard interaction, and pressing Start switches
to the in-game track.

## Sound Effects

### `sfx/`

- `blank.ogg`: Plays when a blank shell is fired.
- `briefcase-latch.ogg`: Plays when the player clicks the revealed briefcase.
- `briefcase-open.ogg`: Plays shortly after the briefcase is clicked, as it opens.
- `briefcase-show.ogg`: Plays when the briefcase is revealed after the player's final win.
- `dealer-talk.ogg`: Plays when the dealer's dialogue begins typing.
- `live.ogg`: Plays when a live shell is fired.
- `load-shell.ogg`: Plays for each shell chambered during a reload.
- `lose-health.ogg`: Plays when the player's health decreases.
- `pump-shotgun.ogg`: Plays whenever the shotgun is pumped.
- `round-light.ogg`: Plays when the player wins a round and the table backdrop changes.

### `items/`

- `cigarette.ogg`: Plays when the cigarette pack is used.
- `contraption.ogg`: Plays when the strange contraption is used.
- `flashlight.ogg`: Plays when the flashlight is used.
- `jammer.ogg`: Plays when the jammer is used.
- `vodka.ogg`: Plays when the expired vodka is used.
- `item-1.ogg`, `item-2.ogg`, `item-3.ogg`, `item-4.ogg`: One of these is selected at random when an item is added to an inventory slot.

## `music/`

- `music/blank-shell.ogg`: Loops on the home screen, starting after the first pointer or keyboard interaction.
- `music/background-music.ogg`: Loops after the player presses Start.
- `music/end.ogg`: Plays when the player opens the briefcase after winning, or when the dealer wins the final game.
