const fs = require("fs");
export function readJSON(file: string) {
    const jsonFile: string = fs.readFileSync(file, 'utf8');
    return JSON.parse(jsonFile)
}
export default interface Entity {
    id: number,
    name: string,
    hp: number,
    maxhp: number,
    str: number,
    rarity: number
}
function getRarityAndArray(data: Entity[]) {
    let dataEntity: number[] = []
    const random: number = Math.floor(Math.random() * (100 - 1 + 1) + 1)
    let rarity = 0
    switch (random <= 100) {
        case random <= 50: {
            rarity = 1
        }
        case random <= 80 && random >= 51: {
            rarity = 2
        }
        case random >= 81 && random <= 95: {
            rarity = 3
        }
        case random >= 96 && random <= 99: {
            rarity = 4
        }
        default: {
            rarity = 5
        }
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].rarity === rarity) {
                dataEntity.push(data[i].id)
            }
        }
    }
    return dataEntity
}
export function getRandomEntity(path: string) {
    const data: Entity[] = readJSON(path);
    let dataId = getRarityAndArray(readJSON(path));
    let entity: Entity = {name: "", id: 1, hp: 1, maxhp: 1, str: 1, rarity: 1}
    const entityId = dataId[Math.floor(Math.random() * data.length)];
    for (let i = 0; i < data.length; i += 1) {
        if (data[i].id === entityId) {
            entity = data[i]
        }
    }
    return entity
    
}
console.log(getRandomEntity('resources/bosses.json'))