import Entity, { getRandomEntity } from './entity';
import combat, { bossCombat, getEnemyDifficulty, msleep } from './combat';
import titleScreen, { difficulty, setFloor } from './basic_game_customization';
import { getSave, save, SaveFile } from './save';
import { Level, setExp } from './level_and_experience';
import characterCreation from './character_creation';

const fs = require('fs');

const player: Entity = characterCreation();
const lvl : Level = { expToLvlUp: 50, level: 1, currentExp: 0 };
function continueGame(savefile: SaveFile) {
  const challenge = savefile.difficulty;
  const maxFloor = savefile.maxfloor;
  let i = savefile.floor + 1;
  let stillAlive = true;
  let stillAliveBoss = true;
  let next = true;
  while (i <= maxFloor && stillAlive && stillAliveBoss) {
    if (i % 10 === 0) {
      const boss: Entity = getEnemyDifficulty(getRandomEntity('resources/bosses.json'), challenge);
      stillAliveBoss = bossCombat(i, boss, savefile.player);
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
      stillAlive = combat(i, enemy, savefile.player);
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
  const challenge = difficulty();
  const maxFloor = +setFloor();
  let i = 1;
  let stillAlive = true;
  let stillAliveBoss = true;
  let next = true;
  while (i <= maxFloor && stillAlive && stillAliveBoss) {
    if (i % 10 === 0) {
      const boss: Entity = getEnemyDifficulty(getRandomEntity('resources/bosses.json'), challenge);
      stillAliveBoss = bossCombat(i, boss, player);
      if (stillAliveBoss) {
        setExp(lvl, player);
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
      stillAlive = combat(i, enemy, player);
      if (stillAlive) {
        setExp(lvl, player);
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
