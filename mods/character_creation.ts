import { Classe, Race } from "./basic_characteristics";
import Entity, { getRandomEntity, readJSON } from "./entity";
import { getNameClass } from "./magic_skills";

const rl = require('readline-sync')
function ShowAllRace() {
    const data: Race[] = readJSON('resources/races.json');
    data.forEach(race => {
        if (race.id % 5 === 0) {
            console.log(`- ${race.id}. ${race.name}\n`)
        }
        else {
            console.log(`- ${race.id}. ${race.name}`)
        }
    });
}
function showAllClass() {
    const data: Classe[] = readJSON('resources/classes.json');
    data.forEach(classe => {
        if (classe.id % 5 === 0) {
            console.log(`- ${classe.id}. ${classe.name}\n`)
        }
        else {
            console.log(`- ${classe.id}. ${classe.name}`)
        }
    });
}
export function getNameRace(player: Entity) {
    const races = readJSON('resources/races.json');
    for (let i = 0; i < races.length; i += 1) {
      if (races[i].id === player.race) {
        return races[i].name;
      }
    }
    return false;
}
function getCharacterSpec(player: Entity) {
    console.log(`name: ${player.name}`)
    console.log(`class: ${getNameClass(player)}`)
    console.log(`race: ${getNameRace(player)}`)
}
export default function characterCreation() {
    let player = getRandomEntity('resources/players.json');
    if (rl.keyInYN('Do you want to create your own character ?')) {
        console.log("========== Character Creation ==========")
        player.name = rl.question('What is your name ? ')
        ShowAllRace()
        let response = rl.question('Choose your race (take the id) ')
        while (response < 0 || response > 17) {
            response = rl.question('Incorrect Id\nChoose your race (take the id) ')
        }
        console.clear()
        player.race = +response
        showAllClass()
        response = rl.question('Choose your race (take the id) ')
        while (response < 0 || response > 9) {
            response = rl.question('Incorrect Id\nChoose your race (take the id) ')
        }
        player.class = +response
        console.clear()
    }
    getCharacterSpec(player)
    //return player
}
characterCreation()