<template>
  <div id="app">
    <div class="maze-container">
      <div class="time">{{ time }}ms</div>
      <maze
        @start="onStart"
        @finish="onFinish"
        @init="onInit"
        :style="mazeStyle"
      ></maze>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Maze from "./components/Maze.vue";
type Strategy = "cluster";
@Component({
  components: {
    Maze
  }
})
export default class App extends Vue {
  mazeStyle = {
    width: "40%",
    height: "30%"
  };
  startTime = 0;
  time = 0;
  strategy: Strategy = "cluster";
  onStart() {
    this.startTime = Date.now();
  }
  onFinish() {
    this.time = Date.now() - this.startTime;
  }
  onInit() {
    this.startTime = 0;
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
  position: absolute;
  width: 90%;
  height: 90%;
  margin: auto;
}
.maze {
  width: 100%;
  height: 100%;
}
</style>