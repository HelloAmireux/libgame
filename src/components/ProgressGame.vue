<template>
  <div class="game-container">
    <h1 class="game-title">逃离图书馆</h1>
    <div class="game-panel">
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: progress + '%', backgroundColor: progressColor }"
        ></div>
        <span class="progress-text">{{ progress.toFixed(0) }}%</span>
      </div>

      <div class="score-display">
        <span>得分: {{ score }}</span>
        <transition-group
          name="score-pop"
          tag="div"
          class="score-pop-container"
        >
          <span
            v-for="(pop, index) in scorePops"
            :key="index"
            class="score-pop"
            :class="{'big-score': pop.amount > 10}"
          >
            +{{ pop.amount }}
          </span>
        </transition-group>
      </div>

      <div
        v-if="objectVisible"
        class="object-alert"
        @click="handleObjectClick"
      >
        <div class="object"></div>
        <div
          class="timer"
          :style="{ width: objectTimer + '%' }"
        ></div>
        <div class="instruction">你的手在干嘛！</div>
      </div>

      <div class="controls">
        <button
          class="btn btn-a"
          @mousedown="startPressA"
          @mouseup="stopPressA"
          @touchstart="startPressA"
          @touchend="stopPressA"
        >
          <span class="btn-icon">🤪</span>
          <span class="btn-text">开始挠痒</span>
        </button>
        <button
          class="btn btn-b"
          @click="pressB"
        >
          <span class="btn-icon">📚</span>
          <span class="btn-text">学习</span>
        </button>
      </div>
    </div>

    <div
      v-if="gameOver"
      class="game-over"
    >
      <div class="game-over-content">
        <h2>游戏结束!</h2>
        <p>{{ gameOverMessage }}</p>
        <p class="final-score">最终得分: {{ score }}</p>
        <button
          @click="resetGame"
          class="restart-btn"
        >再玩一次</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const score = ref(0)
const isAPressed = ref(false)
const objectVisible = ref(false)
const objectTimer = ref(100)
const gameOver = ref(false)
const gameOverMessage = ref('')
const scorePops = ref([])
let gameInterval
let objectInterval
let objectSpawnInterval

// 进度条颜色计算
const progressColor = computed(() => {
  if (progress.value < 30) return '#4CAF50'
  if (progress.value < 70) return '#FFC107'
  return '#F44336'
})

// 开始游戏主循环
const startGameLoop = () => {
  gameInterval = setInterval(() => {
    // 自动增加进度
    if (!isAPressed.value && !objectVisible.value) {
      progress.value += 10
      if (progress.value >= 100) {
        endGame('忍不住了!')
      }
    }

    // A按钮减少进度
    if (isAPressed.value) {
      progress.value -= 10
      if (progress.value <= 0) {
        progress.value = 0
        isAPressed.value = false
      }
    }
  }, 1000)
}

// 随机生成物体
const startObjectSpawner = () => {
  // 每3-10秒随机生成一个物体
  const getRandomTime = () => Math.floor(Math.random() * 7000) + 3000

  const spawnObject = () => {
    if (!objectVisible.value && !gameOver.value) {
      showObject()
      objectSpawnInterval = setTimeout(spawnObject, getRandomTime())
    }
  }

  objectSpawnInterval = setTimeout(spawnObject, getRandomTime())
}

const showObject = () => {
  objectVisible.value = true
  const duration = 1049 // 1.049秒
  const startTime = Date.now()

  objectInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const remaining = duration - elapsed
    objectTimer.value = (remaining / duration) * 100

    if (remaining <= 0) {
      objectTimer.value = 0
      endGame('不好意思了，我似乎确实偷拍了，\n' +
        '我的论文也是达到了全国第二下载量。' +
        '然后我还会继续美美的被撤销录取通知。')
      clearInterval(objectInterval)
    }
  }, 10)
}

const addScorePop = (amount) => {
  const pop = { amount, id: Date.now() }
  scorePops.value.push(pop)
  setTimeout(() => {
    scorePops.value = scorePops.value.filter(p => p.id !== pop.id)
  }, 1000)
}

const handleObjectClick = () => {
  pressB()
}

const startPressA = () => {
  isAPressed.value = true
}

const stopPressA = () => {
  isAPressed.value = false
}

const pressB = () => {
  isAPressed.value = false

  // 如果有物体可见
  if (objectVisible.value) {
    objectVisible.value = false
    clearInterval(objectInterval)
    score.value += 50 // 奖励快速响应
    addScorePop(50)
  }
  // 如果没有物体可见
  else {
    score.value += 10 // 普通学习得分
    addScorePop(10)
  }
}

