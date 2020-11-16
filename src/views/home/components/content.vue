<template>
  <div class="content">
    <div class="left shadow">
      <div class="nav" v-if="nav_num.allCount > 0">
        <router-link to="/messagecenter">
          <div class="notice">
            <i class="icon"></i>
            <p class="text">
              您有
              <span class="all">{{ nav_num.allCount }}</span>
              件待办事项需处理，其中有
              <span class="urgents">{{ nav_num.urgentCount }}</span>
              件紧急，有
              <span class="wait">{{ nav_num.waitRead }}</span>
              件待阅读需要处理
            </p>
          </div>
        </router-link>
      </div>
      <div class="doc">
        <div class="doc-title">
          <div
            class="item"
            @click="doc_title_change(1)"
            :class="{ active: where_doc == 1 }"
          >
            <staydoSvg />
            <span>待办公文</span>
          </div>
          <div
            class="item"
            @click="doc_title_change(2)"
            :class="{ active: where_doc == 2 }"
          >
            <div
              class="tip"
              v-show="where_doc != 2 && this.count.waitRead > 0 && show_dian"
            ></div>
            <commissionSvg />
            <span>待阅公文</span>
          </div>
        </div>
        <div class="doc-body">
          <div
            v-infinite-scroll="handleInfiniteOnLoad"
            class="demo-infinite-container"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <a-list :data-source="data_list">
              <a-list-item>
                <div class="doc-list">
                  <div
                    class="doc-item"
                    @click="detail(item)"
                    v-for="(item, index) in data_list"
                    :key="index"
                  >
                    <div class="flex-col">
                      <div class="text">
                        <span class="title">
                          <span class="title-name">{{ item.title }}</span>
                          <img
                            v-if="where_doc == 1"
                            :src="item.add_urgent"
                            alt
                            width="35"
                            height="18"
                            style="marginleft: 4px"
                          />
                          <span
                            class="read-state lw-ellipsis"
                            :style="`border: 1px solid ${item.doc.color};color:${item.doc.color};`"
                            v-if="where_doc == 2"
                            >{{ item.doc.text }}</span
                          >
                        </span>
                        <span class="name">{{ item.name }}</span>
                      </div>
                    </div>
                    <div class="doc-right">
                      <span class="time">{{ item.create_time }}</span>
                    </div>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>
          <NotFound v-show="data_list.length <= 0" />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="nav shadow">
        <NotFound v-if="NotFoundOnOff" />
        <div
          class="line"
          v-if="
            (get_jurisdiction[1] && get_jurisdiction[1].includes('post_is')) ||
            (get_jurisdiction[2] && get_jurisdiction[2].includes('get_is'))
          "
        >
          <router-link
            to="/draft/quickPost"
            v-if="
              get_jurisdiction[1] && get_jurisdiction[1].includes('post_is')
            "
          >
            <div class="item">
              <div class="icon icon1"></div>
              <span>快速发文</span>
            </div>
          </router-link>
          <router-link
            to="/ingetdraft"
            v-if="get_jurisdiction[2] && get_jurisdiction[2].includes('get_is')"
          >
            <div class="item">
              <div class="icon icon2"></div>
              <span>收文登记</span>
            </div>
          </router-link>
        </div>
        <div
          class="line"
          v-if="
            (get_jurisdiction[1] && get_jurisdiction[1].includes('post_is')) ||
            (get_jurisdiction[3] && get_jurisdiction[3].includes('sign_is'))
          "
        >
          <router-link
            to="/draft"
            v-if="
              get_jurisdiction[1] && get_jurisdiction[1].includes('post_is')
            "
          >
            <div class="item">
              <div class="icon icon3"></div>
              <span>发文拟稿</span>
            </div>
          </router-link>
          <router-link
            to="/signeddraft"
            v-if="
              get_jurisdiction[3] && get_jurisdiction[3].includes('sign_is')
            "
          >
            <div class="item">
              <div class="icon icon4"></div>
              <span>签报拟稿</span>
            </div>
          </router-link>
        </div>
      </div>
      <div class="contents shadow">
        <div class="xian">
          <p class="title">常用模板</p>
        </div>
        <div class="body">
          <div
            class="item"
            v-for="(item, index) in get_use_templete"
            :key="index"
            @click="add_document(item)"
          >
            <i class="icon"></i>
            <span>{{ item.temp_name }}</span>
          </div>
          <NotFound v-show="get_use_templete.length == 0" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let doc_obj = {
  0: {
    text: "传阅",
    color: "#0082EF",
  },
  1: {
    text: "抄送",
    color: "#0082EF",
  },
  2: {
    text: "分发",
    color: "#0082EF",
  },
  3: {
    text: "已签收",
    color: "#62C232",
  },
  4: {
    text: "被退回",
    color: "#F56C6C",
  },
  5: {
    text: "新审核",
    color: "#0082EF",
  },
  6: {
    text: "已超期",
    color: "#F56C6C",
  },
  7: {
    text: "已完成",
    color: "#62C232",
  },
  8: {
    text: "已报废",
    color: "#818181",
  },
  9: {
    text: "已完成",
    color: "#62C232",
  },
};
import {
  get_document_data,
  get_wait_document,
  templete_select,
} from "@/api/home.js";
import commissionSvg from "./svg/commissionSvg.vue";
import staydoSvg from "./svg/staydoSvg.vue";
import { get_wait_file_count } from "@/api/home.js";
import NotFound from "@/views/components/notFound.vue";
import infiniteScroll from "vue-infinite-scroll";
export default {
  directives: { infiniteScroll },
  data() {
    return {
      doc_obj,
      nav_list: [
        "发起的公文",
        "待处理公文",
        "已办公文",
        "已办收文",
        "已办签报",
      ],
      left_data: [],
      doc_data: [
        {
          d_class: "normal",
          title: "集团发文会审集团发文会审集团发文会审xxxxxxx",
          name: "吴亦凡",
          time: "2018-05-10",
        },
        {
          d_class: "urgent",
          title: "集团发文会审集团发文会审集团发文会审xxxxxxx",
          name: "吴亦凡",
          time: "2018-05-10",
        },
        {
          d_class: "so-urgent",
          title: "集团发文会审集团发文会审集团发文会审xxxxxxx",
          name: "吴亦凡",
          time: "2018-05-10",
        },
        {
          d_class: "so-urgent",
          title: "集团发文会审集团发文会审集团发文会审xxxxxxx",
          name: "吴亦凡",
          time: "2018-05-10",
        },
        {
          d_class: "so-urgent",
          title: "集团发文会审集团发文会审集团发文会审xxxxxxx",
          name: "吴亦凡",
          time: "2018-05-10",
        },
      ],

      nav_num: { allCount: "", urgentCount: "", waitRead: "" },

      //待阅、代办
      //选择的待阅（1）还是待办（2）
      where_doc: 1,
      data_list: [],
      count: {},

      //常用模板
      allways_template: [],
      // 红点显示
      redvisible: true,

      //动态加载
      loading: false,
      busy: false,
      page: 1,

      //控制红点显示
      show_dian: true,
    };
  },
  components: {
    commissionSvg,
    staydoSvg,
    NotFound,
  },
  filters: {},
  created() {
    this.get_wait_document_list();
    this.get_templete_select();
  },

  methods: {
    //tab切换
    doc_title_change(val) {
      if (val == 2) {
        this.show_dian = false;
      }
      this.where_doc = val;
      this.data_list = [];
      this.page = 1;
      this.get_wait_document_list();
    },

    //代办、待阅公文数据获取
    async get_wait_document_list() {
      let { data, code, other } = await get_wait_document({
        page: this.page,
        type: this.where_doc,
      });
      this.nav_num = other;
      if (this.where_doc == 1) {
        this.data_list = [...this.data_list, ...data.pendingFile];
        this.data_list.forEach((el) => {
          if (el.ff_lab == 1) {
            el.add_urgent = require("@/assets/addpostset/get-wen.png");
          } else {
            if (!el.add_urgent) {
              switch (el.process_urgent_level) {
                case 1:
                  el.add_urgent = require("@/assets/addpostset/normal.png");
                  break;
                case 2:
                  el.add_urgent = require("@/assets/addpostset/urgent.png");
                  break;
                case 3:
                  el.add_urgent = require("@/assets/addpostset/so-urgent.png");
                  break;
              }
            }
          }
        });
      } else {
        let that = this;
        this.data_list = [...this.data_list, ...data.toBeRead];
        this.data_list.forEach((el) => {
          el.doc = that.doc_obj[el.doc_type];
        });
      }
      this.count = other;
    },
    //代办、待阅公文懒加载
    handleInfiniteOnLoad() {
      let count = null;
      if (this.where_doc == 1) {
        count = this.count.allCount;
      } else {
        count = this.count.waitRead;
      }
      if (this.data_list.length >= count) {
        return false;
      }
      this.page++;
      this.get_wait_document_list();
    },

    //详情页面
    detail(item) {
      if (this.get_jurisdiction) {
        this.$router.push({
          path: "/home/incoming",
          query: {
            id: item.id,
            file_type: this.where_doc == 1 ? item.type : item.btype || 1,
            cut: 5,
          },
        });
      }
    },
    //常用模板数据获取
    async get_templete_select() {
      let { data } = await templete_select();
      if (data.allways_use && data.allways_use.resource) {
        this.allways_template = data.allways_use.resource;
      }
    },
    //添加发文   http://localhost:8080/draft/addDraft?id=22&file_type=1
    add_document(item) {
      this.$router.push({
        path: "/draft/addDraft",
        query: {
          id: item.id,
          type: 1,
        },
      });
    },

    //切换触发(代办/待阅)
    callback(key) {
      if (key == 2) {
        this.redvisible = false;
      } else {
        if (this.toBeRead.length > 0) {
          this.redvisible = true;
        }
      }
    },
    //公文数据下拉框触发
    handleChange(val) {
      this.get_document_list(val);
    },
  },
  computed: {
    Nav_num() {
      return this.nav_num.waitRead;
    },
    // 获取权限判断
    get_jurisdiction() {
      return this.$store.state.jurisdiction;
    },
    // 判断发文收文是否有权限，没有权限就显示统一缺省页面
    NotFoundOnOff() {
      let get_jurisdiction = this.$store.state.jurisdiction;
      return (
        (get_jurisdiction[1] == undefined ||
          !get_jurisdiction[1].includes("post_is")) &&
        (get_jurisdiction[2] == undefined ||
          !get_jurisdiction[2].includes("get_is")) &&
        (get_jurisdiction[3] == undefined ||
          !get_jurisdiction[3].includes("sign_is"))
      );
    },
    get_use_templete() {
      let new_arr = [];
      this.allways_template.forEach((el) => {
        let new_obj = {
          1: "post_is",
          2: "get_is",
          3: "sign_is",
        };
        if (
          this.get_jurisdiction[el.type] &&
          this.get_jurisdiction[el.type].includes(new_obj[el.type])
        ) {
          new_arr.push(el);
        }
      });
      return new_arr;
    },
  },
};
</script>
<style lang="less" scoped>
.demo-infinite-container {
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
  width: 100%;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
.content {
  display: flex;
  a {
    color: black;
  }
  .left {
    display: flex;
    flex-direction: column;
    flex: 1;
    .nav {
      background: white;
      h2 {
        border-bottom: 1px solid rgba(97, 97, 97, 0.16);
        padding-bottom: 15px;
        font-size: 18px;
        color: #303133;
        font-weight: 600;
      }
      .notice {
        height: 42px;
        background: rgba(246, 249, 255, 1);
        border-radius: 2px;
        padding: 10px 20px;
        display: flex;
        color: #303133ff;
        cursor: pointer;
        .icon {
          display: block;
          width: 24px;
          height: 24px;
          background: url("../../../assets/addpostset/notice.png") no-repeat;
          background-size: 24px 24px;
        }
        .text {
          color: #303133;
          margin-left: 10px;
          font-size: 14px;
          .urgents {
            color: rgb(246, 92, 93);
          }
          .wait {
            color: #1492e6;
          }
        }
      }
    }
    .doc {
      padding: 20px;
      background: white;
      box-sizing: border-box;
      flex: 1;
      .doc-title {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 117px;
          height: 36px;
          background: rgba(235, 237, 240, 1);
          border-radius: 18px;
          color: #909399;
          font-weight: 500;
          font-size: 16px;
          margin-right: 24px;
          cursor: pointer;
          transition: all 0.4s;
          span {
            margin-left: 8px;
          }
          .tip {
            position: absolute;
            top: 4px;
            right: 6px;
            width: 8px;
            height: 8px;
            background: rgba(255, 0, 0, 1);
            border-radius: 50%;
          }
        }
        .active {
          background: #0078f0;
          color: white;
        }
      }
      .doc-body {
        position: relative;
        margin-top: 15px;
      }
      .doc-list {
        width: 100%;
        height: 320px;
        padding: 0 10px;
        box-sizing: border-box;
        .doc-item {
          display: flex;
          height: 81px;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;
          color: #303133ff;
          box-shadow: 0px 1px 0px rgba(242, 242, 242, 1);
          margin-bottom: 1px;
          cursor: pointer;
          transition: all 0.3s;
          i {
            font-size: 12px;
          }
          &:hover {
            background: rgba(251, 251, 251, 1);
            color: #0082efff;
          }

          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10px;
            font-size: 16px;
            width: 600px;
            .title {
              display: flex;
              align-items: center;
              width: 600px;
              font-size: 16px;
              font-weight: 500;
              color: rgba(48, 49, 51, 1);
              .title-name {
                max-width: 500px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: 10px;
              }
            }
            .name {
              font-size: 12px;
              color: #909399;
              font-weight: 400;
              margin-top: 10px;
            }
          }

          .doc-right {
            height: 52px;
            box-sizing: border-box;
            .time {
              line-height: 80px;
              color: #909399;
            }
          }
        }
      }
      .list2 {
        .doc-item {
          .wait-icon {
            display: inline-block;
            width: 35px;
            height: 18px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(239, 120, 120, 1);
            opacity: 1;
            font-size: 12px;
            font-weight: 400;
            color: rgba(239, 120, 120, 1);
            text-align: center;
            line-height: 16px;
            font-style: normal;
            margin-left: 4px;
            transition: all 0.3s;
          }
        }
      }
    }
  }
  .right {
    margin: 0 0 0 16px;
    width: 416px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    box-sizing: border-box;
    .nav {
      height: 198px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      background: white;
      position: relative;
      padding: 10px 0;
      .line {
        flex: 1;
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
          display: flex;
          align-items: center;
          .icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 13px;
          }
          .icon1 {
            background: url("../../../assets/home/icon1.png");
            background-size: 48px 48px;
          }
          .icon2 {
            background: url("../../../assets/home/icon2.png");
            background-size: 48px 48px;
          }
          .icon3 {
            background: url("../../../assets/home/icon3.png");
            background-size: 48px 48px;
          }
          .icon4 {
            background: url("../../../assets/home/icon4.png");
            background-size: 48px 48px;
          }
          span {
            color: #303133;
            font-size: 16px;
          }
        }
      }
    }
    .contents {
      height: 246px;
      background: white;
      margin-top: 16px;
      padding: 0 20px 20px 20px;
      box-sizing: border-box;
      .title {
        display: flex;
        align-items: center;
        height: 16px;
        font-size: 16px;
        color: rgba(48, 49, 51, 1);
        font-weight: 500;
        border-left: 3px solid rgba(0, 120, 240, 1);
        padding-left: 8px;
        margin: 0;
      }
      .xian {
        display: flex;
        align-items: center;
        height: 50px;
        box-shadow: 0px 1px 0px rgba(242, 242, 242, 1);
      }
      .body {
        position: relative;
        overflow-y: scroll;
        height: 160px;
        box-sizing: border-box;
        box-sizing: border-box;
        .item {
          display: flex;
          align-items: center;
          width: 100%;
          height: 36px;
          color: #303133;
          padding-left: 10px;
          margin-bottom: 8px;
          cursor: pointer;
          &:hover {
            background: rgba(0, 125, 249, 0.05);
            color: #0082ef !important;
            .icon {
              width: 16px;
              height: 19px;
              background: url("../../../assets/home/document_active.png");
              background-size: 16px 19px;
            }
          }
          .icon {
            width: 16px;
            height: 19px;
            background: url("../../../assets/home/document.png");
            background-size: 16px 19px;
          }
          span {
            margin-left: 20px;
          }
        }
      }
    }
    .ant-tabs-tabpane {
      height: 440px;
      background: white;
    }
  }
}

.read-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  height: 18px;
  line-height: 18px;
  max-width: 48px;
  min-width: 35px;
  font-size: 12px;
  margin-left: 10px;
}
</style>
