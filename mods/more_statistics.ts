import { getCharacter, getStrongest, getWeakness } from './basic_characteristics';
import { msleep } from './combat';
import Entity from './entity';
import { Inventory, useInventoryItem } from './inventory';
import { Level } from './level_and_experience';
import { loadSkill, showSkills, Skill } from './magic_skills';

const readline = require('readline-sync');

function getRealAttack(caster: Entity, target: Entity, spell: Skill | null | undefined) {
  let casterAttack: number = Math.floor(caster.str);
  if (spell !== null && spell !== undefined) {
   casterAttack = spell.dmg 
  }
  const weakRace: number[] = getWeakness(caster, 1);
  const strengthRace: number[] = getStrongest(caster, 1);
  const weakClass: number[] = getWeakness(caster, 2);
  const strengthClass: number[] = getStrongest(caster, 2);
  // weakRace
  if (weakRace.includes(target.race)) {
    casterAttack /= 2;
  }
  // weakClass
  if (weakClass.includes(target.class)) {
    casterAttack /= 2;
  }
  // strengthRace
  if (strengthRace.includes(target.race)) {
    casterAttack *= 2;
  }
  // strengthRace
  if (strengthClass.includes(target.class)) {
    casterAttack *= 2;
  }
  return casterAttack
}
function attack(caster: Entity, target: Entity) {
  let casterAttack = getRealAttack(caster, target, null)
  let luck: boolean = false;
  const dodge: number = caster.spd - target.spd;
  let dodgePossible: boolean = false;
  const randomDodge: number = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  const randomCrit: number = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  if (randomCrit <= target.luck) {
    luck = true;
    casterAttack *= 2;
  }
  if (randomDodge <= dodge) {
    dodgePossible = true;
  }
  if (dodgePossible !== true) {
    if (caster.str > casterAttack) {
      console.log(`${caster.name} made a glancing hit.. !`);
    }
    if (caster.str < casterAttack) {
      console.log(`${caster.name} made a crushing hit !`);
    }
    if (casterAttack - target.def <= 0) {
      console.log(`${caster.name} is too weak to make a hit !`);
    } else {
      target.hp -= casterAttack - target.def;
      if (luck) {
        console.log(`CRITICAL HIT | ${caster.name} attack the ${target.name} ! Dealing ${(casterAttack) - target.def} of damage !! `);
      } else {
        console.log(`${caster.name} attack ${target.name} ! Dealing ${(casterAttack) - target.def} of damage.`);
      }
    }
  } else {
    console.log(`${target.name} dodged !`);
  }
  msleep(250);
}
function skills(caster: Entity, target: Entity, spell: Skill) {
  let luck: boolean = false;
  const dodge: number = caster.spd - target.spd;
  let dodgePossible: boolean = false;
  const randomDodge: number = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  const randomCrit: number = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  let spellAtk: number = getRealAttack(caster, target, spell);
  if (spell !== undefined && spell.dmg > 0) {
    if (randomCrit <= target.luck) {
      luck = true;
      spellAtk *= 2;
    }
    if (randomDodge <= dodge) {
      dodgePossible = true;
    }
    if (dodgePossible !== true) {
      if (spellAtk < spell.dmg) {
        console.log(`${caster.name} made a glancing hit..`);
      }
      if (spellAtk > spell.dmg) {
        console.log(`${caster.name} made a crushing hit !`);
      }
      target.hp -= spellAtk - target.res;
      if (luck) {
        console.log(`CRITICAL HIT | ${caster.name} used ${spell.name} on ${target.name} ! Dealing ${spellAtk - target.res} of damage !! `);
      } else {
        console.log(`${caster.name} used ${spell.name} on ${target.name} ! Dealing ${spellAtk - target.res} of damage.`);
      }
    } else {
      console.log(`${target.name} dodged !`);
    }
    caster.mp -= spell.cost;
  } else if (spell !== undefined && spell.dmg !== 0) {
    const splitted = spell.effect.split('_');
    if (splitted[0].toLowerCase() === 'heal') {
      caster.hp += +splitted[1];
      const diff: number = caster.hp - caster.maxhp;
      if (diff > 0) {
        caster.hp -= diff;
      }
      console.log(`You healed of ${splitted[1]} hp !`);
      caster.mp -= spell.cost;
    } else {
      caster.mp += +splitted[1];
      const diff: number = caster.mp - caster.maxmp;
      if (diff > 0) {
        caster.mp -= diff;
      }
      console.log(`You restored of ${splitted[1]} mp !`);
    }
  }
  msleep(250);
}
function handleTurnAttack(playerFirstTurn: boolean, enemy: Entity, player: Entity) {
  if (playerFirstTurn) {
    attack(player, enemy);
    if (enemy.hp > 0) {
      attack(enemy, player);
    }
  } else {
    attack(enemy, player);
    if (enemy.hp > 0) {
      attack(player, enemy);
    }
  }
}
function handleTurnSkills(player: Entity, enemy: Entity, spells: Skill[]) {
  const playerFirstTurn: boolean = enemy.spd < player.spd;
  const skill = showSkills(spells, player);
  if (skill !== false) {
    if (playerFirstTurn) {
      skills(player, enemy, skill);
      if (enemy.hp > 0) {
        attack(enemy, player);
      }
    } else {
      attack(enemy, player);
      if (player.hp > 0) {
        skills(player, enemy, skill);
      }
    }
  }
}
export default function handleTurn(
  response: string,
  enemy: Entity,
  player: Entity,
  lvl: Level,
  inventory: Inventory,
) {
  const param: string[] = ['attack', '1', '2', 'skills', '3', 'protect', '4', 'escape', '5', 'character', '6', 'inventory'];
  const playerFirstTurn: boolean = enemy.spd < player.spd;
  let continu: boolean = true;
  while (param.indexOf(response.toLowerCase()) === -1) {
    response = readline.question('Wrong, use an actual option !\n1. Attack      2. Skills\n');
  }
  console.log('========== ACTION ==========\n');
  switch (response) {
    case '1':
    case 'attack': {
      handleTurnAttack(playerFirstTurn, enemy, player);
      break;
    }
    case '3':
    case 'protect': {
      const newDamage = Math.floor((enemy.str) - (enemy.str) * (player.def / 100));
      console.log(`You protect ! the ${enemy.name} deals ${newDamage} of damage\n`);
      player.hp -= newDamage - player.def;
      break;
    }
    case '4':
    case 'escape': {
      if (playerFirstTurn) {
        console.log('You escaped...\n');
        continu = false;
      } else {
        player.hp -= enemy.str;
        console.log(`the ${enemy.name} attack before you leave ! You lost ${(enemy.str) - player.def} hp !`);
        if (player.hp > 0) {
          console.log('You escaped...\n');
          continu = false;
        }
      }
      break;
    }
    case '5':
    case 'character': {
      getCharacter(player, lvl);
      break;
    }
    case '6':
    case 'inventory': {
      useInventoryItem(inventory, player, enemy);
      break;
    }
    default: {
      handleTurnSkills(player, enemy, loadSkill(player));
      break;
    }
  }
  msleep(500);
  return continu;
}
