<template>
  <div class="index">
    <div class="header">
      <div class="outer flex-m">
        <img class="logo" src="../imgs/logo_blue.png" alt="">
        <div class="h-menu flex-1 flex-m flex-h-r">
          <div class="list">首页</div>
          <div class="list">消息</div>
          <div class="entry line" v-if='!isLogin' @click='login'>登录</div>
          <div class="entry" @click='exit'>退出</div>
        </div>
      </div>
    </div>
    <div class="nav">
      <img src="../imgs/banner.png" alt="">
    </div>
    <div class="top-menu flex flex-h-c">
      <div class="tm-item tc">
        <img src="../imgs/ic_dc.png" alt="">
        <div>
          <span class="s">20000+</span>
          <span>单词</span>
        </div>
      </div>
      <div class="tm-item tc">
        <img src="../imgs/ic_dy.png" alt="">
        <div>
          <span class="s">30000</span>
          <span>短语</span>
        </div>
      </div>
      <div class="tm-item tc">
        <img src="../imgs/ic_jz.png" alt="">
        <div>
          <span class="s">30000</span>
          <span>句子</span>
        </div>
      </div>
      <div class="tm-item tc">
        <img src="../imgs/ic_dw.png" alt="">
        <div>
          <span class="s">30000</span>
          <span>短文</span>
        </div>
      </div>
    </div>

    <div class="module-list flex flex-h-c">
      <div class="m-item">
        <div class="mi-nav flex-m">
          <div>考试</div>
            <img src="../imgs/img_index_ks1.png" alt="">
        </div>
        
        <div class="btn-group">
          <button class="btn">考试</button>
          <button class="btn">模拟</button>
        </div>
      </div>
      <div class="m-item">
        <div class="mi-nav">
            <div>训练</div>
            <img class="img" src="../imgs/img_index_xl.png" alt="">
        </div>
        
        <div class="btn-group">
          <button class="btn" @click='beginTest'>立即进入</button>
        </div>
      </div>
      <div class="m-item">
        <div class="mi-nav">
            <div>统计</div>
            <img src="../imgs/img_index_tj.png" alt="">
        </div>
        
        <div class="btn-group">
          <button class="btn">考试</button>
          <button class="btn">模拟</button>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class='footer-top'>
        <div class="outer flex-m">
          <img class="logo" src="../imgs/logo_white.png" alt="">
          <div class="ft-content flex flex-1">
            <div class="ft-meun-left">
              <div class="title">常用链接</div>
              <div class="list">
                <div class="item">图书馆资源</div>
                <div class="item">网络教学平台</div>
                <div class="item">后勤服务系统</div>
                <div class="item">领导信箱</div>
                <div class="item">学生缴费</div>
              </div>
            </div>
            <div class="ft-menu-right">
              <div>教务管理系统</div>
              <div>专业综合改革</div>
              <div>办公自动化系统</div>
              <div>电子邮件系统</div>
            </div>
            <div class="ft-code">
              <img src="../imgs/dhxy_07.png" alt="">
              <p class="tc">官方微博</p>
            </div>
            <div class="ft-code">
              <img src="../imgs/dhxy_08.png" alt="">
              <p class="tc">官方微信</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom tc">
        <div>学校地址：湖北省武汉市江夏区文化大道301号 邮编：430212</div>
        <div>武汉东湖学院：Wuhan Donghu University 版权所有 鄂ICP备15016581号</div>
        <div>鄂公网安备：42011502000398号</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLogin: false
    };
  },
  created () {
    this.isLogin = !!sessionStorage.token;
  },
  methods: {
    exit() {
      sessionStorage.removeItem('token');
      this.isLogin = false;
    },
    login() {
      this.$router.push('/login');
    },
    beginTest() {
      if(!this.isLogin) {
        this.$router.push('/login');
        return;
      }

      this.$router.push('/selectTopic');
    }
  }
};
</script>
<style lang='scss' scoped>
.index {
  .header {
    background: url("../imgs/head-bg.png") no-repeat;
    background-size: cover;
    .outer {
      width: 1000px;
      margin: 0 auto;
      .logo {
        width: 200px;
      }
      .h-menu {
        color: #fff;
        font-size: 14px;
        .list {
          padding: 0 15px;
          cursor: pointer;
        }
        .entry {
          padding: 0 20px;
          cursor: pointer;
          &.line {
            border-right: 2px solid #fff;
          }
        }
      }
    }
  }
  .nav {
    img {
      width: 100%;
      display: block;
    }
  }
  .top-menu {
    background-color: #eeeef0;
    padding: 30px 0;
    .tm-item {
      padding: 0 80px;
      img {
        width: 40px;
        height: 40px;
        margin-bottom: 8px;
      }
      span {
        color: #333;
        font-size: 14px;
        &.s {
          font-size: 18px;
        }
      }
    }
  }
  .module-list {
    padding: 40px 0;
    .m-item {
      width: 300px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 20px;
      img {
        width: 100%;
      }
      .btn-group {
        padding: 20px 60px 0;
        height: 150px;
        .btn {
          background: #1465b7;
          border-color: #1465b7;
          border-radius: 3px;
          outline: none;
          color: #fff;
          display: block;
          width: 100%;
          padding: 3px 0;
          margin-bottom: 15px;
        }
      }
    }
  }
  .footer {
    background: #0756B3;
    color: #fff;
    &-top {
      .outer {
        width: 900px;
        margin: 0 auto;
        padding: 8px 0;
        .logo {
          width: 200px;
          margin-right: 100px;
        }
        .ft-content {
          .ft-meun-left {
            margin-right: 80px;
            .title {
              color: #eee;
              font-size: 15px;
              margin-bottom: 12px;
            }
            .list {
              .item {
                font-size: 12px;
                color: #92b5de;
                line-height: 1.5;
              }
            }
          }
          .ft-menu-right {
            font-size: 12px;
            color: #92b5de;
            line-height: 1.5;
            margin-right: 80px;
            padding-top: 34px;
          }
          .ft-code {
            margin-right: 20px;
            padding-top: 20px;
            img {
              width: 80px;
            }
            p {
              font-size: 12px;
            }
          }
        }
      }
    }
    .footer-bottom {
      background: #1465b7;
      padding: 15px 0;
      div {
        color: #FFF;
        font-size: 12px;
        line-height: 1.5;
      }
    }
  }
}
</style>