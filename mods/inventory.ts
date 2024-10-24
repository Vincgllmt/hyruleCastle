import Entity, { getRarityAndArray, readJSON } from './entity';

const rl = require('readline-sync');

export interface Item {
  id: number,
  name: string,
  desc: string,
  bigDesc: string,
  effect: string,
  rarity: number
}

export interface Inventory {
  content: Item[]
}
export function displayInventory(inventory: Inventory) {
  let count: number = 0;
  inventory.content.forEach((item) => {
    console.log(`${count} - ${item.name}\n"${item.desc}"\n${item.bigDesc}\n\n`);
    count += 1;
  });
}
export function getItem(inventory: Inventory) {
  const itemData: Item[] = readJSON('resources/items.json');
  const itemId: number = getRarityAndArray(itemData);
  let aItem: Item = {
    id: 0, name: '', desc: '', bigDesc: '', rarity: 1, effect: '',
  };
  console.log(itemId);
  for (let i = 0; i < itemData.length; i += 1) {
    if (itemData[i].id === itemId) {
      aItem = itemData[i];
    }
  }
  console.log(`${aItem.name} was found !`);
  inventory.content.push(aItem);
}
function itemEffect(effect: string, player: Entity, enemy: Entity) {
  const splitted = effect.split('_');
  switch (splitted[0]) {
    case 'heal': {
      player.hp += +splitted[1];
      console.log(`${player.name} healed !`);
      if (player.hp > player.maxhp) {
        player.hp -= (player.hp - player.maxhp);
      }
      break;
    }
    case 'attack': {
      console.log(`${player.name} attack ${enemy.name} !`);
      enemy.hp -= +splitted[1];
      break;
    }
    case 'strength': {
      player.str += +splitted[1];
      break;
    }
    case 'defense': {
      player.def += +splitted[1];
      break;
    }
    case 'speed': {
      player.spd += +splitted[1];
      break;
    }
    default: {
      player.luck += +splitted[1];
      break;
    }
  }
}
export function useInventoryItem(inventory: Inventory, player: Entity, enemy: Entity) {
  const param = [];
  for (let i = 0; i < inventory.content.length; i += 1) {
    param.push(`${i}`);
  }
  displayInventory(inventory);
  let res: string = rl.question('What do you want to use ?\n');
  while (param.indexOf(res) === -1 && res !== 'cancel') {
    res = rl.question('Use the id ! Or "cancel"\n');
  }
  if (res !== 'cancel') {
    console.log(`${inventory.content[+res].name} used !`);
    itemEffect(inventory.content[+res].effect, player, enemy);
    inventory.content.splice(+res, 1);
  }
}
