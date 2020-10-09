<template>
    <div>Monster for this level is: {{ determineMonster() }}</div>
</template>

<script>
    import store from "./store"
    export default {
        name: "Monsters",
        // props: ["dungeonLevel"],
        data() {
            return {
                dungeonLevel: 0
            }
        },
        methods: {
            // the below function randomizes the attack/health of each encounter
            // which means that each encounter will be harder or easier depending
            randomizeAttack(attack) {
                return attack * (Math.ceil(Math.random() * 3))
            },
            randomizeHealth(health) {
                return health * (Math.ceil(Math.random() * 5))
            },
            determineMonster() {
                let lvl = store.state.dungeonLevel
                console.log("Monster level is " + lvl)
                let monsterName = bossMonsters[lvl-1].name
                let monsterAttack = this.randomizeAttack(bossMonsters[lvl-1].attack)
                let monsterHealth = this.randomizeHealth(bossMonsters[lvl-1].health)
                return [
                    {
                        name: monsterName,
                        attack: monsterAttack,
                        health: monsterHealth
                    }
                ]
            }
        }
    }
    const bossMonsters = [
        {
            name: "Dairy Destroyer",
            level: 1,
            attack: 2,
            health: 10
        },
        {
            name: "Bread Bandit",
            level: 2,
            attack: 4,
            health: 15
        },
        {
            name: "Meat Mangler",
            level: 3,
            attack: 6,
            health: 20
        },
        {
            name: "Pasta Pesterer",
            level: 4,
            attack: 8,
            health: 30
        },
        {
            name: "Vegetable Vixen",
            level: 5,
            attack: 10,
            health: 50
        },
        {
            name: "Snack Sorcerer",
            level: 6,
            attack: 15,
            health: 75
        },
        {
            name: "Frozen Forger",
            level: 7,
            attack: 20,
            health: 100
        }
    ]

</script>

<style scoped>

</style>