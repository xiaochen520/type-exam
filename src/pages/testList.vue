<template>
  <div class="test-list">
    <div class="box">
      <Table :height='450' :columns="tbCol" :data="tbData"></Table>
    </div>
  </div>
</template>

<script>
  import api from '@/api';
  export default {
    data() {
      return {
        tbCol: [
          {
            title: '考试时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center'
          },
          {
            title: '文章名称',
            key: 'title',
            align: 'center'
          },
          {
            title: '类型',
            key: 'kind',
            align: 'center'
          },
          {
            title: '时间',
            key: 'time',
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.time + '分钟');
            }
          },
          {
            title: '正确率',
            key: 'accuracy',
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.accuracy + '%');
            }
          },
          {
            title: '成绩',
            key: 'score',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push('/selectTopic');
                    }
                  }
                }, '再考一次')
              ]);
            }
          }
        ],
        tbData: []
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.$get(api.scoreList, { userId: sessionStorage.userId }).then(res => {
          if (res.errno === 0) {
            this.tbData = res.data;
          }
        })
      }
    },
  };
</script>

<style lang='scss' scoped>
  .test-list {
    height: 100%;
    overflow: hidden;
    background-image: url("../imgs/exam-bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    .box {
      width: 1200px;
      margin: 50px auto;
    }
  }
</style>