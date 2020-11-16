<template>
  <div class="MianBott">
    <div class="left">
      <div class="doc-data">
        <div class="d-title">
          <span class="d-title-TitleText title-dorder">公文数据</span>
          <a-select
            v-model="timer"
            style="width: 120px"
            @change="doc_handleChange"
          >
            <a-select-option :value="1">本周</a-select-option>
            <a-select-option :value="2">本月</a-select-option>
            <a-select-option :value="3">本年</a-select-option>
          </a-select>
        </div>
        <div class="d-content">
          <template v-for="(item, index) in left_data">
            <router-link v-if="item.onOff" :to="item.path" :key="index">
              <div class="d-item">
                <i class="icon" :class="'icon' + index"></i>
                <div class="text">
                  <span class="num">{{ item.count }}</span>
                  <span class="title">{{ item.title }}</span>
                </div>
              </div>
            </router-link>
          </template>
        </div>
      </div>
      <div class="report-form">
        <div class="nav">
          <div class="text title-dorder">公文统计</div>
          <div class="screen">
            <a-select v-model="company" @change="handleChange">
              <a-select-option :value="1">个人</a-select-option>
              <a-select-option :value="2">部门</a-select-option>
              <a-select-option :value="3">单位</a-select-option>
            </a-select>
            <a-select v-model="date" @change="handleChange2">
              <a-select-option :value="1">本周</a-select-option>
              <a-select-option :value="2">本月</a-select-option>
              <a-select-option :value="3">本年</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="content">
          <div
            v-show="is_has"
            ref="main_can"
            id="main_can"
            style="width: 850px; height: 100%"
          ></div>
          <NotFound v-show="!is_has" />
        </div>
      </div>
    </div>

    <div class="report-text">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="最新发文">
          <div class="report-list">
            <div
              class="report-item"
              @click="detail(item, 1)"
              v-for="(item, index) in new_document.myDocument"
              :key="index"
            >
              <a-tooltip>
                <template slot="title">{{ item.title }}</template>
                <p class="title">
                  {{ item.title }}
                  <i class="level">{{ item.process_urgent_level }}</i>
                </p>
              </a-tooltip>
              <div class="bottom">
                <span class="name">{{ item.name }}</span>
                <span class="date">{{ item.create_time }}</span>
              </div>
            </div>
          </div>
          <NotFound v-show="new_document.myDocument.length <= 0" />
          <router-link
            to="/library"
            v-if="
              new_document.myDocument.length > 0 &&
              jurisdiction[1] != undefined &&
              jurisdiction[1].includes('post_is')
            "
          >
            <div class="look_more">
              <span>查看更多</span>
              <i class="jiantou"></i>
            </div>
          </router-link>
        </a-tab-pane>
        <a-tab-pane key="2" tab="最新收文">
          <div class="report-list">
            <div
              class="report-item"
              @click="detail(item, 2)"
              v-for="(item, index) in new_document.myReceive"
              :key="index"
            >
              <a-tooltip>
                <template slot="title">{{ item.title }}</template>
                <p class="title">
                  {{ item.title }}
                  <i class="level">{{ item.process_urgent_level }}</i>
                </p>
              </a-tooltip>

              <div class="bottom">
                <span class="name">{{ item.name }}</span>
                <span class="date">{{ item.create_time }}</span>
              </div>
            </div>
          </div>
          <NotFound v-show="new_document.myReceive.length <= 0" />
          <router-link
            to="/getlibrary"
            v-if="
              new_document.myReceive.length > 0 &&
              jurisdiction[2] != undefined &&
              jurisdiction[2].includes('get_is')
            "
          >
            <div class="look_more">
              <span>查看更多</span>
              <i class="jiantou"></i>
            </div>
          </router-link>
        </a-tab-pane>
        <a-tab-pane key="3" tab="最新签报">
          <div class="report-list">
            <div
              class="report-item"
              @click="detail(item, 3)"
              v-for="(item, index) in new_document.mySign"
              :key="index"
            >
              <a-tooltip>
                <template slot="title">{{ item.title }}</template>
                <p class="title">
                  {{ item.title }}
                  <i class="level">{{ item.process_urgent_level }}</i>
                </p>
              </a-tooltip>

              <div class="bottom">
                <span class="name">{{ item.name }}</span>
                <span class="date">{{ item.create_time }}</span>
              </div>
            </div>
          </div>
          <NotFound v-show="new_document.mySign.length <= 0" />
          <router-link
            to="/signlibrary"
            v-if="
              new_document.mySign.length > 0 &&
              jurisdiction[3] != undefined &&
              jurisdiction[3].includes('sign_is')
            "
          >
            <div class="look_more">
              <span>查看更多</span>
              <i class="jiantou"></i>
            </div>
          </router-link>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  get_statistics_data,
  get_new_document,
  get_document_data,
} from "@/api/home.js";
import NotFound from "@/views/components/notFound.vue";
export default {
  components: { NotFound },
  methods: {
    handleChange() {},
  },
  data() {
    return {
      //报表数据
      data: null,

      all_value: null,
      //报表是否有记录
      is_has: true,
      //下拉选项
      company: 1,
      date: 1,
      //最新收文发文签报标题
      title_list: ["最新发文", "最新收文", "最新签报"],
      //最新收文发文签报内容
      new_document: {
        myDocument: [],
        myReceive: [],
        mySign: [],
      },

      //公文数据
      //时间
      timer: 1,
      left_data: [],
      nav_list: [
        "发起的公文",
        "待我审核的公文",
        "已办发文",
        "已办收文",
        "已办签报",
      ],
    };
  },
  mounted() {
    this.get_statistics();
    this.rendering();
    this.get_new_document_list();
    this.get_document_list();
  },
  methods: {
    //公文数据获取
    async get_document_list() {
      let { code, data } = await get_document_data({
        type: this.timer,
      });
      this.left_data = this.processing(data);
    },
    //公文数据处理
    processing(dt) {
      let count_arr = [
        "myCount",
        "pendingCount",
        "isFileCount",
        "isPendingCount",
        "signOffCount",
      ];
      let _arry = ["已办发文", "已办收文", "已办签报"];
      return count_arr.map((el, inx) => {
        let _onOff = true;
        if (this.nav_list[inx] == "已办发文") {
          _onOff = this.jurisdiction[1] != undefined;
        } else if (this.nav_list[inx] == "已办收文") {
          _onOff = this.jurisdiction[2] != undefined;
        } else if (this.nav_list[inx] == "已办签报") {
          _onOff = this.jurisdiction[3] != undefined;
        }
        return {
          title: this.nav_list[inx],
          count: dt[count_arr[inx]],
          path: this.processing2(count_arr[inx]),
          onOff: _onOff,
        };
      });
    },
    //公文数据处理2
    processing2(val) {
      let path = "";
      switch (val) {
        case "myCount":
          path = `/launchDocument?type=${this.timer}`;
          break;
        case "pendingCount":
          path = `/waitDocument?type=${this.timer}`;
          break;
        case "isFileCount":
          path = "/library";
          break;
        case "isPendingCount":
          path = "/getlibrary";
          break;
        case "signOffCount":
          path = "/signlibrary";
          break;
      }
      return path;
    },
    //报表数据获取
    async get_statistics(type = 1, status = 1) {
      let { data, code } = await get_statistics_data({
        type,
        status,
      });
      this.data = [
        { value: null, name: "发文数" },
        { value: null, name: "收文数" },
        { value: null, name: "签报数" },
      ];
      if (data) {
        this.all_value =
          parseInt(data.myCount) +
          parseInt(data.myReceiveCount) +
          parseInt(data.mySignCount);
        this.data[0].value = data.myCount;
        this.data[1].value = data.myReceiveCount;
        this.data[2].value = data.mySignCount;
        this.rendering();
        if (this.all_value && this.all_value > 0) {
          this.is_has = true;
        } else {
          this.is_has = false;
        }
      } else {
        this.is_has = false;
      }
    },
    async get_new_document_list() {
      let { code, data } = await get_new_document();

      for (let v in data) {
        if (data[v]) {
          data[v].map((v) => {
            if (v.process_urgent_level == 1) {
              return (v.process_urgent_level = "普通");
            }
            if (v.process_urgent_level == 2) {
              return (v.process_urgent_level = "紧急");
            }
            if (v.process_urgent_level == 3) {
              return (v.process_urgent_level = "加急");
            }
          });
        }
      }

      this.new_document = data;
    },
    //公文数据下拉框触发
    doc_handleChange() {
      this.get_document_list();
    },
    //报表渲染
    rendering() {
      let option = {
        color: ["#FFD08B", "#6A9BFF", "#5DE9AC"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 160,
          top: 20,
          icon: "rect",
          itemWidth: 22,
          itemHeight: 20,
          data: this.data,
          itemGap: 25,
          color: " #606266FF",
          textStyle: { fontSize: 16 },
          formatter: (name) => {
            let that_val = null;
            let that_name = null;

            if (this.data) {
              this.data.forEach((el) => {
                if (name == el.name) {
                  that_val = el.value;
                }
              });
            }

            return (
              "  " +
              ` ${name}              ${that_val}   (${(
                (that_val / this.all_value) *
                100
              ).toFixed(0)}%)`
            );
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            // radius: ["40%", "70%"],
            radius: ["50%", "75%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            left: -200,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "normal",
              },
            },
            itemStyle: {},
            labelLine: {
              show: false,
            },
            data: this.data,
            //  [
            //   { value: 8, name: "发文数" },
            //   { value: 4, name: "收文数" },
            //   { value: 6, name: "签报数" }
            // ]
          },
        ],
      };
      var myChart = echarts.init(this.$refs.main_can);
      myChart.setOption(option);
    },

    //详情
    detail(item, inx) {
      this.$router.push({
        path: "/home/incoming",
        query: {
          id: item.id,
          file_type: inx,
        },
      });
    },
    //下拉触发
    handleChange(val) {
      this.get_statistics(this.date, this.company);
    },
    handleChange2(val) {
      this.get_statistics(this.date, this.company);
    },
  },
  computed: {
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction;
    },
  },
};
</script>

