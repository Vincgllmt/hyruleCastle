import { Classe, getClass, getRace, Race } from './basic_characteristics';
import Entity, { getRandomEntity, readJSON } from './entity';

const rl = require('readline-sync');

function ShowAllRace() {
  const data: Race[] = readJSON('resources/races.json');
  data.forEach((race) => {
    if (race.id % 5 === 0) {
      console.log(`- ${race.id}. ${race.name}\n`);
    } else {
      console.log(`- ${race.id}. ${race.name}`);
    }
  });
}
function showAllClass() {
  const data: Classe[] = readJSON('resources/classes.json');
  data.forEach((classe) => {
    if (classe.id % 5 === 0) {
      console.log(`- ${classe.id}. ${classe.name}\n`);
    } else {
      console.log(`- ${classe.id}. ${classe.name}`);
    }
  });
}
function getCharacterSpec(player: Entity) {
  console.log(`name: ${player.name}`);
  console.log(`class: ${getClass(player).name}`);
  console.log(`race: ${getRace(player).name}`);
}
function addPointMpHp(player: Entity) {
  const random: number = Math.floor(Math.random() * (100 - 80 + 1) + 80);
  console.log(`You have ${random} points to put in MP/HP`);
  let res: string = rl.question('Choose the point you\'ll attribute on HP (the rest will be in MP)\n');
  while (+res > random || +res === 0) {
    res = rl.question('Choose the point you\'ll attribute on HP (the rest will be in MP)\n');
  }
  player.maxhp = +res;
  player.hp = +res;
  player.maxmp = random - +res;
  player.mp = random - +res;
}
function resetStat(player: Entity) {
  player.def = 0;
  player.str = 0;
  player.luck = 0;
  player.res = 0;
  player.spd = 0;
}
function handleChoice(response: string, player: Entity) {
  const splittedRes: string[] = response.split(' ');
  if (splittedRes.length === 2) {
    switch (splittedRes[0].toLowerCase()) {
      case 'strength': {
        player.str += +splittedRes[1];
        return true;
      }
      case 'defense': {
        player.def += +splittedRes[1];
        return true;
      }
      case 'resistance': {
        player.res += +splittedRes[1];
        return true;
      }
      case 'speed': {
        player.spd += +splittedRes[1];
        return true;
      }
      case 'luck': {
        player.luck += +splittedRes[1];
        return true;
      }
      default: {
        console.log('this spec doesn\'t exist');
        return false;
      }
    }
  }
  return false;
}
function addPoint(player: Entity) {
  let points: number = 59;
  let res: string;
  resetStat(player);
  console.log('you have 59 points to attribute in the other stats !');
  while (points > 0) {
    console.log(`strength: ${player.str}\ndefense: ${player.def}`);
    console.log(`resistance: ${player.res}\nspeed: ${player.spd}`);
    console.log(`luck: ${player.luck}`);
    console.log('you need to type : <spec> <numberOfPoints>\n');
    res = rl.question(`in what spec you want to add point ? (${points} remaining)\n`);
    while (!(/^\d+$/.test(res.split(' ')[1])) || +res.split(' ')[1] > points) {
      res = rl.question(`you need to type : <spec> <numberOfPoints>\nin what spec you want to add point ? (${points} remaining)`);
    }
    const nb: number = +res.split(' ')[1];
    if (handleChoice(res, player)) {
      points -= nb;
    }
    console.clear();
  }
}
export default function characterCreation(): Entity {
  const player: Entity = getRandomEntity('resources/players.json');
  if (rl.keyInYN('Do you want to create your own character ?')) {
    console.log('========== Character Creation ==========');
    player.name = rl.question('What is your name ? ');
    ShowAllRace();
    let response: number = rl.question('Choose your race (take the id) ');
    while (response < 0 || response > 17) {
      response = rl.question('Incorrect Id\nChoose your race (take the id) ');
    }
    console.clear();
    player.race = +response;
    showAllClass();
    response = rl.question('Choose your race (take the id) ');
    while (response < 0 || response > 9) {
      response = rl.question('Incorrect Id\nChoose your race (take the id) ');
    }
    player.class = +response;
    console.clear();
    getCharacterSpec(player);
    addPointMpHp(player);
    addPoint(player);
  }
  
  return player;
}


