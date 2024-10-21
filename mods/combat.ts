import Entity from "./entity";
import handleTurn from "./more_statistics";

const readline = require('readline-sync')

export function msleep(n: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
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