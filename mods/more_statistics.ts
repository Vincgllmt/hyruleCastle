import { getCharacter, getStrongest, getWeakness } from './basic_characteristics';
import { msleep } from './combat';
import Entity from './entity';
import { loadSkill, showSkills, Skill } from './magic_skills';

const readline = require('readline-sync');

function attack(caster: Entity, target: Entity) {
  let casterAttack = Math.floor(caster.str);
  const weakRace = getWeakness(caster, 1);
  const strengthRace = getStrongest(caster, 1);
  const weakClass = getWeakness(caster, 2);
  const strengthClass = getStrongest(caster, 2);
  let weak = false;
  let strong = false;
  let luck = false;
  const dodge = caster.spd - target.spd;
  let dodgePossible = false;
  const randomDodge = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  const randomCrit = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  // weakRace
  if (weakRace.includes(target.race)) {
    casterAttack /= 2;
    weak = true;
  }
  // weakClass
  if (weakClass.includes(target.class)) {
    casterAttack /= 2;
    weak = true;
  }
  // strengthRace
  if (strengthRace.includes(target.race)) {
    casterAttack *= 2;
    strong = true;
  }
  // strengthRace
  if (strengthClass.includes(target.class)) {
    casterAttack *= 2;
    strong = true;
  }
  if (randomCrit <= target.luck) {
    luck = true;
    casterAttack *= 2;
  }
  if (randomDodge <= dodge) {
    dodgePossible = true;
  }
  if (dodgePossible !== true) {
    if (weak && !strong) {
      console.log(`${caster.name} made a glancing hit.. !`);
    }
    if (!weak && strong) {
      console.log(`${caster.name} made a crushing hit !`);
    }
    if (casterAttack - target.def <= 0) {
      console.log(`${caster.name} is too weak to make a hit !`)
    }
    else {
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
  const weakRace = getWeakness(caster, 1);
  const strengthRace = getStrongest(caster, 1);
  const weakClass = getWeakness(caster, 2);
  const strengthClass = getStrongest(caster, 2);
  let weak = false;
  let strong = false;
  let luck = false;
  const dodge = caster.spd - target.spd;
  let dodgePossible = false;
  const randomDodge = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  const randomCrit = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  let spellAtk = spell.dmg;
  if (spell !== undefined && spell.dmg > 0) {
    // weakRace
    if (weakRace.includes(target.race)) {
      spellAtk /= 2;
      weak = true;
    }
    // weakClass
    if (weakClass.includes(target.class)) {
      spellAtk /= 2;
      weak = true;
    }
    // strengthRace
    if (strengthRace.includes(target.race)) {
      spellAtk *= 2;
      strong = true;
    }
    // strengthRace
    if (strengthClass.includes(target.class)) {
      spellAtk *= 2;
      strong = true;
    }
    if (randomCrit <= target.luck) {
      luck = true;
      spellAtk *= 2;
    }
    if (randomDodge <= dodge) {
      dodgePossible = true;
    }
    if (dodgePossible !== true) {
      if (weak && !strong) {
        console.log(`${caster.name} made a glancing hit..`);
      }
      if (!weak && strong) {
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
    caster.mp -= spell.cost
  } else if (spell !== undefined && spell.dmg !== 0) {
    const splitted = spell.effect.split('_');
    if (splitted[0].toLowerCase() === 'heal') {
      caster.hp += +splitted[1];
      const diff = caster.hp - caster.maxhp;
      if (diff > 0) {
        caster.hp -= diff;
      }
      console.log(`You healed of ${splitted[1]} hp !`);
      caster.mp -= spell.cost
    } else {
      caster.mp += +splitted[1];
      const diff = caster.mp - caster.maxmp;
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
  const playerFirstTurn = enemy.spd < player.spd;
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
export default function handleTurn(response: string, enemy: Entity, player: Entity) {
  const param = ['attack', '1', '2', 'skills', '3', 'protect', '4', 'escape', '5', 'character'];
  const playerFirstTurn = enemy.spd < player.spd;
  let continu = true;
  while (param.indexOf(response.toLowerCase()) === -1) {
    response = readline.question('Wrong, use an actual option !\n1. Attack      2. Skills\n');
  }
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
      getCharacter(player);
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
