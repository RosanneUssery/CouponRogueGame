<template>
  <div class="maze" tabindex="-1" @keydown="onKeyDown">
    <canvas ref="mazeCanvas" :width="width" :height="height"></canvas>
    <canvas ref="goalCanvas" :width="width" :height="height"></canvas>
    <canvas ref="monsterCanvas" :width="width" :height="height"></canvas>
    <canvas
      ref="effectCanvas"
      :style="effectStyle"
      :width="width"
      :height="height"
    ></canvas>
    <canvas
      ref="playerCanvas"
      :width="width"
      :height="height"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousemove="onMouseMove"
    ></canvas>
    <div v-if="cache" :style="dotStyle"></div>
  </div>
</template>

<script>
import Vue from "vue"
import Maze from "./getMaze"
import imagePath from "../assets/cutelildude.png"
import goalImagePath from "../assets/boss.jpg"
import Renderer from "./Renderer"
import MonsterGenerator from "../components/MonsterGenerator"
// import store from "./store"
// TODO: select strategy method, not a class
const strategy = {
  cluster: Maze
}
export default {
  name: "maze",
  data() {
    return {
      cache: null,
      dotPos: {
        offsetX: null,
        offsetY: null
      },
      width: null,
      height: null,
      margin: 5,
      image: null,
      goalImage: null,
      maze: {
        bondH: [],
        bondV: [],
        goal: {
          x: null,
          y: null
        }
      },
      player: {
        id: "00",
        x: 0,
        y: 0
      },
      isFinished: false,
      seed: Date.now(),
    }
  },
  props: {
    imagePath: {
      default: imagePath,
      type: String
    },
    goalImagePath: {
      default: goalImagePath,
      type: String
    },
    strategy: {
      default: "cluster",
      type: String
    }
  },
  computed: {
    marginTop() {
      return (this.height - this.ly * this.cellHeight) / 2;
    },
    marginLeft() {
      return (this.width - this.lx * this.cellWidth) / 2;
    },
    cellWidth() {
      return 30;
    },
    cellHeight() {
      return 30;
    },
    lx() {
      return Math.max(
        1,
        Math.floor((this.width - this.margin * 2) / this.cellWidth)
      );
    },
    ly() {
      return Math.max(
        1,
        Math.floor((this.height - this.margin * 2) / this.cellHeight)
      );
    },
    effectStyle() {
      if (this.isFinished) {
        return {
          display: "inline"
        };
      }
      return {
        display: "none"
      };
    },
    dotStyle() {
      return {
        position: "absolute",
        backgroundColor: "black",
        height: "5px",
        width: "5px",
        opacity: 0.5,
        borderRadius: "50%",
        top: this.dotPos.offsetY + "px",
        left: this.dotPos.offsetX + "px"
      };
    }
  },
  mounted() {
    this.height = this.$el.offsetHeight - this.margin;
    this.width = this.$el.offsetWidth - this.margin;

    const image = new Image();
    image.addEventListener("load", () => {
      this.image = image;
    });
    image.src = this.imagePath;
    const goalImage = new Image();
    goalImage.addEventListener("load", () => {
      this.goalImage = goalImage;
    });
    goalImage.src = this.goalImagePath;
  },
  watch: {
    height() {
      this.renderMaze();
    },
    width() {
      this.renderMaze();
    },
    lx() {
      this.resetMaze();
    },
    ly() {
      this.resetMaze();
    },
    maze() {
      this.$emit("init");
      this.renderMaze();
    },
    player() {
      this.renderPlayer();
    },
    image() {
      this.renderPlayer();
    },
    goalImage() {
      this.renderGoal();
    },
    strategy() {
      this.$emit("init");
      this.resetMaze();
    },
    isFinished() {
      if (this.isFinished) {
        this.renderCongratulations();
        setTimeout(this.resetMaze, 3000);
      }
    }
  },
  methods: {
    onTouchStart(event) {
      event.preventDefault();
      event.stopPropagation();
      const touch = event.touches[0];
      this.cache = {};
      this.cache.rect = this.cache.avatarPosition = this.cache.originalPosition = Vue.set(
        this,
        "cache",
        {
          rect: touch.target.getBoundingClientRect(),
          avatarPosition: {
            x:
              this.player.x * this.cellWidth +
              this.marginLeft +
              this.cellWidth / 2,
            y:
              this.player.y * this.cellHeight +
              this.marginTop +
              this.cellHeight / 2
          },
          originalPosition: {
            x: touch.clientX,
            y: touch.clientY
          },
          pos: {
            offsetX: touch.clientX,
            offsetY: touch.clientY
          }
        }
      );
    },
    onTouchMove(event) {
      // For preventing "Pull to refresh" feature on Android
      event.preventDefault();
      event.stopPropagation();
      const touch = event.touches[0];
      const avatarPos = this.cache.avatarPosition;
      const originalPos = this.cache.originalPosition;
      Vue.set(this, "dotPos", {
        offsetX: touch.clientX - originalPos.x + avatarPos.x,
        offsetY: touch.clientY - originalPos.y + avatarPos.y
      });
      this.handleMove(this.dotPos);
    },
    onTouchEnd(event) {
      event.preventDefault();
      event.stopPropagation();
      this.cache = null;
    },
    onMouseMove(event) {
      this.handleMove(event);
    },
    handleMove(pos) {
      const offsetX = pos.offsetX;
      const offsetY = pos.offsetY;
      const x = Math.floor((offsetX - this.marginLeft) / this.cellWidth);
      const y = Math.floor((offsetY - this.marginTop) / this.cellHeight);
      const dx = x - this.player.x;
      const dy = y - this.player.y;
      if (Math.abs(dx) + Math.abs(dy) <= 2) {
        this.moveBy(dx, dy);
      }
    },
    onKeyDown(event) {
      switch (event.key) {
        case "ArrowLeft":
          this.goLeft();
          break;
        case "ArrowUp":
          this.goUp();
          break;
        case "ArrowRight":
          this.goRight();
          break;
        case "ArrowDown":
          this.goDown();
      }
    },
    goUp() {
      this.moveBy(0, -1);
    },
    goDown() {
      this.moveBy(0, 1);
    },
    goLeft() {
      this.moveBy(-1, 0);
    },
    goRight() {
      this.moveBy(1, 0);
    },
    moveBy(dx, dy) {
      const x = this.player.x + dx;
      const y = this.player.y + dy;
      this.moveTo(x, y);
    },
    canReach(fromX, fromY, toX, toY) {
      if (fromX === toX && fromY === toY) {
        return true;
      }
      const dx = toX > fromX ? 1 : -1;
      const dy = toY > fromY ? 1 : -1;
      const idxH =
        toX > fromX
          ? (this.lx + 1) * fromY + fromX + dx
          : (this.lx + 1) * fromY + fromX;
      const idxV =
        toY > fromY ? this.lx * (fromY + dy) + fromX : this.lx * fromY + fromX;
      if (
        fromX !== toX &&
        this.maze.bondH[idxH] &&
        this.canReach(fromX + dx, fromY, toX, toY)
      ) {
        return true;
      } else if (
        fromY !== toY &&
        this.maze.bondV[idxV] &&
        this.canReach(fromX, fromY + dy, toX, toY)
      ) {
        return true;
      }
      return false;
    },
    moveTo(toX, toY) {
      const fromX = this.player.x;
      const fromY = this.player.y;
      // Check if player can move
      // Players can't go outside of the maze
      if (toX < 0 || toX >= this.lx || toY < 0 || toY >= this.ly) {
        return;
      }
      // Players can't go through the walls
      if (!this.canReach(fromX, fromY, toX, toY)) {
        return;
      }
      Vue.set(this, "player", { x: toX, y: toY });
      if (!this.isStarted) {
        this.isStarted = true;
        this.$emit("start");
      }
      if (
        toX === this.maze.goal.x &&
        toY === this.maze.goal.y &&
        !this.isFinished
      ) {
        this.isFinished = true;
        this.$emit("finish");
      }
    },
    resetMaze() {
      const lx = this.lx;
      const ly = this.ly;
      const seed = this.seed++;
      if (lx > 0 && ly > 0) {
        const Maze = strategy[this.strategy];
        const maze = new Maze(lx, ly, seed);
        Vue.set(this, "maze", maze);
        Vue.set(this, "player", { x: 0, y: 0 });
        this.isStarted = false;
        this.isFinished = false;
      }
    },
    renderPlayer() {
      const playerRenderer = new Renderer(
        this.$refs.playerCanvas.getContext("2d"),
        this.cellWidth,
        this.cellHeight,
        this.marginLeft,
        this.marginTop
      );
      const player = this.player;
      playerRenderer.clear(this.width, this.height);
      playerRenderer.ctx = this.$refs.playerCanvas.getContext("2d");
      playerRenderer.setColor("#FF9800", "#222");
      if (this.image != null) {
        playerRenderer.drawImage(player.x, player.y, this.image);
      } else {
        playerRenderer.drawCircle(player.x, player.y);
      }
      // const xSize = player.x + 500;
      // const ySize = player.y + 500;
      // const characterSigil = "@";
      // playerRenderer.drawText("@", player.x, player.y)
    },
    renderGoal() {
      const renderer = new Renderer(
        this.$refs.goalCanvas.getContext("2d"),
        this.cellWidth,
        this.cellHeight,
        this.marginLeft,
        this.marginTop
      );
      const maze = this.maze;
      const goal = maze.goal;
      renderer.ctx = this.$refs.goalCanvas.getContext("2d");
      renderer.clear(this.width, this.height);
      renderer.setColor("#4CAF50", "#222");
      if (this.goalImage != null) {
        renderer.drawImage(goal.x, goal.y, this.goalImage);
      } else {
        renderer.drawCircle(goal.x, goal.y);
      }
    },
    renderCongratulations() {
      const effectRenderer = new Renderer(
        this.$refs.effectCanvas.getContext("2d"),
        this.cellWidth,
        this.cellHeight,
        this.marginLeft,
        this.marginTop
      )
      effectRenderer.clear(this.width, this.height);
      // TODO: data
      const texts = ["BooYah!", "Wow!", "I did it!", "Woohoo!"];
      const text = texts[Math.floor(texts.length * Math.random())];
      effectRenderer.drawText(text, this.player.x, this.player.y);
    },
    renderRandomMonster() {
      const monsterRenderer = new Renderer(
              this.$refs.monsterCanvas.getContext("2d"),
              this.cellWidth,
              this.cellHeight,
              this.marginLeft,
              this.marginTop
      )
      if (Math.ceil(Math.random() * 100) > 90) {
        monsterRenderer.ctx = this.$refs.monsterCanvas.getContext("2d");
        const sigil = new MonsterGenerator().determineMonster().sigil
        monsterRenderer.drawText(sigil, this.player.x, this.player.y)
      }
    },
    renderMaze() {
      this.$nextTick(() => {
        const renderer = new Renderer(
          this.$refs.mazeCanvas.getContext("2d"),
          this.cellWidth,
          this.cellHeight,
          this.marginLeft,
          this.marginTop
        );
        const { lx, maze } = this;
        const bondH = maze.bondH;
        const bondV = maze.bondV;
        renderer.clear(this.width, this.height);

        renderer.setColor(null, "#222");
        renderer.beginPath();
        for (let i = 0; i < bondH.length; i++) {
          if (bondH[i]) {
            continue;
          }
          const x1 = i % (lx + 1);
          const y1 = Math.floor(i / (lx + 1));
          const x2 = x1;
          const y2 = y1 + 1;
          renderer.drawLine(x1, y1, x2, y2);
          this.renderRandomMonster()
        }

        for (let j = 0; j < bondV.length; j++) {
          if (bondV[j]) {
            continue;
          }
          const x1 = j % lx;
          const y1 = Math.floor(j / lx);
          const x2 = x1 + 1;
          const y2 = y1;
          renderer.drawLine(x1, y1, x2, y2);
        }
        renderer.stroke();
        this.renderPlayer();
        this.renderGoal();
        // for (let i = 1; i <= store.state.dungeonLevel; i++) {
        //   this.renderRandomMonster()
        // }
      });
    }
  }
};
</script>

<style scoped>
.maze {
  outline: 0;
  position: relative;
  min-height: 60px;
  min-width: 60px;
  overflow: hidden;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
}
</style>
