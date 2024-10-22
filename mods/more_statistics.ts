import { msleep } from "./combat";
import Entity from "./entity";
import { loadSkill, showSkills, Skill } from "./magic_skills";

const readline = require('readline-sync')
function handleTurnAttack(playerFirstTurn: boolean, enemy: Entity, player: Entity, difficulty: number) {
    const enemyAtk = Math.floor(enemy.str * difficulty)
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
                player.hp -= enemyAtk - player.def
                console.log(`the ${enemy.name} attack ! You lost ${enemyAtk - player.def} hp !`)
            }
        }
    }
    else {
        player.hp -= enemyAtk - player.def
        console.log(`the ${enemy.name} attack ! You lost ${enemyAtk} hp !`)
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
function handleTurnSkills(player: Entity, enemy: Entity, spells: Skill[], difficulty: number) {
    const enemyAtk = Math.floor(enemy.str * difficulty)
    const playerFirstTurn = enemy.spd < player.spd
    const skill = showSkills(spells, player);
    if (skill !== undefined && skill.dmg > 0) {
        if (playerFirstTurn) {
            console.log(`Used ${skill.name} !\ndealed ${skill.dmg - enemy.res} damage !`)
            enemy.hp -= skill.dmg - enemy.res
            if (enemy.hp > 0) {
                console.log(`the ${enemy.name} attack ! You lost ${enemyAtk - player.def} hp !`)
                player.hp -= enemyAtk - player.def
                player.mp -= skill.cost
            }
        }
        else {
            console.log(`the ${enemy.name} attack ! You lost ${enemyAtk - player.def} hp !`)
            player.hp -= enemyAtk - player.def
            if (player.hp > 0) {
                console.log(`Used ${skill.name} !\ndealed ${skill.dmg - enemy.res} damage !`)
                enemy.hp -= skill.dmg - enemy.res
                player.mp -= skill.cost
            }
        }
    } 
    else if (skill !== undefined && skill.dmg !== 0) {
        const splitted = skill.effect.split('_')
        if (splitted[0].toLowerCase() === 'heal') {
            player.hp += +splitted[1]
            const diff = player.hp - player.maxhp
            if (diff > 0) {
                player.hp -= diff
            }
            console.log(`You healed of ${splitted[1]} hp !`)
            console.log(`the ${enemy.name} attack ! You lost ${enemyAtk - player.def} hp !`)
            player.hp -= enemyAtk - player.def
        }
        else {
            player.mp += +splitted[1]
            const diff = player.mp - player.maxmp
            if (diff > 0) {
                player.mp -= diff
            }
            console.log(`You restored of ${splitted[1]} mp !`)
            console.log(`the ${enemy.name} attack ! You lost ${enemyAtk - player.def} hp !`)
            player.hp -= enemyAtk - player.def
        }
    }

}
export default function handleTurn(response: string, enemy: Entity, player: Entity, difficulty: number) {
    const enemyAtk = Math.floor(enemy.str * difficulty)
    const param = ['attack', '1', '2', 'skills', '3', 'Protect', '4', 'Escape'];
    const playerFirstTurn = enemy.spd < player.spd
    let continu = true;
    while (param.indexOf(response.toLowerCase()) === -1) {
        response = readline.question("Wrong, use an actual option !\n1. Attack      2. Skills\n")
    }
    switch (response) {
        case '1':
        case 'attack': {
            handleTurnAttack(playerFirstTurn, enemy, player, difficulty)
            break;
        }
        case '3':
        case 'protect': {
            const newDamage = Math.floor((enemyAtk) - (enemyAtk) * (player.def / 100))
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
                player.hp -= enemyAtk
                console.log(`the ${enemy.name} attack before you leave ! You lost ${(enemyAtk) - player.def} hp !`)
                if (player.hp > 0) {
                    console.log(`You escaped...\n`)
                    continu = false;
                }
            }
            break;
        }
        default: {
            handleTurnSkills(player, enemy, loadSkill(player), difficulty)
            break;
        }
    }
    msleep(500)
    return continu
}