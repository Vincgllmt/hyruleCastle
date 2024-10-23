import Entity, { readJSON } from './entity';
import { getNameClass } from './magic_skills';

const readline = require('readline-sync');

export interface Race {
  id: number,
  name: string,
  strength: number[],
  weakness: number[]
}
export interface Classe {
  id: number,
  name: string,
  strengths: number[],
  weaknesses: number[]
}
function getNameRace(player: Entity) {
  const classes = readJSON('resources/races.json');
  for (let i = 0; i < classes.length; i += 1) {
    if (classes[i].id === player.race) {
      return classes[i].name;
    }
  }
  return false;
}
function getRace(player: Entity) {
  const races = readJSON('resources/races.json');
  for (let i = 0; i < races.length; i += 1) {
    if (races[i].id === player.race) {
      return races[i];
    }
  }
  return false;
}
function getClass(player: Entity) {
  const classes = readJSON('resources/classes.json');
  for (let i = 0; i < classes.length; i += 1) {
    if (classes[i].id === player.class) {
      return classes[i];
    }
  }
  return false;
}
export function getStrongest(player: Entity, index: number) {
  if (index === 1) {
    const race: Race = getRace(player);
    return race.strength;
  }
  const classe: Classe = getClass(player);
  return classe.strengths;
}
export function getWeakness(player: Entity, index: number) {
  if (index === 1) {
    const race: Race = getRace(player);
    return race.weakness;
  }
  const classe: Classe = getClass(player);
  return classe.weaknesses;
}
export function getCharacter(player: Entity) {
  console.log(`${player.name}: ${getNameRace(player)}, ${getNameClass(player)}`);
  console.log('===========');
  console.log(`HP: ${player.hp} / ${player.maxhp} | MP: ${player.mp} / ${player.maxmp}`);
  console.log('===========');
  console.log(`Def: ${player.def} | Res: ${player.res}`);
  console.log('===========');
  console.log(`Speed: ${player.spd}`);
  console.log(`Luck: ${player.luck}`);
  console.log('===========');
  readline.question('press anything to continue');
}
