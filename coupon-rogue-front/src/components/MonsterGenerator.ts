import store from "@/components/store";
import monsters from "@/components/monsters"

class MonsterGenerator {


    // the below function randomizes the attack/health of each encounter
    // which means that each encounter will be harder or easier depending
    randomizeAttack(attack: number) {
        return attack * (Math.ceil(Math.random() * 3))
    }
    
    randomizeHealth(health: number) {
        return health * (Math.ceil(Math.random() * 5))
    }
    
    determineMonster() {
        let lvl = store.state.dungeonLevel
        console.log("Monster level is " + lvl)
        let monsterName = monsters.returnMonster(lvl).name;
        console.log("Monster name is " + monsterName)
        let monsterAttack = this.randomizeAttack(monsters.returnMonster(lvl).attack)
        let monsterHealth = this.randomizeHealth(monsters.returnMonster(lvl).health)
        let monsterSymbol = monsters.returnMonster(lvl).symbol
        return [
            {
                name: monsterName,
                attack: monsterAttack,
                health: monsterHealth,
                sigil: monsterSymbol
            }
        ]
    }
}

export default MonsterGenerator