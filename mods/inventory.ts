import { getRarityAndArray, readJSON } from "./entity";

export interface item {
    id: number,
    name: string,
    desc: string,
    bigDesc: string,
    rarity: number
}

export interface Inventory {
    content: item[]
}
export function displayInventory(inventory: Inventory) {
    inventory.content.forEach(item => {
        console.log(`${item.name}\n"${item.desc}"\n${item.bigDesc}`)
    });
}
export function getItem(inventory: Inventory) {
    const itemData: item[] = readJSON('resources/items.json')
    const itemId: number = getRarityAndArray(inventory.content)
    let aItem: item = {id: 0, name: '', desc: '', bigDesc: '', rarity: 1}
    console.log(itemId)
    for (let i = 0; i < itemData.length; i += 1) {
        if (itemData[i].id === itemId) {
            aItem = itemData[i]
        }
    }
    console.log(`${aItem.name} was found !`)
    inventory.content.push(aItem)
}