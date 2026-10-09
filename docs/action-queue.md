# Action Queue

Once the dealer was implemented, I ran into issues where his turn was instant and overlapped with other gameplay mechanics (i.e. reloading the shotgun and the dealer talking). This led to a chaotic and confusing experience for the player, as multiple actions were happening at once without any clear order or timing.

To fix this, actions now get queued up and executed in order. This allows for actions to happen in a deliberate, controlled sequence, rather than in a chaotic, overlapping way.

## How this works

### Components

In `state.js`, there are 3 components which drive this system:

- `actionQueue`: A promise chain that represents the current queue of actions to be executed.
- `actionQueueRunning`: A boolean flag to indicate whether the action queue is currently running.
- `queueAction(action)`: A function to add an action to the queue.

### Process

The process works as follows:

- An action is added to the queue using `queueAction(action)`. This function takes a function as an argument, which represents the action to be executed.
- The `queueAction` function adds the action to the `actionQueue` promise chain. It does this by chaining a `.then()` call to the existing `actionQueue` promise, which ensures that the new action will be executed after all previously queued actions have completed.
- The `actionQueueRunning` flag is used to prevent multiple instances of the action queue from running simultaneously. When an action is added to the queue, the function checks if the queue is already running. If it is not, it sets the flag to `true` and starts executing the actions in the queue.
- Once an action is executed, it is expected to return a promise that resolves when the action is complete. This allows the next action in the queue to be executed only after the previous action has finished.

In summary:

- Actions are added to the queue using `queueAction(action)`.
- Actions are queued up in a promise chain, ensuring they are executed in order.
- The `actionQueueRunning` flag prevents multiple instances of the queue from running simultaneously.
- Each action is expected to return a promise that resolves when the action is complete, allowing the next action to be executed in sequence.

## Queue debugging

TODO: introduce some debugging tool to visualise the queue and its state. It's quite hard to understand what is happening when and why, so this is much needed.
