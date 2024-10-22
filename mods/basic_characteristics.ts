import Entity, { readJSON } from "./entity";
import { getNameClass } from "./magic_skills";
const readline = require('readline-sync')
function getNameRace(player: Entity) {
    const classes = readJSON('resources/races.json')
    for (let i = 0; i < classes.length; i += 1) {
        if (classes[i].id === player.race) {
            return classes[i].name
        }
    }
    return false;
}
export function getCharacter(player: Entity) {
    console.log(`${player.name}: ${getNameRace(player)}, ${getNameClass(player)}`)
    console.log('===========')
    console.log(`HP: ${player.hp} / ${player.maxhp} | MP: ${player.mp} / ${player.maxmp}`)
    console.log('===========')
    console.log(`Def: ${player.def} | Res: ${player.res}`)
    console.log('===========')
    console.log(`Speed: ${player.spd}`)
    console.log(`Luck: ${player.luck}`)
    console.log('===========')
    readline.question('press anything to continue')
}