import Entity, { readJSON } from './entity';
import { Level } from './level_and_experience';

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
export function getRace(player: Entity): Race {
  const races: Race[] = readJSON('resources/races.json');
  for (let i = 0; i < races.length; i += 1) {
    if (races[i].id === player.race) {
      return races[i];
    }
  }
  return races[0];
}
export function getClass(player: Entity): Classe {
  const classes: Classe[] = readJSON('resources/classes.json');
  for (let i = 0; i < classes.length; i += 1) {
    if (classes[i].id === player.class) {
      return classes[i];
    }
  }
  return classes[0];
}
export function getStrongest(player: Entity, index: number): number[] {
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
export function getCharacter(player: Entity, lvl: Level) {
  console.log(`${player.name}: ${getRace(player).name}`);
  console.log(`${getClass(player).name} level ${lvl.level}`);
  console.log('====================================');
  console.log(`HP: ${player.hp} / ${player.maxhp} | MP: ${player.mp} / ${player.maxmp}`);
  console.log('====================================');
  console.log(`Def: ${player.def} | Res: ${player.res} | Str: ${player.str}`);
  console.log('====================================');
  console.log(`Speed: ${player.spd}`);
  console.log(`Luck: ${player.luck}`);
  console.log('====================================');
  readline.question('press anything to continue\n');
}
