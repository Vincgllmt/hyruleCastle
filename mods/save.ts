import Entity, { readJSON } from './entity';
import { Inventory } from './inventory';
import { Level } from './level_and_experience';

const readline = require('readline-sync');
const fs = require('fs');

export interface SaveFile {
  player: Entity,
  floor: number,
  difficulty: number,
  maxfloor: number,
  level: Level,
  inventory: Inventory
}

export function save(
  player: Entity,
  index: number,
  difficulty: number,
  maxfloor: number,
  lvl: Level,
  inventory: Inventory,
) {
  if (readline.keyInYN('Save and quit ?\n')) {
    const currentSave: SaveFile = {
      player, floor: index, difficulty, maxfloor, level: lvl, inventory,
    };
    fs.writeFileSync('resources/.saveFile.json', `${JSON.stringify(currentSave)}`);
    return false;
  }
  return true;
}
export function getSave(path: string) {
  try {
    const data = readJSON(path);
    return data;
  } catch (error) {
    return false;
  }
}
