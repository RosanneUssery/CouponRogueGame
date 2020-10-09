class monsters {

    static returnMonster(level: number) {
        return this.monsterArray[level-1]
    }

    private static monsterArray = [
        {
            name: "Dairy Destroyer",
            level: 1,
            attack: 2,
            health: 10,
            symbol: "D"
        },
        {
            name: "Bread Bandit",
            level: 2,
            attack: 4,
            health: 15,
            symbol: "B"
        },
        {
            name: "Meat Mangler",
            level: 3,
            attack: 6,
            health: 20,
            symbol: "M"
        },
        {
            name: "Pasta Pesterer",
            level: 4,
            attack: 8,
            health: 30,
            symbol: "P"
        },
        {
            name: "Vegetable Vixen",
            level: 5,
            attack: 10,
            health: 50,
            symbol: "V"
        },
        {
            name: "Snack Sorcerer",
            level: 6,
            attack: 15,
            health: 75,
            symbol: "S"
        },
        {
            name: "Frozen Forger",
            level: 7,
            attack: 20,
            health: 100,
            symbol: "F"
        }
    ]

}

export default monsters;