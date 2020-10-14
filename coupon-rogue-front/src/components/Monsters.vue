<template>
    <div>Monster for this level is: {{ printOutMonster() }}</div>
</template>

<script>
    import store from "./store"
    import Generator from "@/components/MonsterGenerator";

    export default {
        methods: {
            printOutMonster: function () {
                let lvl = store.state.dungeonLevel
                return new Generator().determineMonster(lvl)
            }
        }
    }
</script>

<style scoped>

</style>