<template>
  <div class="cover-container">
    <!-- 背景随机文字 -->
    <div class="background-texts">
      <div
        v-for="(text, index) in randomTexts"
        :key="index"
        class="random-text"
        :style="{
          top: `${text.top}%`,
          left: `${text.left}%`,
          fontSize: `${text.size}px`,
          opacity: text.opacity,
          transform: `rotate(${text.rotation}deg)`,
          color: text.color
        }"
      >
        {{ text.content }}
      </div>
    </div>

    <!-- 主封面内容 -->
    <div class="cover-content">
      <div class="title-border">
        <div class="border-line"></div>
        <h1 class="game-title">🎓 逃离图书馆 🎓</h1>
        <div class="border-line"></div>
      </div>

      <p class="game-quote">"你的论文下载量全国第二，<br>但手速能排第几？"</p>

      <ul class="feature-list">
        <li>► 进度条危机：挠痒不要被发现！</li>
        <li>► 1.049秒极限反应战网暴</li>
        <li>► 学术生涯与手速的终极对决</li>
      </ul>

      <div class="button-group">
        <button
          class="start-button"
          @click="showVerification"
        >
          开始游戏
        </button>
        <button
          class="info-button"
          @click="showGameInfo"
        >
          游戏说明
        </button>
      </div>

      <p class="warning-text">
        ———————————————<br />
        "警告：本游戏可能导致<br />
        论文PTSD与笑肌损伤"
      </p>
    </div>

    <!-- 答题弹窗 -->
    <div
      v-if="showVerificationModal"
      class="verification-modal"
    >
      <div class="verification-content">
        <h3>{{ currentQuestion.question }}</h3>
        <ul class="options-list">
          <li
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :class="{ selected: selectedAnswer === index }"
            @click="selectAnswer(index)"
          >
            {{ option }}
          </li>
        </ul>
        <div
          class="feedback"
          v-if="answerFeedback"
        >{{ answerFeedback }}</div>
        <button
          :disabled="selectedAnswer === null"
          @click="submitAnswer"
          class="submit-btn"
        >
          提交答案
        </button>
        <button
          @click="cancelVerification"
          class="cancel-btn"
        >取消</button>
      </div>
    </div>

    <!-- 游戏说明弹窗 -->
    <div
      v-if="showInfoModal"
      class="verification-modal"
    >
      <div class="verification-content">
        <h3>游戏说明</h3>
        <p>
          这是一个考验手速与反应的小游戏。<br />
          你不仅需要学习，同时还需要防止对面偷拍<br />
          如果对方在问你在干什么的时候你需要在1.049秒内回答学习<br />
          如果没有及时回答，对方就会保研！<br />
          在开始游戏前，你需要回答一个简单的数学问题。<br />
          答对后才能进入游戏。祝你好运！
        </p>
        <button
          @click="closeGameInfo"
          class="submit-btn"
        >关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const sourceTexts = [
  '律政佳人',
  '梦回大宋',
  '提醒事项',
  '似乎确实',
  '主观能动',
  '分大于总',
  '母系社会',
  '中国优先',
  '拟合艺术',
  '模糊数学',
  '高斯再世',
  '新联合国',
  '印度蜥蜴',
  '封面装饰',
  '中国印刷',
  '人口危机',
  '时间旅行',
  '单走J',
  '复制粘贴',
  '点击就送',
  '神秘老K',
  '双语学习',
  '关税政策',
  '香烟卷纸',
  '粗细得当',
  '虚实交融',
  '军旅生涯',
  '双重动词',
  '骑墙主义',
  '福尔摩斯',
  '锦绣岁月',
  '险遭不测',
  '手眼通天',
  '经天纬地',
  '租赁费用',
  '标点仙人'
]

const randomTexts = ref([])

