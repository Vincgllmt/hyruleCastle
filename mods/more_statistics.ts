import { msleep } from "./combat";
import Entity from "./entity";

const readline = require('readline-sync')
function handleTurnAttack(playerFirstTurn: boolean, enemy :Entity, player: Entity ) {
    const dodge = player.spd - enemy.spd
    const randomDodge = Math.floor(Math.random() * (100 - 1 + 1) + 1)
    if (playerFirstTurn) {
        const random = Math.floor(Math.random() * (100 - 1 + 1) + 1)
        if (random <= player.luck) {
            console.log(`CRITICAL HIT | You attack the ${enemy.name} ! Dealing ${(player.str * 2) - enemy.def} of damage !! `)
            enemy.hp -= (player.str * 2) - enemy.def
        }
        else {
            console.log(`You attack the ${enemy.name} ! Dealing ${player.str - enemy.def} of damage !!\n`)
            enemy.hp -= player.str - enemy.def
        }
        if (enemy.hp > 0) {
            if (randomDodge <= dodge) {
                console.log("You dodged !!!")
            }
            else {
                player.hp -= enemy.str - player.def
                console.log(`the ${enemy.name} attack ! You lost ${enemy.str - player.def} hp !`)
            }
        }
    }
    else {
        player.hp -= enemy.str - player.def
        console.log(`the ${enemy.name} attack ! You lost ${enemy.str} hp !`)
        if (player.hp > 0) {
            const random = Math.floor(Math.random() * (100 - 1 + 1) + 1)
            if (random <= player.luck) {
                console.log(`CRITICAL HIT | You attack the ${enemy.name} ! Dealing ${(player.str * 2) - enemy.def} of damage !! `)
                enemy.hp -= player.str * 2
            }
            else {
                console.log(`You attack the ${enemy.name} ! Dealing ${player.str - enemy.def} of damage !!\n`)
                enemy.hp -= player.str - enemy.def
            }
        }
    }
}
export default function handleTurn(response: string, enemy: Entity, player: Entity) {
    const param = ['attack', '1', '2', 'heal', '3', 'Protect', '4', 'Escape'];
    const playerFirstTurn = enemy.spd < player.spd
    const dodge = player.spd - enemy.spd
    const randomDodge = Math.floor(Math.random() * (100 - 1 + 1) + 1)
    let continu = true;
    while (param.indexOf(response.toLowerCase()) === -1) {
        response = readline.question("Wrong, use an actual option !\n1. Attack      2. Heal\n")
    }
    switch (response) {
        case '1':
        case 'attack': {
            handleTurnAttack(playerFirstTurn, enemy, player)
            break;
        }
        case '3':
        case 'protect': {
            const newDamage = Math.floor(enemy.str - enemy.str * (player.def / 100))
            console.log(`You protect ! the ${enemy.name} deals ${newDamage} of damage\n`)
            player.hp -= newDamage - player.def
            break;
        }
        case '4':
        case 'escape': {
            if (playerFirstTurn) {
                console.log(`You escaped...\n`)
                continu = false;
            }
            else {
                player.hp -= enemy.str
                console.log(`the ${enemy.name} attack before you leave ! You lost ${enemy.str - player.def} hp !`)
                if (player.hp > 0) {
                    console.log(`You escaped...\n`)
                    continu = false;
                }
            }
            break;
        }
        default: {
            console.log(`You healed yourself !!\n`)
            player.hp += (player.maxhp / 2)
            const diff = player.hp - player.maxhp
            if (player.hp > player.maxhp) {
                player.hp -= diff
            }
            if (randomDodge <= dodge) {
                console.log(`you dodged !!!`)
            }
            else {
                player.hp -= enemy.str - player.def
                console.log(`the ${enemy.name} attack ! You lost ${enemy.str - player.def} hp !`)
            }
            break;
        }
    }
    msleep(500)
    return continu
}