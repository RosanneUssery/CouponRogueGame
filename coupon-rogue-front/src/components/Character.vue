<template>
    <div class="flex-container">
        <div class="flex-container column">
            <img :src="characterAvatar" alt="avatar" class="avatar"/>
        </div>
        <div class="flex-container row">
            <div class="column">Name: {{characterName}}</div>
            <div class="column">Level: {{characterLevel}}</div>
            <div class="column">Health: {{characterHealth}}</div>
            <div class="column">Discount: {{characterDiscount}}</div>
        </div>
    </div>
</template>

<script>
import characterAvatar from "../assets/cutelildude.png";
    export default {
        name: "Character",
        data: function () {
            return {
                characterAvatar: characterAvatar,
                characterName: "Reginald",
                characterLevel: 1,
                characterHealth: 25,
                characterDiscount: "3%"
            }
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style scoped>
    .flex-container {
        display: flex;
    }
    .column {
        flex-direction: column;
        justify-content: space-around;
        margin: 10px;
    }

    .row {
        flex-direction: row;
        justify-content: space-around;
    }
    .avatar {
        height: 150px;
        width: 100px;
    }
</style>