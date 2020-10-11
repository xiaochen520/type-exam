<template>
  <div class="login flex">
    <div class="side flex-1"></div>
    <div class="login-box">
      <div class="outer">
        <p class="title">欢迎登录</p>
        <p class="sub-title">请使用您本人的学号密码登录</p>
        <div>
          <input v-model='user' class="form-item" type="text" />
          <input v-model='psd' class="form-item" type="password" />
          <div class="save-pw flex-m">
            <input v-model='memory' type="checkbox" />
            <span>记住用户名</span>
          </div>
          <button class="login-btn" @click='login'>登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/api';
  export default {
    data() {
      return {
        user: '',
        psd: '',
        memory: true
      };
    },
    created() {
      this.user = sessionStorage.user;
    },
    methods: {
      login() {
        if (!this.user) {
          alert('请输入账户');
          return;
        }

        if (!this.psd) {
          alert('请输入密码');
          return;
        }

        const params = {
          studentNumber: this.user,
          password: this.psd
        }

        this.$post(api.login, params).then(res => {
          if (res.code == 0) {
            this.$Message.success({
              content: '登录成功',
              onClose: () => {
                sessionStorage.setItem('token', res.token);
                sessionStorage.setItem('user', this.user);
                sessionStorage.setItem('code', res.code);
                sessionStorage.setItem('userId', res.userId);
                this.$router.push('/');
              }
            })
          } else {
            this.$Message.error(res.msg);
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  };
</script>
<style lang='scss' scoped>
  .login {
    height: 100%;
    overflow: hidden;
    .side {
      height: 100%;
      background: url("../imgs/login-bg.png") no-repeat;
      background-size: 100%;
    }
    .login-box {
      padding: 0 60px;
      height: 100%;
      width: 400px;
      display: table;
      .outer {
        display: table-cell;
        vertical-align: middle;
        .title {
          font-size: 30px;
          font-weight: bold;
          color: #1466b8;
          margin-bottom: 10px;
        }
        .sub-title {
          font-size: 13px;
          color: #9a9a9a;
          margin-bottom: 15px;
        }
        .form-item {
          display: block;
          width: 100%;
          margin-bottom: 12px;
          padding: 3px 10px;
          &:focus {
            border-color: #1465B7;
          }
        }
        .save-pw {
          color: #929292;
          font-size: 12px;
          margin-bottom: 30px;
          input {
            margin-right: 10px;
          }
        }
      }
      .login-btn {
        width: 100%;
        background-color: #1466b8;
        color: #fff;
        height: 36px;
        line-height: 36px;
        padding: 0;
      }
    }
  }
</style>