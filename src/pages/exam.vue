<template>
  <div class="exam">
    <div v-if='topic && topic.voice' ref='audio' class="audio-box">
      <audio ref='adEle'>
        <source :src="topic.voice" type="audio/ogg">
      </audio>
    </div>
    <div class="content">
      <div class="left">
        <div class="left-head">
          <span>/首页/</span>
          <span>训练</span>
        </div>
        <div class="left-nav flex-m">
          <span>开始输入时计时！</span>
          <div class="flex-1 flex-m flex-h-r card-info">
            <span>文章名称：{{topic.topic}}</span>
            <span>文章类别：{{topic.subjectType}}</span>
          </div>
        </div>
        <div class="paper">
          <!-- <div class="head">
            <span>文章名称：{{topicTitlt}}</span>
            <span>时间：{{minute}}: {{second}}</span>
            <span>语音播放速度：{{speed}}</span>
            <button @click='playAudio'>js播放语音</button>
            <button @click='changeSpeed'>js调速</button>
            <button @click='playLocal'>音频播放</button>
            <button @click='changeLocalSpeed'>音频调速</button>
            <button @click='exit'>完成</button>
          </div> -->

          <div class="exam-item" v-for="(item, index) in testList" :key="index">
            <div class="topic">
              <span :class="spanSty(index, i)" v-for="(str, i) in item.text" :key="i">{{str}}</span>
            </div>
            <input @input='handInput' class="answer" type="text" v-model="item.value" />
          </div>

        </div>
      </div>
      <div class="right">
        <div class="tc clock">
          <img src="../imgs/icon-time.png" alt="">
          <div>倒计时</div>
          <div class="time">
            <span>{{second}}</span>
          </div>
          <div>设定时间：{{time}}秒</div>
        </div>

        <div class="exam-info">
          <!-- <div class="er-item">
            <img src="" alt="">
            <span>速度:0KPM</span>
          </div> -->
          <div class="er-item">
            <img src="" alt="">
            <span>正确率:{{correctRatio}}%</span>
          </div>
          <div class="er-item">
            <img src="" alt="">
            <span>总单词量: {{topic.content.split(" ").length}}</span>
          </div>
        </div>
        <div class="exam-info opera-btn">
          <div class="er-item" @click='pauseAll'>
            <img src="" alt="">
            <span>{{isPause ? '继续' : '暂停'}}</span>
          </div>
          <div @click='pauseVoice' class="er-item">
            <img src="" alt="">
            <span>语音{{isPauseVoice ? '播放' : '暂停'}}</span>
          </div>
          <div class="er-item" @click='changeSpeed'>
            <img src="" alt="">
            <span>播放速度:X{{this.speed}}</span>
          </div>
          <div class="er-item" @click='exitExam'>
            <img src="" alt="">
            <span>退出</span>
          </div>
        </div>
      </div>
    </div>

    <Modal class="res-modal" v-model='showResModal' :closable='false'>
      <div slot='header' class="res-head flex-m flex-h-c">
        <img src="../imgs/icon-res-time.png" alt="">
        <span>结果</span>
      </div>
      <div class='res-box flex flex-h-c'>
        <div class="rb-item flex-m">
          <span class="label">时间：</span>
          <span class="s">{{this.time - this.second}}</span>
          <span>秒</span>
        </div>
        <div class="rb-item flex-m">
          <span class="label">得分：</span>
          <span>{{correctRatio}}分</span>
        </div>
        <div class="rb-item flex-m">
          <span class="label">正确率：</span>
          <span class="s">{{correctRatio}}</span>
          <span>%</span>
        </div>

      </div>

      <div slot='footer' class="res-footer tc">
        <button class="btn" @click='goRes'>立即查看</button>
        <button class="btn primary" v-if='topicArr.length > 1' @click='beginNext'>下一题</button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { topic } from "../util";
  import api from "@/api";
  import Speech from "speak-tts";
  export default {
    data() {
      return {
        isPause: false,
        isPauseVoice: true,
        correctRatio: 0,
        showResModal: false,
        speed: 1,
        time: 0,
        topicArr: [
          {
            id: 1,
            topic: "one",
            content:
              "Hooray! It's snowing! It's time to make a snowman.James runs out. He makes a big pile of snow. He puts a big snowball on top. He adds a scarf and a hat. He adds an orange for the nose. He adds coal for the eyes and buttons.In the evening, James opens the door. What does he see? The snowman is moving! James invites him in. The snowman has never been inside a house. He says hello to the cat. He plays with paper towels.A moment later, the snowman takes James's hand and goes out.They go up, up, up into the air! They are flying! What a wonderful night!The next morning, James jumps out of bed. He runs to the door.He wants to thank the snowman. But he's gone.",
            voice: null,
            subjectType: "文章",
            subjectLebal: "大自然",
            score: "10",
            createTime: "2020-09-11",
            creator: "baozq",
            updateTime: null
          }
        ],
        isStart: false,
        topic: null,
        testList: [],
        timer: null,
        second: 0,
        isEnd: false,
        speech: null
      };
    },
    created() {
      this.time = this.$route.query.time;
      this.topic = this.topicArr[0];
      this.getPaper();
      // let language = topic[this.topicIndex].language;
      // this.topicIndex = this.$route.query.index;
      // this.topic = topic[this.topicIndex].topic;
      // this.topicTitlt = topic[this.topicIndex].title;
      // this.calcTime();
    },
    mounted() { },
    methods: {
      goRes() {
        this.$router.push({ path: '/' });
      },
      beginNext() {
        this.topic = this.topicArr[1];
        this.correctRatio = 0;
        this.showResModal = false;
        this.speed = 1;
        this.isStart = false;
        this.second = 0;
        this.speech.cancel();
        this.getPaper();
      },
      playAndPauseVoice() {

        if (this.isPauseVoice) {
          if (this.topic.voice) {
            this.$refs.adEle.pause();
          } else {
            this.speech.pause();
          }
        }

        if (!this.isPauseVoice) {
          if (this.topic.voice) {
            this.$refs.adEle.play();
          } else {
            this.speech.resume();
          }
        }
      },
      pauseVoice() {
        if(!this.isStart) return;
        if (this.isPause) return;

        if (!this.isPauseVoice) {
          this.isPauseVoice = true;
          this.playAndPauseVoice();
        } else {
          this.isPauseVoice = false;
          this.playAndPauseVoice();
        }
      },
      pauseAll() {
        if (!this.isPause) {
          //暂停
          this.isPause = true;
          if (this.topic.voice) {
            this.$refs.adEle.pause();
          } else {
            this.speech.pause();
          }
        } else {
          this.isPause = false;
          this.calcTime(this.second);
          if (this.topic.voice) {
            this.$refs.adEle.play();
          } else {
            this.speech.resume();
          }
        }

      },
      exitExam() {
        this.exit();
      },
      handInput() {
        if (!this.isStart) {
          this.calcTime();
          this.isStart = true;
          this.playVoice();
        }

        this.calcMark();
      },
      getPaper() {
        let query = this.$route.query;
        let params = {
          subjectType: query.subjectType,
          subjectLebal: query.subjectLebal
        };

        let workArr = this.topic.content.split(" ");
        let testArr = [];
        let cycleIndex = Math.ceil(workArr.length / 10);

        for (let i = 0; i < cycleIndex; i++) {
          let str = "";
          if (i + 1 == cycleIndex) {
            str = workArr.slice(i * 10).join(" ");
          } else {
            str = workArr.slice(i * 10, 10 * (i + 1)).join(" ");
          }
          console.log(str);
          testArr.push({ text: str, value: "" });
        }
        this.testList = testArr;

        if (!this.topic.voice) {
          this.speech = new Speech();
          if (this.speech.hasBrowserSupport()) {
            this.speech.setLanguage("en-US");
            this.speech.setRate(this.speed);
          } else {
            console.log("speech synthesis unsupported");
          }
        }
        // this.$get(api.subjectList, params).then(res => {});
      },
      playVoice() {
        if (this.topic.voice) {
          this.$refs.adEle.play();
          this.$refs.adEle.playbackRate = this.speed;
        } else {
          this.speech.speak({ text: this.topic.content }).then(() => {
            console.log("读取成功");
          });
        }
      },
      exit() {
        this.isPauseVoice = true;
        this.playAndPauseVoice();
        if (this.topic.voice) {
          this.$refs.audio.innerHTML = "";
        }

        this.isEnd = true;
        clearTimeout(this.timer);
        this.calcMark();
        this.showResModal = true;
      },
      calcMark() {
        let text = "";
        let sucNum = 0;

        this.testList.forEach(e => {
          text += e.text;
          for (let i = 0; i < e.text.length; i++) {
            if (e.text[i] === e.value[i]) {
              sucNum++;
            }
          }
        });

        this.correctRatio = (sucNum / text.length * 100).toFixed(2);
      },
      changeSpeed() {
        if (this.speed >= 4) {
          this.speed = 1;
        } else {
          this.speed = this.speed + 1;
        }

        if (this.topic.voice) {
          this.$refs.adEle.playbackRate = this.speed;
        } else {
          this.speech.cancel();
          this.speech.setRate(this.speed);
          this.speech.speak({ text: this.topic.content }).then(() => {
            console.log("读取成功");
          });
        }
      },
      playAudio() { },
      calcTime(time) {
        let restTime = time || this.time;

        if (restTime == 0 || this.isEnd) {
          this.exit();
          return;
        }

        if (this.isPause) {
          return;
        }
        this.second = restTime;
        this.timer = setTimeout(() => {
          this.calcTime(--restTime);
        }, 1000);
      },
      spanSty(index, i) {
        let option = this.testList[index];
        if (option.value[i]) {
          if (option.value[i] == option.text[i]) {
            return "green";
          } else {
            return "red";
          }
        }

        return "";
      }
    }
  };
