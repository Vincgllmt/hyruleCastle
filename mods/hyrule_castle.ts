import Entity, { getRandomEntity } from './entity';
import combat, { bossCombat, getEnemyDifficulty, msleep } from './combat';
import titleScreen, { difficulty, setFloor } from './basic_game_customization';
import { getSave, save, SaveFile } from './save';
import { Level, setExp } from './level_and_experience';
import characterCreation from './character_creation';
import { getItem, Inventory } from './inventory';

const fs = require('fs');

const player: Entity = characterCreation();
const inventory: Inventory = {content: []}
const lvl : Level = { expToLvlUp: 50, level: 1, currentExp: 0 };
function continueGame(savefile: SaveFile) {
  const challenge: number = savefile.difficulty;
  const maxFloor: number = savefile.maxfloor;
  let i: number = savefile.floor + 1;
  let stillAlive: boolean = true;
  let stillAliveBoss: boolean = true;
  let next: boolean = true;
  while (i <= maxFloor && stillAlive && stillAliveBoss) {
    if (i % 10 === 0) {
      const boss: Entity = getEnemyDifficulty(getRandomEntity('resources/bosses.json'), challenge);
      stillAliveBoss = bossCombat(i, boss, savefile.player, lvl, inventory);
      if (stillAliveBoss) {
        next = save(savefile.player, i, challenge, maxFloor, lvl);
        if (next) {
          console.log('Congratulations !! Moving to the next floor..');
          i += 1;
        }
      } else {
        msleep(500);
        console.log(`${boss.name} was too strong.. You need to retreat..`);
      }
    } else {
      const enemy: Entity = getEnemyDifficulty(getRandomEntity('resources/enemies.json'), challenge);
      stillAlive = combat(i, enemy, savefile.player, lvl, inventory);
      if (stillAlive) {
        next = save(savefile.player, i, challenge, maxFloor, lvl);
        if (next) {
          console.log('You win ! Moving to the next floor...');
          i += 1;
        }
      }
    }
    if (!next) {
      console.log("let's continue another day..");
      break;
    }
  }
  if (stillAlive && stillAliveBoss && next) {
    console.log('You conquered all the floors ! Good job !');
    fs.rmSync('resources/.saveFile.json');
  } else if (!stillAlive || !stillAliveBoss) {
    console.log('Game Over...');
    fs.rmSync('resources/.saveFile.json');
  }
}
function main() {
  const challenge: number = difficulty();
  const maxFloor: number = +setFloor();
  let i: number = 1;
  let stillAlive: boolean = true;
  let stillAliveBoss: boolean = true;
  let next = true;
  while (i <= maxFloor && stillAlive && stillAliveBoss) {
    if (i % 10 === 0) {
      const boss: Entity = getEnemyDifficulty(getRandomEntity('resources/bosses.json'), challenge);
      stillAliveBoss = bossCombat(i, boss, player, lvl, inventory);
      if (stillAliveBoss) {
        setExp(lvl, player);
        getItem(inventory);
        next = save(player, i, challenge, maxFloor, lvl);
        if (next) {
          console.log('Congratulations !! Moving to the next floor..');
          i += 1;
        }
      } else {
        msleep(500);
        console.log(`${boss.name} was too strong.. You need to retreat..`);
      }
    } else {
      const enemy: Entity = getEnemyDifficulty(getRandomEntity('resources/enemies.json'), challenge);
      stillAlive = combat(i, enemy, player, lvl, inventory);
      if (stillAlive) {
        setExp(lvl, player);
        getItem(inventory);
        next = save(player, i, challenge, maxFloor, lvl);
        if (next) {
          console.log('You win ! Moving to the next floor...');
          i += 1;
        }
      }
    }
    if (!next) {
      console.log("let's continue another day..");
      break;
    }
  }
  if (stillAlive && stillAliveBoss && next) {
    console.log('You conquered all the floors ! Good job !');
  } else if ((!stillAlive || !stillAliveBoss)) {
    console.log('Game Over...');
  }
}
const title = titleScreen();

if (title === 1) {
  main();
} else if (title === 3) {
  continueGame(getSave('resources/.saveFile.json'));
}
