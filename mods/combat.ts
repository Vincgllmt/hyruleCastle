import Entity from './entity';
import { Inventory } from './inventory';
import { Level } from './level_and_experience';
import handleTurn from './more_statistics';

const readline = require('readline-sync');

export function msleep(n: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
export function getEnemyDifficulty(enemy: Entity, difficulty: number): Entity {
  return {
    name: enemy.name,
    id: enemy.id,
    hp: enemy.hp * difficulty,
    mp: enemy.mp * difficulty,
    maxhp: enemy.maxhp * difficulty,
    maxmp: enemy.maxmp * difficulty,
    str: enemy.str * difficulty,
    def: enemy.def * difficulty,
    res: enemy.res * difficulty,
    spd: enemy.spd * difficulty,
    luck: enemy.luck * difficulty,
    rarity: enemy.rarity,
    class: enemy.class,
    race: enemy.race,
  };
}
function handleHpAndMpDisplay(entity: Entity) {
  if (entity.hp <= (entity.maxhp / 2) && entity.hp > ((entity.maxhp / 2) / 2)) {
    console.log(`\x1b[33mHP: ${entity.hp} / ${entity.maxhp}\x1b[0m`);
    console.log(`\x1b[36mMP: ${entity.mp} / ${entity.maxmp}\x1b[0m\n`);
  } else if (entity.hp <= ((entity.maxhp / 2) / 2)) {
    console.log(`\x1b[31mHP: ${entity.hp} / ${entity.maxhp}\x1b[0m`);
    console.log(`\x1b[36mMP: ${entity.mp} / ${entity.maxmp}\x1b[0m\n`);
  } else {
    console.log(`HP: ${entity.hp} / ${entity.maxhp}`);
    console.log(`\x1b[36mMP: ${entity.mp} / ${entity.maxmp}\x1b[0m\n`);
  }
}
function combatDisplay(index: number, enemy: Entity, player: Entity) {
  console.log(`========== fight ${index} ==========`);
  console.log(`   \x1b[31m${enemy.name}\x1b[0m`);
  handleHpAndMpDisplay(enemy);
  console.log(`   \x1b[32m${player.name}\x1b[0m`);
  handleHpAndMpDisplay(player);
  console.log('========== YOUR TURN ==========\n');
}
export default function combat(index: number, enemy: Entity, player: Entity, lvl: Level, inventory: Inventory) {
  let continu: boolean = true;
  while (enemy.hp > 0 && player.hp > 0 && continu === true) {
    combatDisplay(index, enemy, player);
    const res: string = readline.question('1. Attack      2. Skills\n3. Protect     4. Escape\n5. Character   6. Inventory\n');
    continu = handleTurn(res, enemy, player, lvl, inventory);
    msleep(500);
  }
  if (enemy.hp <= 0 || continu === false) {
    console.log('you win ! Moving to the next floor...');
    msleep(500);
    return true;
  }

  console.log('You lose...');
  return false;
}
export function bossCombat(index: number, boss: Entity, player: Entity, lvl: Level, inventory: Inventory) {
  console.log('You feel a strong opponent ahead...');
  msleep(1000);
  console.log('Prepare to fight !!!');
  msleep(500);
  return combat(index, boss, player, lvl, inventory);
}
