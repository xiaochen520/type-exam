<template>
  <div class="result flex-m">
    <div class="box">
      <div class="b-head flex-m flex-h-c">
        <img src="../imgs/icon-press.png" alt="">
        <span>{{title}}</span>
      </div>
      <div class="b-content">
        <div class="bc-title">本次成绩</div>
        <div class="bc-list flex" v-for='(item, index) in resArr' :key='index'>
          <div class="bc-item">
            <span>文章</span>
            <span><<</span>
            <span class="s">{{item.title}}</span>
            <span>>></span>
          </div>
          <div class="bc-item">
            <span>用时</span>
            <span class="s">{{item.time}}</span>
            <span>秒</span>
          </div>
          <div class="bc-item">
            <span>正确率</span>
            <span class="s">{{item.res}}</span>
            <span>%</span>
          </div>
        </div>
      </div>

      <div class="b-footer tc">
        <!-- <button class="btn" @click="0">查看历史</button> -->
        <button class="btn" @click="$router.push('/')">返回首页</button>
        <button class="btn primary"@click="$router.push('/selectTopic')">继续打字</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      resArr: []
    };
  },
  created() {
    this.resArr = JSON.parse(sessionStorage.res);

    let resTotal = 0;
    this.resArr.forEach(e => {
      resTotal += Number(e.res);
    });

    if (resTotal / this.resArr.length > 60) {
      this.title = "及格，继续努力！";
    } else {
      this.title = "不及格，还需加油";
    }
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
.result {
  height: 100%;
  overflow: hidden;
  background-image: url("../imgs/select-bg.png");
  background-repeat: no-repeat;
  background-size: 100%;

  .box {
    background-color: #fff;
    width: 800px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    color: #333333;
    padding-bottom: 80px;

    .b-head {
      background: #e7eff8;
      color: #1465b7;
      font-size: 16px;
      font-weight: bold;
      padding: 20px;
      img {
        width: 35px;
        margin-right: 10px;
        margin-top: -20px;
      }
    }

    .b-content {
      padding: 20px 30px;
      .bc-title {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .bc-list {
        padding: 8px 0;
        font-size: 14px;
        color: #333;
        .bc-item {
          margin-right: 12px;
          .s {
            color: #1465b7;
          }
        }
      }
    }

    .b-footer {
      margin-top: 50px;
      .btn {
        padding: 3px 0;
        background: #fff;
        border-color: #1465b7;
        color: #1465b7;
        width: 150px;
        margin-right: 25px;

        &.primary {
          background: #1465b7;
          color: #fff;
          border-color: #1465b7;
          margin-right: 0px;
        }
      }
    }
  }
}
</style>