</script>
<style lang='scss' scoped>
  .exam {
    height: 100%;
    overflow: auto;
    background: url("../imgs/exam-bg.png") no-repeat;
    background-size: 100%;

    .content {
      width: 1200px;
      margin: 0 auto;
      margin-top: 50px;
      padding-right: 220px;
      position: relative;

      .left {
        background: #fff;
        border-radius: 12px;
        overflow: hidden;

        &-head {
          padding: 8px 25px;
          background: #f8f8f8;
        }

        &-nav {
          padding: 8px 15px;

          .card-info {
            span {
              margin-right: 10px;
            }
          }
        }
      }

      .right {
        color: #343434;
        top: 0;
        position: absolute;
        right: 0;
        width: 200px;
        background: #fff;
        border-radius: 12px;
        padding: 25px 20px;

        .clock {
          font-size: 12px;

          .time {
            font-size: 18px;
            font-weight: bold;
          }
        }

        .exam-info {
          border-top: 1px solid #eee;
          padding-top: 10px;
          font-size: 13px;
          font-weight: bold;
          margin-top: 15px;

          .er-item {
            color: #343434;
            padding: 6px 0;
          }
        }

        .opera-btn {
          .er-item {
            cursor: pointer;
          }
        }
      }
    }

    .audio-box {
      width: 0;
      height: 0;
    }

    .paper {
      padding: 0 25px;
      font-size: 14px;
      border-radius: 3px;

      .head {
        padding: 15px 0;
        font-size: 15px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 15px;

        span {
          margin: 0 10px;
        }
      }

      .exam-item {
        background: #f2f3f4;
        border-radius: 12px;
        margin-bottom: 15px;
        padding: 10px 15px 20px;

        .answer {
          width: 100%;
          padding: 5px 10px;
        }
      }

      .topic {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;

        span {
          padding: 0 2px;

          &.green {
            color: green;
          }

          &.red {
            color: red;
          }
        }
      }
    }
  }

  .res-head {
    color: #1465B7;
    font-size: 18px;
    font-weight: bold;
    background: #DDEEFF;
    padding: 25px 0;

    img {
      width: 32px;
      margin-right: 12px;
    }
  }

  .res-box {
    font-size: 14px;

    .rb-item {
      margin-right: 12px;

      .s {
        color: #1465B7;
      }
    }
  }

  .res-footer {
    text-align: center;

    .btn {
      padding: 3px 0;
      background: #fff;
      border-color: #1465B7;
      color: #1465B7;
      width: 150px;

      &.primary {
        background: #1465B7;
        color: #fff;
        border-color: #1465B7;
        margin-left: 25px;

      }
    }
  }
</style>

<style scoped>
  .res-modal>>>.ivu-modal-header {
    padding: 0;
  }

  .res-modal>>>.ivu-modal-content {
    overflow: hidden;
  }
</style>