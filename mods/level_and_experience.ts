import Entity from './entity';

export interface Level {
  expToLvlUp: number,
  level: number,
  currentExp: number
}
function levelUp(lvl: Level, player: Entity) {
  const forbiddenProp: string[] = ['id', 'name', 'hp', 'mp', 'rarity', 'class', 'race'];
  console.log('========== LEVEL UP ==========\n');
  console.log(`Level up ! ${player.name} is now level ${lvl.level}`);
  let randomProp: string = Object
    .keys(player)[Math.floor(Math.random() * Object.keys(player).length)];
  while (forbiddenProp.indexOf(randomProp) !== -1) {
    randomProp = Object.keys(player)[Math.floor(Math.random() * Object.keys(player).length)];
  }
  let random: number = 1;
  switch (randomProp) {
    case 'maxhp': {
      random = Math.floor(Math.random() * (10 - 5 + 1) + 5);
      player.maxhp += random;
      player.hp = player.maxhp;
      break;
    }
    case 'maxmp': {
      random = Math.floor(Math.random() * (10 - 5 + 1) + 5);
      player.maxmp += random;
      player.mp = player.maxmp;
      break;
    }
    case 'str': {
      random = Math.floor(Math.random() * (5 - 1 + 1) + 1);
      player.str += random;
      break;
    }
    case 'spd': {
      random = Math.floor(Math.random() * (5 - 1 + 1) + 1);
      player.spd += random;
      break;
    }
    case 'def': {
      random = Math.floor(Math.random() * (5 - 1 + 1) + 1);
      player.def += random;
      break;
    }
    case 'luck': {
      random = Math.floor(Math.random() * (5 - 1 + 1) + 1);
      player.luck += random;
      break;
    }
    default: {
      random = Math.floor(Math.random() * (5 - 1 + 1) + 1);
      player.res += random;
      break;
    }
  }
  console.log(`${player.name} gain +${random} in ${randomProp} !\n`);
}
export function setExp(lvl: Level, player: Entity) {
  const randomExp: number = Math.floor(Math.random() * (50 - 15 + 1) + 15);
  lvl.currentExp += randomExp;
  console.log('\n========== EXP ==========\n');
  console.log(`${player.name} gains ${randomExp} exp\n`);
  if (lvl.currentExp > lvl.expToLvlUp) {
    lvl.level += 1;
    lvl.currentExp -= lvl.expToLvlUp;
    levelUp(lvl, player);
  }
}
