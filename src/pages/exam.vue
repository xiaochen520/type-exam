<template>
  <div class="exam" @selectstart="stopCopy">
    <div v-if='topic && topic.voice' ref='audio' class="audio-box">
      <audio ref='adEle'>
        <source :src="topic.voice" type="audio/ogg">
      </audio>
    </div>
    <div class="content">
      <div class="left">
        <div class="left-head flex-m">
          <img src="../imgs/htmal5icon06.png" alt="">
          <span>/首页/</span>
          <span>训练</span>
        </div>
        <div v-if='topic' class="left-nav flex-m">
          <span class="s">开始输入时计时！</span>
          <div class="flex-1 flex-m flex-h-r card-info">
            <span>文章名称：{{topic.topic}}</span>
            <span>文章类别：{{topic.subjectType}}</span>
          </div>
        </div>
        <div class="paper">
          <div class="exam-item" :class='{focus: item.focus}' v-for="(item, index) in testList" :key="index">
            <div class="topic">
              <span :class="spanSty(index, i)" v-for="(str, i) in item.text" :key="i">{{str}}</span>
            </div>
            <input :class="'type-click' + index" @keyup.space='clickSpace(item, index)' @focus='getFocus(item)' @input='handInput(index)'
              class="answer" type="text" v-model="item.value" />
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
          <div class="er-item">
            <img src="../imgs/ic_xl_zql.png" alt="">
            <span>正确率:{{correctRatio}}%</span>
          </div>
          <div class="er-item">
            <img src="../imgs/ic_xl_zdcl.png" alt="">
            <span v-if='topic'>总单词量: {{topic.content.split(" ").length}}</span>
          </div>
        </div>
        <div class="exam-info opera-btn">
          <div class="er-item" @click='pauseAll'>
            <img v-show='!isPause' src="../imgs/icon-play.png" alt="">
            <img v-show='isPause' src="../imgs/icon-pause.png" alt="">
            <span>{{isPause ? '继续' : '暂停'}}</span>
          </div>
          <div class="er-item quick">暂停训练 ALT+4</div>
          <div @click='playAndPauseVoice' class="er-item">
            <img src="../imgs/icon-video.png" alt="">
            <span>语音{{isPauseVoice ? '播放' : '暂停'}}</span>
          </div>
          <div class="er-item quick">暂停语音 ALT+3</div>
          <div class="er-item" @click='changeSpeed'>
            <img src="../imgs/icon-play.png" alt="">
            <span>播放速度:X{{speed}}</span>
          </div>
          <div class="er-item quick">增加语速 ALT+1</div>
          <div class="er-item quick">减慢语速 ALT+2</div>
          <div class="er-item" @click='exitExam'>
            <img src="../imgs/icon-exit.png" alt="">
            <span>退出</span>
          </div>
        </div>
      </div>
    </div>

    <Modal :mask-closable='false' class="res-modal" v-model='showResModal' :closable='false'>
      <div slot='header' class="res-head flex-m flex-h-c">
        <img src="../imgs/icon-res-time.png" alt="">
        <span>结果</span>
      </div>
      <div class='res-box flex flex-h-c'>
        <div class="rb-item flex-m">
          <span class="label">时间：</span>
          <span class="s">{{time - second}}</span>
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
        <input ref='resBody' type="hidden">
      </div>

      <div slot='footer' class="res-footer tc">
        <button class="btn" @click='goRes'>立即查看</button>
        <button class="btn primary" v-if='topicArr.length > (currentNum+1)' @click='beginNext'>下一题</button>
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
        isPauseVoice: false,
        correctRatio: 0,
        showResModal: false,
        speed: 1,
        time: 0,
        topicArr: [],
        isStart: false,
        topic: null,
        testList: [],
        timer: null,
        second: 0,
        isEnd: false,
        speech: null,
        currentNum: 0
      };
    },
    created() {
      this.time = this.$route.query.time;
      this.second = this.time;
      this.getPaper();
      sessionStorage.removeItem('res');

      document.addEventListener('contextmenu', this.contextMenuEvt);

      document.onkeydown = oEvent => {
      
        var oEvent = oEvent || window.oEvent;

        //获取ctrl 键对应的事件属性
        var bCtrlKeyCode = oEvent.altKey;
        if (oEvent.keyCode == 49 && bCtrlKeyCode) {
          //ctrl+1 增加语速
          this.changeSpeed();
        }

        if (oEvent.keyCode == 50 && bCtrlKeyCode) {
          //ctrl+2 减慢语速
          if (this.speed > 1) {
            this.speed++;
            if (this.topic.voice) {
              this.$refs.adEle.playbackRate = this.speed;
            } else {
              this.speech.cancel();
              this.speech.setRate(this.speed);
              this.speech.speak({ text: this.topic.content }).then(() => {
                console.log("读取成功");
              });
            }
          }
        }

        if (oEvent.keyCode == 51 && bCtrlKeyCode) {
          //ctrl+3 暂停语音 
          this.playAndPauseVoice();
        }

        if (oEvent.keyCode == 52 && bCtrlKeyCode) {
          //ctrl+4 暂停训练
          this.pauseAll();
        }
      }
    },
    beforeDestroy() {
      this.speech.cancel();
      document.removeEventListener('contextmenu', this.contextMenuEvt);
    },
    methods: {
      stopCopy(event) {
        event = event || window.event;
        event.preventDefault?event.preventDefault():(event.returnValue = false);
      },
      contextMenuEvt(event) {
        event = event || window.event;
        event.preventDefault?event.preventDefault():(event.returnValue = false);
      },
      clickSpace(item, index) {
        if (index == (this.testList.length - 1)) return;
        if (item.text.length <= item.value.length) {
          this.testList.forEach(e => {
            e.focus = false;
          })
          document.getElementsByClassName('type-click' + (index + 1))[0].focus();
        }
      },
      getFocus(item) {
        this.testList.forEach(e => {
          e.focus = false;
        })
        item.focus = true;
      },
      goRes() {
        this.$router.push({ path: '/result' });
      },
      beginNext() {
        this.currentNum = this.currentNum + 1;
        this.topic = this.topicArr[this.currentNum];
        this.correctRatio = 0;
        this.second = this.time;
        this.isEnd = false;
        this.isPause = false;
        this.isPauseVoice = false;
        this.showResModal = false;
        this.speed = 1;
        this.isStart = false;
        this.speech.cancel();
        this.formatData();
      },
      playAndPauseVoice() {
        if (!this.isStart) {
          this.$Message.warning('请开始计时后再操作');
          return;
        };

        if (this.isPauseVoice) {
          this.isPauseVoice = false;
          this.resumeVoice();
        } else {
          this.isPauseVoice = true;
          this.pauseVoice();
        }

      },
      pauseVoice() {
        if (this.topic.voice) {
          this.$refs.adEle.pause();
        } else {
          this.speech.pause();
        }
      },
      resumeVoice() {
        if (this.topic.voice) {
          this.$refs.adEle.play();
        } else {
          this.speech.resume();
        }
      },
      pauseAll() {
        if (!this.isStart) {
          this.$Message.warning('请开始计时后再操作');
          return;
        };
        if (!this.isPause) {
          //暂停
          this.isPause = true;
          this.isPauseVoice = true;
          this.pauseVoice();
        } else {
          this.isPause = false;
          this.isPauseVoice = false;
          this.calcTime(this.second);
          this.resumeVoice();
        }
      },
      exitExam() {
        this.exit();
      },
      handInput(index) {
        if (!this.isStart) {
          this.calcTime(this.second);
          this.isStart = true;
          this.playVoice();
        }
        let isFill = false;
        this.testList.forEach(e => {
          if (e.text.length > e.value.length) {
            isFill = true;
          }
        });
        if (!isFill && !this.isEnd) {
          document.getElementsByClassName('type-click' + index)[0].blur();
          this.exit();
        }

        this.calcMark();
      },
      formatData() {
        let workArr = this.topic.content.split(" ");
        let testArr = [];
        const rowNumber = 15;
        let cycleIndex = Math.ceil(workArr.length / rowNumber);
        for (let i = 0; i < cycleIndex; i++) {
          let str = "";
          if (i + 1 == cycleIndex) {
            str = workArr.slice(i * rowNumber).join(" ");
          } else {
            str = workArr.slice(i * rowNumber, rowNumber * (i + 1)).join(" ");
          }
          console.log(str);
          testArr.push({ text: str, value: "", focus: false });
        }
        this.testList = testArr;
      },
      getPaper() {
        let query = this.$route.query;
        let params = {
          subjectType: encodeURI(query.subjectType),
          subjectLebal: encodeURI(query.subjectLebal)
        };

        this.$get(api.subjectList, params).then(res => {

          if (res.data.length) {
            this.topicArr = res.data;
            this.topic = this.topicArr[this.currentNum];
            this.formatData();

            if (!this.topic.voice) {
              this.speech = new Speech();
              if (this.speech.hasBrowserSupport()) {
                this.speech.setLanguage("en-US");
                this.speech.setRate(this.speed);
              } else {
                console.log("speech synthesis unsupported");
              }
            }
          } else {
            this.$Message.warning('没有内容');
          }
        });
      },
      playVoice() {
        if (this.topic.voice) {
          this.$refs.adEle.play();
          this.$refs.adEle.playbackRate = this.speed;
        } else {
          this.speech.cancel();
          this.speech.speak({ text: this.topic.content }).then(() => {
            console.log("读取成功");
          });
        }
      },
      exit() {
        this.$refs.resBody.focus();
        this.isPauseVoice = true;
        this.isPause = true;
        this.pauseVoice();
        this.isEnd = true;
        clearTimeout(this.timer);
        this.calcMark();
        this.showResModal = true;
        let resArr = [];
        if (sessionStorage.res) {
          resArr = JSON.parse(sessionStorage.res);
        }
        resArr.push({
          title: this.topic.topic,
          time: this.time - this.second,
          res: this.correctRatio
        })
        sessionStorage.setItem('res', JSON.stringify(resArr));
        let params = {
          userId: sessionStorage.userId,
          name: sessionStorage.user,
          title: this.topic.topic,
          kind: this.topic.subjectType,
          time: this.time - this.second,
          accuracy: this.correctRatio,
          score: this.correctRatio
        }

        this.$post(api.submitResule, params).then(res => {
          if (res.errno == 0) {
            this.$Message.success('成绩上传成功');
          }
        });

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
        if (this.isPauseVoice || !this.isStart) {
          this.$Message.warning('请开始播放后再操作');
          return;
        }
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
      calcTime(time) {
        let restTime = time;

        if (restTime == 0 || this.isEnd) {
          this.second = restTime;
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
          img {
            width: 16px;
            margin-right: 8px;
          }
        }

        &-nav {
          padding: 8px 15px;
          .s {
            color: #F32836;
          }
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
            img {
              width: 20px;
              vertical-align: middle;
              margin-right: 10px;
            }
            span {
              vertical-align: middle;
            }
            &.quick {
              color: #666;
              padding-left: 30px;
              font-size: 12px;
              padding-top: 0;
            }
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
        color: #9A9A9A;

        .answer {
          width: 100%;
          padding: 5px 10px;
          font-size: 15px;
        }
      }

      .focus {
        background: #DDEEFF;
        color: #343434;

        .answer {
          border-color: #1466B8;
        }
      }

      .topic {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;

        span {
          /* padding: 0 2px; */
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