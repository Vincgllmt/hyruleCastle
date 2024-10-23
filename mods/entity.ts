export default interface Entity {
  maxmp: any;
  id: number,
  name: string,
  hp: number,
  maxhp: number,
  mp: number
  str: number,
  def: number,
  res: number,
  spd: number,
  luck: number,
  rarity: number,
  class: number,
  race: number
}
const fs = require('fs');

export function readJSON(file: string) {
  const jsonFile: string = fs.readFileSync(file, 'utf8');
  return JSON.parse(jsonFile);
}
function getRarityAndArray(data: Entity[]) {
  const dataEntity: number[] = [];
  const random: number = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  let rarity = 1;
  if (random >= 51 && random <= 80) {
    rarity = 2;
  } else if (random >= 81 && random <= 95) {
    rarity = 3;
  } else if (random >= 96 && random <= 99) {
    rarity = 4;
  } else if (random === 100) {
    rarity = 5;
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].rarity === rarity) {
      dataEntity.push(data[i].id);
    }
  }
  if (dataEntity.length === 1) {
    return dataEntity[0];
  }

  return dataEntity[Math.floor(Math.random() * dataEntity.length)];
}
export function getRandomEntity(path: string) {
  const data: Entity[] = readJSON(path);
  const dataId = getRarityAndArray(readJSON(path));
  let entity: Entity = {
    name: '',
    id: 1,
    hp: 1,
    maxhp: 1,
    str: 1,
    mp: 1,
    spd: 1,
    def: 1,
    res: 1,
    rarity: 1,
    luck: 10,
    class: 1,
    maxmp: 1,
    race: 1,
  };
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === dataId) {
      entity = data[i];
    }
  }
  return entity;
}
