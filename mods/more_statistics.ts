import { getCharacter, getStrongest, getWeakness } from "./basic_characteristics";
import { msleep } from "./combat";
import Entity from "./entity";
import { loadSkill, showSkills, Skill } from "./magic_skills";

const readline = require('readline-sync')
function attack(caster: Entity, target: Entity) {
    let attack = caster.str
    const weakRace = getWeakness(caster, 1)
    const strengthRace = getStrongest(caster, 1)
    const weakClass = getWeakness(caster, 2)
    const strengthClass = getStrongest(caster, 2)
    let weak = false;
    let strong = false;
    let luck = false;
    const dodge = caster.spd - target.spd
    let dodgePossible = false;
    const randomDodge = Math.floor(Math.random() * (100 - 1 + 1) + 1)
    const randomCrit = Math.floor(Math.random() * (100 - 1 + 1) + 1)
    // weakRace
    if (weakRace.includes(target.race)) {
        attack = attack / 2
        weak = true
    }
    // weakClass
    if (weakClass.includes(target.class)) {
        attack = attack / 2
        weak = true
    }
    // strengthRace
    if (strengthRace.includes(target.race)) {
        attack = attack * 2
        strong = true
    }
    // strengthRace
    if (strengthClass.includes(target.class)) {
        attack = attack * 2
        strong = true
    }
    if (randomCrit <= target.luck) {
        luck = true
        attack = attack * 2
    }
    if (randomDodge <= dodge) {
        dodgePossible = true
    }
    if (dodgePossible !== true) {
        if (luck) {
            if (weak && !strong) {
                console.log(`${caster.name} make a glancing hit.. But with a crit !`)
            }
            if (!weak && strong) {
                console.log(`${caster.name} make a crushing hit and a crit !`)
            }
            console.log(`CRITICAL HIT | ${caster.name} attack the ${target.name} ! Dealing ${(attack) - target.def} of damage !! `)
            target.hp -= attack - target.def
        }
        else {
            if (weak && !strong) {
                console.log(`${caster.name} make a glancing hit..`)
            }
            if (!weak && strong) {
                console.log(`${caster.name} make a crushing hit !`)
            }
            console.log(`${caster.name} attack the ${target.name} ! Dealing ${(attack) - target.def} of damage.`)
            target.hp -= attack - target.def
        }
    }
    else {
        console.log(`${target.name} dodged !`)
    }
}
function skill(caster: Entity, target: Entity) {}
function handleTurnAttack(playerFirstTurn: boolean, enemy: Entity, player: Entity, difficulty: number) {
    enemy.str = Math.floor(enemy.str * difficulty)
    if (playerFirstTurn) {
        attack(player, enemy);
        if (enemy.hp > 0) {
            attack(enemy, player);
        } 
    }
    else {
        attack(enemy, player);
        if (enemy.hp > 0) {
            attack(player, enemy)
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
    const param = ['attack', '1', '2', 'skills', '3', 'protect', '4', 'escape', '5', 'character'];
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
        case '5':
        case 'character': {
            getCharacter(player)
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