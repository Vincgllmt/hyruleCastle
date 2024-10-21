import Entity, { getRandomEntity } from "./entity"
import combat, { bossCombat, msleep } from "./combat"

let player: Entity = getRandomEntity('resources/players.json')

function main() {
    let i = 1
    let stillAlive = true;
    let boss: Entity = getRandomEntity('resources/bosses.json')
    while (i <= 3 && stillAlive) {
        let enemy: Entity = getRandomEntity('resources/enemies.json')
        stillAlive = combat(i, enemy, player)
        i += 1;
    }
    if (stillAlive) {
        const stillAliveBoss = bossCombat(i, boss, player);
    if (stillAliveBoss) {
        msleep(500)
        console.log("Congratulations !! You win this game !")
    }
    else {
        msleep(500)
        console.log(`${boss.name} was too strong.. You need to retreat..`)
        console.log("Game Over...")
    }
    }
    else {
        console.log("Game Over...")
    }
    
    
}
main()