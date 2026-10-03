function chooseRandomDialogue(key) {
  const dialogueArray = dealerDialogue[key];

  const randomIndex = randint(0, dialogueArray.length - 1);
  return dialogueArray[randomIndex];
}

const dealerDialogue = {
  sign: ["Sign the waiver.", "On the dotted line.", "Pen to paper, please."],
  start: ["Good luck.", "Your mistake.", "Hope you read the fine print."],
  blank: ["Blank shell!", "No luck this time.", "Oops, nothing there."],
  live: [
    "Should've checked the chamber.",
    "I would've shot that one.",
    "Better luck next time.",
  ],
  eject: ["Wise choice.", "Good call.", "Lucky you."],
  occupied: [
    "That one's taken!",
    "Someone beat you to it.",
    "No room at the inn.",
  ],
  skip: [
    "...kzzzt... can't... —th—... krrrzt...",
    "...is... ...ng ...n?...",
    "...",
    "...— — —...",
  ],
};
