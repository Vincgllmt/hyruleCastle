import Entity, { readJSON } from './entity';

const readline = require('readline-sync');

export interface Skill {
  id: number,
  name: string,
  cost: number,
  dmg: number,
  cooldown: number,
  class: string,
  effect: string
}
export function getNameClass(player: Entity) {
  const classes = readJSON('resources/classes.json');
  for (let i = 0; i < classes.length; i += 1) {
    if (classes[i].id === player.class) {
      return classes[i].name.toLowerCase();
    }
  }
  return false;
}
export function loadSkill(player: Entity) {
  const skillArray: Skill[] = [];
  const spells: Skill[] = readJSON('resources/spell.json');
  for (let i = 0; i < spells.length; i += 1) {
    if (spells[i].class.includes(';')) {
      const classes = spells[i].class.split(';');
      for (let c = 0; c < classes.length; c += 1) {
        if (classes[c] === getNameClass(player)) {
          skillArray.push(spells[i]);
        }
      }
    } else if (spells[i].class === getNameClass(player) || spells[i].class === '') {
      skillArray.push(spells[i]);
    }
  }
  return skillArray;
}
function getSkill(id: number) {
  const data: Skill[] = readJSON('resources/spell.json');
  let skill = data[1];
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === id) {
      skill = data[i];
    }
  }
  return skill;
}
function useSkill(param: string[], player: Entity) {
  let res: string = readline.question('What spell do you want to use ?(type "cancel" if you want to leave)\n');
  while (param.indexOf(res) === -1 && res.toLowerCase() !== 'cancel' && res !== '') {
    res = readline.question('Use the id of the spells that is shown !\nWhat spell do you want to use ?\n');
  }
  if (param.indexOf(res) !== -1 || res.toLowerCase() !== 'cancel') {
    if (res.toLowerCase() !== 'cancel' && res !== '') {
      let skill = getSkill(+res);
    while (player.mp < skill.cost && res !== 'cancel') {
      console.log(`can't use it ! No enough MP (${player.mp})`);
      res = readline.question('Use the id of the spells that is shown !\nWhat spell do you want to use ?\n');
      skill = getSkill(+res);
    }
    return skill;
    }
  }
  return false;
}
export function showSkills(spells: Skill[], player: Entity) {
  const param: string[] = [];
  console.log('========== SKILLS ==========')
  for (let i = 0; i < spells.length; i += 1) {
    console.log(`${spells[i].id}. ${spells[i].name}\n`);
    param.push(`${spells[i].id}`);
  }
  console.log('=============================')
  return useSkill(param, player)
}