<style lang="less" scoped>
.MianBott {
  display: flex;
  margin-top: 16px;
  .left {
    display: flex;
    flex-direction: column;
    flex: 1;
    .doc-data {
      display: flex;
      flex-direction: column;
      background: white;
      margin-bottom: 16px;
      .d-title {
        padding: 0 20px;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        box-shadow: 0px 1px 0px rgba(242, 242, 242, 1);
        .d-title-TitleText {
          font-size: 16px;
          color: #303133;
          font-weight: 500;
        }
        /deep/ .ant-select {
          width: 80px !important;
          height: 32px;
          opacity: 1;
          border-radius: 3px;
          .ant-select-selection {
            background: rgba(255, 255, 255, 1);
            .ant-select-selection-selected-value {
              color: #606266;
            }
          }
        }
      }
      .d-content {
        height: 105px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        .d-item {
          display: flex;
          align-items: center;
          height: 42px;
          margin-right: 40px;
          .icon {
            width: 42px;
            height: 42px;
            border-radius: 50%;
          }
          .icon0 {
            background: url("../../../assets/addpostset/icon1.png") no-repeat;
            background-size: 42px 42px;
          }
          .icon1 {
            background: url("../../../assets/addpostset/icon2.png") no-repeat;
            background-size: 42px 42px;
          }
          .icon2 {
            background: url("../../../assets/addpostset/icon3.png") no-repeat;
            background-size: 42px 42px;
          }
          .icon3 {
            background: url("../../../assets/addpostset/icon4.png") no-repeat;
            background-size: 42px 42px;
          }
          .icon4 {
            background: url("../../../assets/addpostset/icon5.png") no-repeat;
            background-size: 42px 42px;
          }
          .text {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            line-height: 1.2;
            .num {
              font-size: 20px;
              font-weight: 600;
              color: #303133;
              height: 28px;
            }
            .title {
              color: #606266;
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
      }
    }
    .report-form {
      background: white;
      height: 235px;
      box-sizing: border-box;
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        box-shadow: 0px 1px 0px rgba(242, 242, 242, 1);
        padding: 0 20px;
        .text {
          font-size: 16px;
        }
        .screen {
          width: 190px;
          display: flex;
          justify-content: space-between;
          /deep/ .ant-select {
            width: 80px !important;
            height: 32px;
            border-radius: 3px;
            .ant-select-selection {
              background: rgba(255, 255, 255, 1);
              .ant-select-selection-selected-value {
                color: #606266;
              }
            }
          }
        }
      }
      .content {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 850px;
        height: 185px;
        padding: 10px 0;
        box-sizing: border-box;
        #main_can {
          width: 100%;
          margin: 0 auto;
          height: 100%;
          div {
            width: 100% !important;
          }
        }
        .not-found {
          display: flex;
          justify-content: space-between;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 334px;
          height: 100px;
          border-radius: 4px;
          text-align: center;
          .n-left {
            width: 72px;
            height: 100px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .n-right {
            color: #909399;
            font-size: 12px;
            text-align: left;
            h2 {
              color: #303133;
              font-size: 16px;
              margin: 0;
            }
            p {
              margin: 0;
            }
            .tips {
              margin-top: 5px;
            }
            .reason {
              margin-top: 16px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .report-text {
    background: white;
    width: 416px;
    margin-left: 16px;
    /deep/.ant-tabs-bar {
      margin-bottom: 0;
    }
    /deep/.ant-tabs-tab {
      height: 50px;
      box-sizing: border-box;
      padding: 18px 0;
      margin: 0 35px;
      font-size: 16px;
    }
    .report-list {
      padding: 0 20px;
      margin-top: 6px;
      height: 314px;
      overflow-y: scroll;
      margin-bottom: 10px;
      box-sizing: border-box;
      .report-item {
        height: 81px;
        padding: 2px 0;
        cursor: pointer;
        transition: all 0.3s;
        margin-left: 6px;
        // &:hover {
        // }

        .title {
          display: flex;
          justify-content: space-between;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
          margin-bottom: 10px;
          color: #303133;
          font-weight: 500;
          .level {
            display: inline-block;
            width: 35px;
            height: 18px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(239, 120, 120, 1);
            opacity: 1;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: rgba(239, 120, 120, 1);
            font-style: normal;
            text-align: center;
          }
        }
        .name {
          color: #909499;
          font-size: 12px;
        }

        .bottom {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .look_more {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #909399;
      font-size: 12px;
      cursor: pointer;
      .jiantou {
        width: 6px;
        height: 11px;
        background: url("../../../assets/home/jiantou.png");
        background-size: 6px 11px;
        margin-left: 5px;
      }
    }
  }
  .title-dorder {
    height: 16px;
    display: flex;
    align-items: center;
    border-left: 3px solid #0078f0;
    padding-left: 8px;
    color: #303133;
  }
}
</style>