const generateRandomTexts = () => {
  const texts = []
  for (let i = 0; i < 30; i++) {
    texts.push({
      content: sourceTexts[Math.floor(Math.random() * sourceTexts.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 14 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
      rotation: -15 + Math.random() * 30,
      color: `hsl(${Math.random() * 60 + 200}, 30%, ${50 + Math.random() * 30
        }%)`
    })
  }
  randomTexts.value = texts
}

const questions = [
  {
    question: '0.01%是多少分之一',
    options: ['十分之一', '百分之一', '千分之一', '万分之一'],
    correctAnswer: 2,
    feedback: {
      correct: '正确！高斯在世！',
      wrong: '错误！再猜猜'
    }
  }
]

const showVerificationModal = ref(false)
const showInfoModal = ref(false)
const currentQuestion = ref({})
const selectedAnswer = ref(null)
const answerFeedback = ref('')

const showVerification = () => {
  currentQuestion.value = questions[Math.floor(Math.random() * questions.length)]
  selectedAnswer.value = null
  answerFeedback.value = ''
  showVerificationModal.value = true
}

const selectAnswer = (index) => {
  selectedAnswer.value = index
  answerFeedback.value = ''
}

const submitAnswer = () => {
  if (selectedAnswer.value === null) return

  if (selectedAnswer.value === currentQuestion.value.correctAnswer) {
    answerFeedback.value = currentQuestion.value.feedback.correct
    setTimeout(() => {
      showVerificationModal.value = false
      router.push('/game')
    }, 1000)
  } else {
    answerFeedback.value = currentQuestion.value.feedback.wrong
  }
}

const cancelVerification = () => {
  showVerificationModal.value = false
}

const showGameInfo = () => {
  showInfoModal.value = true
}

const closeGameInfo = () => {
  showInfoModal.value = false
}

onMounted(() => {
  generateRandomTexts()
  setInterval(generateRandomTexts, 5000)
})
</script>

<style scoped>
.cover-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  overflow: hidden;
  font-family: "Microsoft YaHei", sans-serif;
  margin-left: -400px;
}

.background-texts {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.random-text {
  position: absolute;
  white-space: nowrap;
  transition: all 3s ease;
  user-select: none;
}

.cover-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  backdrop-filter: blur(5px);
}

.title-border {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.border-line {
  width: 80px;
  height: 2px;
  background-color: #333;
  margin: 0 15px;
}

.game-title {
  font-size: 3rem;
  margin: 0;
  color: #2c3e50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.game-quote {
  font-size: 1.5rem;
  font-style: italic;
  color: #555;
  margin: 20px 0;
  line-height: 1.5;
}

.feature-list {
  list-style-type: none;
  padding: 0;
  margin: 30px 0;
  text-align: left;
  display: inline-block;
}

.feature-list li {
  font-size: 1.2rem;
  margin: 10px 0;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.start-button,
.info-button {
  padding: 12px 30px;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.start-button {
  background-color: #3498db;
}

.start-button:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(41, 128, 185, 0.4);
}

.info-button {
  background-color: #2ecc71;
}

.info-button:hover {
  background-color: #27ae60;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.warning-text {
  font-size: 1rem;
  color: #e74c3c;
  margin-top: 30px;
  line-height: 1.6;
}

/* 答题弹窗和说明弹窗共用样式 */
.verification-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.verification-content {
  background-color: #fff;
  padding: 30px 40px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.options-list li {
  padding: 10px 15px;
  margin: 10px 0;
  border: 2px solid #3498db;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s, color 0.3s;
}

.options-list li:hover {
  background-color: #3498db;
  color: #fff;
}

.options-list li.selected {
  background-color: #2980b9;
  color: white;
  border-color: #2980b9;
}

.feedback {
  font-weight: bold;
  margin: 15px 0;
  min-height: 24px;
  color: #e74c3c;
}

.feedback:empty {
  margin: 0;
  height: 0;
}

.submit-btn,
.cancel-btn {
  padding: 10px 25px;
  border-radius: 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin: 10px 10px 0 10px;
  transition: background-color 0.3s;
}

.submit-btn {
  background-color: #3498db;
  color: white;
}

.submit-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #aaa;
  color: white;
}
</style>
