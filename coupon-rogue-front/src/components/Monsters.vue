<template>
    <div>Monster for this level is: {{ printOutMonster() }}</div>
</template>

<script>
    import Generator from "@/components/MonsterGenerator";

    export default {
        methods: {
            printOutMonster: function () {
                return new Generator().determineMonster()
            }
        }
    }
</script>

<style scoped>

</style>