import Entity from "./entity";
const readline = require('readline-sync')

export function msleep(n: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function handleTurn(response: string, enemy: Entity, player: Entity) {
    const param = ['attack', '1', '2', 'heal', '3', 'Protect', '4', 'Escape'];
    const playerFirstTurn = enemy.spd < player.spd
    const dodge = player.spd - enemy.spd
    let continu = true;
    while (param.indexOf(response.toLowerCase()) === -1) {
        response = readline.question("Wrong, use an actual option !\n1. Attack      2. Heal\n")
    }
    switch (response) {
        case '1':
        case 'attack': {
            if (playerFirstTurn) {
                console.log(`You attack the ${enemy.name} ! Dealing ${player.str} of damage !!\n`)
                enemy.hp -= player.str
                if (enemy.hp > 0) {
                    player.hp -= enemy.str
                    console.log(`the ${enemy.name} attack ! You lost ${enemy.str} hp !`)
                }
            }
            else {
                player.hp -= enemy.str
                console.log(`the ${enemy.name} attack ! You lost ${enemy.str} hp !`)
                if (player.hp > 0) {
                    console.log(`You attack the ${enemy.name} ! Dealing ${player.str} of damage !!\n`)
                    enemy.hp -= player.str
                }
            }
            break;
        }
        case '3':
        case 'protect': {
            const newDamage = Math.floor(enemy.str - enemy.str * (player.def / 100)) 
            console.log(`You protect ! the ${enemy.name} deals ${newDamage} of damage\n`)
            player.hp -= newDamage
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
                console.log(`the ${enemy.name} attack before you leave ! You lost ${enemy.str} hp !`)
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
            player.hp -= enemy.str
            break;
        }
    }
    msleep(500)
    return continu
}
function handleHpDisplay(entity: Entity) {
    if (entity.hp <= (entity.maxhp / 2) && entity.hp > ((entity.maxhp / 2) / 2)) {
        console.log(`\x1b[33mHP: ${entity.hp} / ${entity.maxhp}\x1b[0m\n`)
    }
    else if (entity.hp <= ((entity.maxhp / 2) / 2)) {
        console.log(`\x1b[31mHP: ${entity.hp} / ${entity.maxhp}\x1b[0m\n`)
    }
    else {
        console.log(`HP: ${entity.hp} / ${entity.maxhp}\n`)
    }
}
function combatDisplay(index: number, enemy: Entity, player: Entity) {
    console.log(`========== fight ${index} ==========`)
    console.log(`\x1b[31m${enemy.name}\x1b[0m`)
    handleHpDisplay(enemy)
    console.log(`\x1b[32m${player.name}\x1b[0m`)
    handleHpDisplay(player)
    console.log(`---YOUR TURN---\n`)
}
export default function combat(index: number, enemy: Entity, player: Entity) {
    let continu = true
    while (enemy.hp > 0 && player.hp > 0 && continu === true) {
        combatDisplay(index, enemy, player);
        let res = readline.question("1. Attack      2. Heal\n3. Protect     4. Escape\n")
        continu = handleTurn(res, enemy, player)
        msleep(500);
    }
    if (enemy.hp <= 0 || continu == false) {
        console.log("you win ! Moving to the next floor...")
        msleep(500)
        return true
    }
    else {
        console.log("You lose...")
        return false
    }
}
export function bossCombat(index: number, boss: Entity, player: Entity) {
    console.log("You feel a strong opponent ahead...")
    msleep(1000)
    console.log("Prepare to fight !!!")
    msleep(500)
    return combat(index, boss, player)
}