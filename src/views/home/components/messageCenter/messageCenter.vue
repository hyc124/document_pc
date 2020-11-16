<template>
  <div class="messageCenter">
    <Maintitle @go_back="go_back" :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div
        v-infinite-scroll="handleInfiniteOnLoad"
        class="demo-infinite-container"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list :data-source="data">
          <a-list-item>
            <div class="message-list">
              <div class="message-item" v-for="(item,index) in data" :key="index">
                <div class="left">
                  <div class="icon"></div>
                  <div class="flex-col">
                    <div class="title">
                      <div class="name">{{item.coment}}</div>
                      <div class="new" v-if="item.new==1">NEW</div>
                    </div>
                    <div class="date">{{item.create_time}}</div>
                  </div>
                </div>
                <span @click="to_incoming(item)" class="look">立即查看</span>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </div>

      <NotFound v-show="data.length<=0" />
    </Maincontent>
  </div>
</template>

<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import { get_msg_remind, msg_my_handle } from "@/api/home.js";
import infiniteScroll from "vue-infinite-scroll";
import NotFound from "@/views/components/notFound.vue";
export default {
  directives: { infiniteScroll },
  components: {
    Maintitle,
    Maincontent,
    NotFound
  },
  data() {
    return {
      data: [],
      //动态加载
      loading: false,
      busy: false,
      page: 1,
      count: 0,
      // 头部返回开关
      titleObj: {
        retu: true
      }
    };
  },
  created() {
    this.get_msg_remind_list();
  },
  destroyed() {
    //更新铃铛数据
    this.$bus.$emit("updata_get_msg_count");
  },
  methods: {
    //消息提醒接口
    async get_msg_remind_list() {
      let { data, count } = await get_msg_remind({
        page: this.page
      });
      this.data = [...this.data, ...data.data];
      this.count = data.count;
    },
    //代办、待阅公文懒加载
    handleInfiniteOnLoad() {
      this.loading = true;

      if (this.data.length >= this.count) {
        this.busy = true;
        this.loading = false;
        return;
      }
      this.page++;
      this.get_msg_remind_list();
    },

    //详情
    async to_incoming(item) {
      await msg_my_handle({
        id: item.id
      });
      this.$router.push({
        path: "/home/incoming",
        query: {
          id: item.data_id,
          file_type: 1
        }
      });
    },
    go_back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.messageCenter {
  .demo-infinite-container {
    border-radius: 4px;
    overflow: auto;
    padding: 8px 24px;
    height: 600px;
    width: 100%;
  }
  .demo-loading-container {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
  .maincontent {
    padding: 20px;
  }
  .message-list {
    width: 100%;
    .message-item {
      display: flex;
      padding: 20px;
      height: 84px;
      // background: rgba(245, 247, 250, 1);
      margin-top: 20px;
      font-size: 16px;
      box-sizing: border-box;
      justify-content: space-between;
      &:hover {
        background: rgba(249, 252, 255, 1);
        .icon {
          width: 5px;
          height: 5px;
          background: rgba(0, 120, 240, 1);
          border-radius: 50%;
          opacity: 1;
        }
      }

      .title {
        display: flex;
        align-items: center;
        .new {
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 18px;
          background: rgba(245, 108, 108, 1);
          opacity: 1;
          border-radius: 2px;
          color: #fff;
          font-size: 10px;
        }
        .name {
          max-width: 800px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .look {
        margin-left: 30px;
        font-size: 12px;
        text-align: center;
        line-height: 25px;
        width: 68px;
        height: 25px;
        border: 1px solid rgba(0, 130, 239, 1);
        opacity: 1;
        border-radius: 2px;
        display: inline-block;
        color: rgba(0, 130, 239, 1);
        cursor: pointer;
      }
      .left {
        display: flex;
        align-items: center;
        .icon {
          display: inline-block;
          width: 44px;
          height: 44px;
          background: url("../../../../assets/home/lingdang.png");
          background-size: 44px 44px;
          border-radius: 50%;
          opacity: 1;
        }
        .flex-col {
          display: flex;
          flex-direction: column;
          margin-left: 16px;
          align-items: flex-start;
          .title {
          }
        }
      }
      .date {
        margin-top: 5px;
        font-size: 12px;
        color: #c0c4ccff;
      }
    }
  }
}
</style>