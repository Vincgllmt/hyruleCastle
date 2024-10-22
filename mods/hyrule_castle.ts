import Entity, { getRandomEntity } from "./entity"
import combat, { bossCombat, msleep } from "./combat"
import titleScreen, { difficulty, setFloor } from "./basic_game_customization";

let player: Entity = getRandomEntity('resources/players.json')

function main() {
    if (titleScreen()) {
        const challenge = difficulty();
        const maxFloor = +setFloor()
        let i = 1
        let stillAlive = true;
        let stillAliveBoss = true;
        let boss: Entity = getRandomEntity('resources/bosses.json')
        while (i <= maxFloor && stillAlive && stillAliveBoss) {
            if (i % 10 === 0 ) {
                stillAliveBoss = bossCombat(i, boss, player, challenge);
                if (stillAliveBoss) {
                    console.log("Congratulations !! Moving to the next floor..")
                    i += 1;
                }
                else {
                    msleep(500)
                    console.log(`${boss.name} was too strong.. You need to retreat..`)
                }
            }
            else {
                let enemy: Entity = getRandomEntity('resources/enemies.json')
                stillAlive = combat(i, enemy, player, challenge)
                i += 1;
            }
        }
        if (stillAlive && stillAliveBoss) {
            console.log('You conquered all the floors ! Good job !')
        }
        else {
            console.log("Game Over...")
        }
    }
}
main()