const endGame = (message) => {
  gameOver.value = true
  gameOverMessage.value = message
  clearInterval(gameInterval)
  clearTimeout(objectSpawnInterval)
  if (objectInterval) clearInterval(objectInterval)
}

const resetGame = () => {
  progress.value = 0
  score.value = 0
  isAPressed.value = false
  objectVisible.value = false
  gameOver.value = false
  scorePops.value = []
  if (objectInterval) clearInterval(objectInterval)
  clearTimeout(objectSpawnInterval)
  startGameLoop()
  startObjectSpawner()
}

onMounted(() => {
  startGameLoop()
  startObjectSpawner()
})

onUnmounted(() => {
  clearInterval(gameInterval)
  clearTimeout(objectSpawnInterval)
  if (objectInterval) clearInterval(objectInterval)
})
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Comic Sans MS", cursive, sans-serif;
  background-color: #f5f5f5;
}

.game-container {
  max-width: 1200px; /* 电脑端最大宽度限制 */
  margin: 40px auto; /* 顶部留空，居中显示 */
  padding: 40px 60px; /* 内边距更大，宽屏视觉舒适 */
  text-align: center;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 标题 */
.game-title {
  color: #3f51b5;
  margin-bottom: 40px;
  font-size: 3rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
  user-select: none;
}

/* 游戏面板 */
.game-panel {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 30px 40px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.07);
}

/* 进度条 */
.progress-bar-container {
  width: 100%;
  height: 40px;
  border: 3px solid #333;
  border-radius: 20px;
  margin: 30px 0 40px;
  position: relative;
  overflow: hidden;
  background-color: #e0e0e0;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  color: #333;
  font-size: 1.3rem;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
  user-select: none;
}

/* 分数显示 */
.score-display {
  font-size: 2.4rem;
  margin: 30px 0 50px;
  color: #333;
  position: relative;
  height: 60px;
  user-select: none;
}

.score-pop-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.score-pop {
  position: absolute;
  color: #4caf50;
  font-weight: 700;
  font-size: 1.8rem;
  animation: floatUp 1s ease-out forwards;
  user-select: none;
}

.big-score {
  color: #ff5722;
  font-size: 2.6rem;
}

/* 物体警告 */
.object-alert {
  position: relative;
  margin: 40px auto;
  width: 180px;
  height: 180px;
  background-color: rgba(255, 235, 59, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px dashed #ffc107;
  transition: all 0.3s;
  user-select: none;
}

.object-alert:hover {
  transform: scale(1.08);
  box-shadow: 0 0 30px rgba(255, 235, 59, 0.6);
}

.object {
  width: 100px;
  height: 100px;
  background-color: #ffeb3b;
  border-radius: 50%;
  box-shadow: 0 0 30px #ffeb3b;
  animation: pulse 1.5s infinite alternate;
}

.timer {
  height: 7px;
  background-color: #f44336;
  margin-top: 15px;
  transition: width 0.01s;
  border-radius: 7px;
}

.instruction {
  margin-top: 15px;
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
}

/* 控制按钮 */
.controls {
  display: flex;
  justify-content: center;
  margin-top: 60px;
  gap: 30px;
}

.btn {
  padding: 20px 35px;
  font-size: 1.4rem;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 160px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  user-select: none;
}

.btn:active {
  transform: scale(0.95);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.btn-a {
  background-color: #2196f3;
  color: white;
}

.btn-b {
  background-color: #ff5722;
  color: white;
}

.btn-icon {
  font-size: 2.4rem;
  margin-bottom: 8px;
}

.btn-text {
  font-weight: 700;
}

/* 游戏结束 */
.game-over {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 100;
  backdrop-filter: blur(6px);
  user-select: none;
}

.game-over-content {
  background-color: #3f51b5;
  padding: 40px 50px;
  border-radius: 24px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
  animation: fadeIn 0.5s ease-out;
}

.game-over h2 {
  font-size: 2.8rem;
  margin-bottom: 25px;
  color: #ffeb3b;
}

.final-score {
  font-size: 2rem;
  margin: 20px 0 30px;
  color: #ffeb3b;
}

.restart-btn {
  margin-top: 30px;
  padding: 16px 40px;
  font-size: 1.4rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.restart-btn:hover {
  background-color: #388e3c;
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}

/* 动画 */
@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px);
  }
}

@keyframes pulse {
  from {
    transform: scale(0.95);
    box-shadow: 0 0 15px #ffeb3b;
  }
  to {
    transform: scale(1.05);
    box-shadow: 0 0 50px #ffeb3b;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>