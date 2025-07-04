// Steps to go through the project
// 1 Deposit some amount of money
// 2 Determine the number of lines to bet on
// 3 Collect a bet amount
// 4 Spin the slot machine
// 5 check the user won or lost
// 6 Give the user their winning or take amount if lost
// 7 Play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 5,
  D: 8,
};

const SYMBOL_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a depoist amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, please enter the amount again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberLines = () => {
  while (true) {
    const betLines = prompt("Enter number of lines to bet on (1-3): ");
    const numberBetLines = parseFloat(betLines);

    if (isNaN(numberBetLines) || numberBetLines <= 0 || numberBetLines > 3) {
      console.log("Invlaid number of Bet lines, try again.");
    } else {
      return numberBetLines;
    }
  }
};

const getBetAmount = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet amount per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet amount , please try again.");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const newReels = [];

  for (let i = 0; i < ROWS; i++) {
    newReels.push([]);
    for (let j = 0; j < COLS; j++) {
      newReels[i].push(reels[j][i]);
    }
  }
  return newReels;
};

const printNewReels = (newReels) => {
  for (const reel of newReels) {
    let reelString = "";
    for (const [i, symbol] of reel.entries()) {
      reelString += symbol;
      if (i != reel.length - 1) {
        reelString += " | ";
      }
    }
    console.log(reelString);
  }
};

const getWinnings = (newReels, betAmount, Lines) => {
  let winnings = 0;
  for (let row = 0; row < Lines; row++) {
    const symbols = newReels[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += betAmount * SYMBOL_VALUE[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of ₹" + balance);
    const numberBetLines = getNumberLines();
    const betAmount = getBetAmount(balance, numberBetLines);
    balance -= betAmount * numberBetLines;
    const reels = spin();
    // console.log(reels);
    const newReels = transpose(reels);
    // console.log(newReels);
    printNewReels(newReels);
    const winnings = getWinnings(newReels, betAmount, numberBetLines);
    balance += winnings;
    console.log("You won, ₹ " + winnings.toString());
    console.log(" Now your balance is ₹" + balance);

    if (balance <= 0) {
      console.log("You ran out of money");
      break;
    }
    const playAgain = prompt("Do you want to play again(yes/no)");
    if (playAgain != "yes") break;
  }
};
game();
