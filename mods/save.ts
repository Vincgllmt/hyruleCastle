import Entity, { readJSON } from "./entity";

const readline = require('readline-sync')
const fs = require('fs')
export interface SaveFile {
    player: Entity,
    floor: number,
    difficulty: number,
    maxfloor: number
}

export function save(player: Entity, index: number, difficulty: number, maxfloor: number) {
    if (readline.keyInYN('Save and quit ? (Y/N)\n')) {
        const currentSave = {player: player, floor: index, difficulty, maxfloor}
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