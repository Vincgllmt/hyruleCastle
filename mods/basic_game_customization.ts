import { getSave } from './save';

const readline = require('readline-sync');

function headTailTitle() {
  console.log('        -------------------------------------------------------');
  console.log('       /\\                                                     /\\');
  console.log('    (O)===)><><><><><><><><><><><><><><><><><><><><><><><><><)===(O)');
  console.log('       \\/\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\'\\/');
  console.log('        -------------------------------------------------------');
}
function styleTitle() {
  headTailTitle();
  console.log('        (                                                      (');
  console.log('         )                                                      )');
  console.log('        (                                                      (');
  console.log('                       WELCOME TO THE HYRULE CASTLE                 ');
  console.log('        (                                                      (');
  console.log('         )                                                      )');
  console.log('        (                                                      (');
  headTailTitle();
}
export default function titleScreen() {
  styleTitle();
  if (getSave('resources/.saveFile.json') !== false) {
    const param: string[] = ['1', '2', 'new game', 'quit the game', '3', 'continue'];
    let res: string = readline.question('           1. New Game     2. Quit the game    3. Continue\n');
    while (param.indexOf(res.toLowerCase()) === -1) {
      res = readline.question('           1. New Game     2. Quit the game    3. Continue');
    }
    if (res === '1' || res.toLocaleLowerCase() === 'new game') {
      return 1;
    }
    if (res === '2' || res.toLocaleLowerCase() === 'quit the game') {
      return 2;
    }

    return 3;
  }

  const param: string[] = ['1', '2', 'new game', 'quit the game'];
  let res: string = readline.question('                   1. New Game     2. Quit the game\n');
  while (param.indexOf(res.toLowerCase()) === -1) {
    res = readline.question('                   1. New Game     2. Quit the game');
  }
  if (res === '1' || res.toLocaleLowerCase() === 'new game') {
    return 1;
  }
  return 2;
}
export function difficulty() {
  console.clear();
  console.log('choose the difficulty :');
  let res: string = readline.question('1. Normal\n2. Hard (enemy hit at 1.5 of their normal strength)\n3. Insane (enemy hit at 2 of their normal strength)\n');
  while (res !== '1' && res !== '2' && res !== '3') {
    res = readline.question('choose the number of the difficulty !');
  }
  let diffModifier = 1;
  switch (res) {
    case '2': {
      diffModifier = 1.5;
      break;
    }
    case '3': {
      diffModifier = 2;
      break;
    }
    default: {
      break;
    }
  }
  return diffModifier;
}
export function setFloor() {
  console.clear();
  console.log('choose the number of floor:');
  let res: string = readline.question('- 10\n- 20\n- 50\n- 100\n');
  while (res !== '10' && res !== '20' && res !== '50' && res !== '100') {
    res = readline.question('Choose between the correct options\n10.\n20.\n50.\n100.\n');
  }
  console.clear()
  return res;
}
