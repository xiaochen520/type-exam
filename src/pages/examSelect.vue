<template>
  <div class="topic flex-m">
    <div class="box">
      <div class="b-head flex-m">
        <img src="../imgs/exam-head-icon.png" alt="">
        <span>请选择模拟试题</span>
      </div>
      <div class="b-content">
        <div class="b-item flex-m">
          <span class="label">试卷名称：</span>
          <input v-model='user' readonly type="text" class="user input">
        </div>
        <div class="b-item flex-m">
          <span class="label">试卷组成：</span>
          <span class="label flex-1">单词5个 短文2篇 句子5个 文章2篇</span>
        </div>
        <div class="b-item flex-m">
          <span class="label">标签组成：</span>
          <div class="bl-box flex-m">
            <div class="hot-list clear">
              <div v-for='item in hotArr' :key='item.id'>{{item.text}}</div>
            </div>
          </div>
        </div>
        <div class="b-item flex-m">
          <span class="label">考试时长：</span>
          <span>60分钟</span>
        </div>
      </div>
      <div class="b-footer tc">
        <button class="s">开始模拟</button>
        <button @click="$router.push('/')">返回首页</button>
      </div>
    </div>

    <Modal v-model='showLabelModal' title='标签'>
      <div>

      </div>
    </Modal>
  </div>
</template>
<script>
  import { topic } from '../util';
  import api from '@/api';
  export default {
    data() {
      return {
        hotLabel: '大自然',
        currentHot: 0,
        hotArr: [
          { id: 0, text: '大自然' },
          { id: 1, text: '人文' },
          { id: 2, text: '科学' },
          { id: 3, text: '商务' }
        ],
        showLabelModal: false,
        user: '',
        time: '',
        topic: topic,
        selectTopic: '',
        topicType: '文章'
      };
    },
    created() {
      this.user = sessionStorage.user;
    },
    methods: {
      resetForm() {
        this.topicType = '文章';
        this.hotLabel = '大自然';
        this.time = '';
      },
      clickHot(item) {
        this.currentHot = item.id;
        this.hotLabel = item.text;
      },
      openLabel() {
        this.getLabel('bqgl');
        this.showLabelModal = true;
      },
      getLabel(label) {
        let params = {
          value: label
        }

        this.$get(api.queryMacrosByValue, params).then(res => {

        });
      },
      beforeExam() {
        const query = {
          subjectType: this.topicType,
          subjectLebal: this.hotLabel,
          time: this.time
        }

        let params = {
          subjectType: encodeURI(query.subjectType),
          subjectLebal: encodeURI(query.subjectLebal)
        };

        this.$get(api.subjectList, params).then(res => {

          if (res.data.length) {
            this.$router.push({ path: '/exam', query: query });
          } else {
            this.$Message.warning('没有内容');
          }
        });

      }
    }
  };
</script>
<style lang='scss' scoped>
  .topic {
    height: 100%;
    overflow: hidden;
    background-image: url('../imgs/select-bg.png');
    background-repeat: no-repeat;
    background-size: 100%;
    .box {
      background-color: #fff;
      width: 500px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 12px;
      overflow: hidden;
      color: #333333;
      padding-bottom: 80px;
      .b-head {
        background: #E7EFF8;
        color: #343434;
        font-size: 14px;
        padding: 20px;
        img {
          width: 18px;
          margin-right: 8px;
        }
      }
      .b-content {
        padding: 20px 30px;
        .b-item {
          padding: 10px 0;
          .label {
            font-size: 13px;
            color: #343434;
            width: 80px;
          }
          .input {
            width: 220px;
            border-radius: 4px;
            color: #666666;
            padding: 3px 8px;
            &.user {
              background: #F8F8F8;
              border-color: #F8F8F8;
            }
            &.label {}
          }
          .label-btn {
            color: #fff;
            background: #1466b8;
            font-size: 13px;
            padding: 3px 10px;
            border: none;
            outline: none;
            margin-left: 10px;
          }
          .select {
            width: 220px;
          }
          .bl-box {

            .hot-list {
              div {
                float: left;
                margin-right: 15px;
                background: #E7EFF8;
                padding: 3px 10px;
                border-radius: 3px;
                color: #1466B8;
                cursor: pointer;
                &.active {
                  color: #fff;
                  background: #1466b8;
                }
              }
            }
          }
        }
      }
      .b-footer {
        button {
          color: #1466B8;
          border: 1px solid #1466B8;
          border-radius: 6px;
          padding: 6px 0;
          width: 150px;
          &.s {
            background: #1466B8;
            color: #fff;
            margin-right: 15px;
          }
        }
      }
    }
  }
</style>

<style scoped>
  .t-radio {
    font-size: 12px;
  }
</style>