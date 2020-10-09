<template>
  <div id="app" class="flex-container column center-align-items">
    <div>Welcome to Dungeon Level {{dungeonLevel}}</div>
    <div class="time">{{ time }}ms</div>
    <div class="flex-container column">
      <div class="flex-container row center-align-items">
          <p>Discount Percentage (attack)</p>
          <p>Dungeon Level</p>
          <p>Hit Points</p>
      </div>
      <div class="maze-container">
         <maze
          @start="onStart"
          @finish="onFinish"
          @init="onInit"
          :style="mazeStyle"
        ></maze>
        </div>
      <div> <monsters></monsters></div>
      <div> <combat-log></combat-log> </div>
      <div> <character></character> </div>
    </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Maze from "./components/Maze.vue";
import CombatLog from "./components/CombatLog.vue";
import Character from "./components/Character.vue";
import Monsters from "./components/Monsters.vue"
import store from "./components/store"

type Strategy = "cluster";
@Component({
  components: {
    Maze,
    CombatLog,
    Character,
    Monsters
  }
})
export default class App extends Vue {
  mazeStyle = {
    width: "600px",
    height: "300px"
  }

  dungeonLevel = store.state.dungeonLevel
  startTime = 0
  time = 0
  strategy: Strategy = "cluster"
  onStart() {
    this.startTime = Date.now()
  }
  onFinish() {
    this.time = Date.now() - this.startTime
  }
  onInit() {
    this.startTime = 0
    this.increment()
  }
  increment() {
     store.commit("increment")
     this.dungeonLevel = store.state.dungeonLevel
     console.log("Updating dungeon level to " + store.state.dungeonLevel)
     console.log("Dungeon level in App.vue is " + this.dungeonLevel)
  }
}

</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.maze-container {
  width: 600px;
  height: 300px;
}

.flex-container {
  display: flex;
}

.center-align-items {
    align-items: center;
}
.column {
  flex-direction: column;
}

.row {
  flex-direction: row;
  justify-content: center;
}

.maze {
  width: 100%;
  height: 100%;
}
</style>