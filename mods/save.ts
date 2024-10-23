import Entity, { readJSON } from "./entity";
import { Level } from "./level_and_experience";

const readline = require('readline-sync')
const fs = require('fs')
export interface SaveFile {
    player: Entity,
    floor: number,
    difficulty: number,
    maxfloor: number,
    level: Level
}

export function save(player: Entity, index: number, difficulty: number, maxfloor: number, lvl: Level) {
    if (readline.keyInYN('Save and quit ?\n')) {
        const currentSave: SaveFile = {player: player, floor: index, difficulty, maxfloor, level: lvl}
        fs.writeFileSync('resources/.saveFile.json',`${JSON.stringify(currentSave)}`);
        return false;
    }
    else {
        return true;
    }
}
export function getSave(path: string) {
    try {
        const data = readJSON(path)
        return data;
    } catch (error) {
        return false;
    }
}