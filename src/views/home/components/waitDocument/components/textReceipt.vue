<template>
  <div class="sign">
    <!-- 搜索 -->
    <div class="t-head search">
      <div class="left">
        <div class="search-ipt">
          <a-input-search
            placeholder="请输入关键字"
            :maxLength="20"
            @search="search"
            enter-button
            v-model="search_ipt"
          />
        </div>
        <div class="senior" @click="change_search">
          <span class="open-search">高级搜索</span>
          <i class="sanjiao xia" v-show="search_flag"></i>
          <i class="sanjiao shang" v-show="!search_flag"></i>
        </div>
        <SeniorSearch class="SeniorSearch" :obj="obj" @oninSearch="oninSearch" ref="searchDetail" />
      </div>
      <div class="right flex-col">
        <router-link to="draft/addDraft">
          <a-button type="primary">新建</a-button>
        </router-link>
        <div class="export"></div>
        <a-button @click="addDocumentExcelout" :disabled="comIds">导出</a-button>
        <a-button @click="batchPrinting(1)">批量打印</a-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="content">
      <div class="table-content-at" :style="{height:`${height+45+30 }px`}">
        <a-table
          @change="Change"
          :columns="columns"
          :row-selection="checkBoxSelect(ids)"
          :data-source="list"
          :pagination="false"
          :customRow="rowClick"
          :scroll="{ y: height }"
        >
          <span slot="process_urgent_level" slot-scope="item,record">
            <span
              class="urgency"
              :class="record.jjcd==1?'normal':record.jjcd==2?'urgent':'so-urgent'"
            >{{record.process_urgent_level}}</span>
          </span>
          <span
            class="status"
            :class="'status'+record.status"
            slot="word_no"
            slot-scope="item,record"
          >
            <span>{{record.word_no}}</span>
          </span>
          <span
            class="status"
            :class="'status'+record.status"
            slot="state"
            slot-scope="item,record"
          >
            <i class="status-dian"></i>
            <span>{{record.state}}</span>
          </span>
        </a-table>
      </div>

      <a-pagination
        v-model="current"
        :total="count"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        @change="page_change"
        show-size-changer
        @showSizeChange="onShowSizeChange"
      ></a-pagination>
    </div>
    <a-modal class="preview-modal z1000" v-model="ViewDocument.vis2" footer>
      <div id="print" ref="print">
        <template v-for="item in view_data">
          <ViewDocument
            :key="item.id"
            :ViewDocument="ViewDocument"
            :datas="item"
            v-show="ViewDocument.vis2"
          />
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script>
import SeniorSearch from "@/views/components/seniorSearch/seniorSearch.vue";
import {
  checkBoxSelect,
  filldownload,
  getDates,
  get_time,
  Calculatedaltitude,
} from "@/js/public.js";
import { documentExcelout } from "@/api/public.js";
import ViewDocument from "@/views/components/viewDocument.vue";
import { document_information } from "@/api/public.js";
export default {
  props: {
    list: {
      default: null,
    },
    count: {
      default: null,
    },
  },
  data() {
    return {
      checkBoxSelect, // 表单多选按钮点击函数挂载
      ids: {
        // 嵌套是因为引用类型，函数里改了数据外面就可以直接使用
        ids: "", // 多选按钮选中文件id
        selectedRowKeys: [],
      },
      //高级展开/收起搜索
      search_flag: true,

      //搜索分类导航
      search_class_nav: 1,
      //表头标题
      columns: [
        {
          title: "收文标题",
          dataIndex: "title",
          width: 118,
          ellipsis: true,
        },
        {
          title: "收文字号",
          dataIndex: "word_no",
          sorter: (a, b) => a.word_no - b.word_no,
          scopedSlots: { customRender: "word_no" },
          width: 150,
          ellipsis: true,
        },
        {
          title: "收文单位",
          dataIndex: "dep_name",
          width: 116,
          ellipsis: true,
        },
        {
          title: "拟稿人",
          dataIndex: "name",
          width: 116,
          ellipsis: true,
        },
        {
          title: "接收日期",
          dataIndex: "create_time",
          sorter: (a, b) => a.create_time - b.create_time,
          width: 150,
          ellipsis: true,
        },
        {
          title: "紧急程度",
          dataIndex: "process_urgent_level",
          scopedSlots: { customRender: "process_urgent_level" },
          width: 100,
          ellipsis: true,
          sorter: (a, b) => a.process_urgent_level - b.process_urgent_level,
        },
        {
          title: "收文状态",
          dataIndex: "state",
          scopedSlots: { customRender: "state" },
          width: 100,
          ellipsis: true,
        },
        {
          width: 200,
          title: "当前处理人/当前部门",
          dataIndex: "current",
          key: "current",
          ellipsis: true,
        },
      ],
      // 排序
      table_data: {
        order_field: null,
        sort: null,
      },
      //数据
      data: [],
      //分页
      current: 1,
      height: null,

      // 搜索
      search_ipt: "",

      //分类
      // status: 0,
      //当前页条数
      pageSizeOptions: ["10", "20", "30", "40", "50"],
      pageSize: 10,
      obj: {
        // 最上层搜索条件
        one: {},
        two: [
          {
            title: "拟稿人",
            info: [],
          },
        ],
        tree: [
          {
            title: "公文字号",
            intext: "",
          },
          {
            title: "发文单位",
            intext: "",
          },
        ],
        // 日期选择
        condition: [
          {
            text: "拟稿时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" },
            ],
          },
          {
            text: "签发时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" },
            ],
          },
          {
            text: "创建时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" },
            ],
          },
        ],
        // 日期选择后结果
        timenum: [
          { num: 0, text: "拟稿时间", time: [] },
          { num: 0, text: "签发时间", time: [] },
          { num: 0, text: "创建时间", time: [] },
        ],
        // 模板type
        num: this.type || 1,
      },
      objdata: {
        template: "",
        word_no: "",
        drafter: "",
        drafter_time: "",
        issue_time: "",
        dept: "",
      },
      ViewDocument: {
        // 预览
        vis2: false,
        condition: true, // 是否是打印，如果是的话就要打开分页
      },
      view_data: [], // 打印数据集合
      dayin: {
        num: 0, // 当前选中元素总长度
        index: 0, //当前循环打印下标
      },
    };
  },
  created() {},
  mounted() {
    if (this.$route.query.type != undefined) {
      let _arry = get_time(this.$route.query.type);
      this.obj.one["创建时间"] = {
        arry: [_arry[0] / 1000, _arry[1] / 1000],
        intext: getDates(_arry[0]) + " ~ " + getDates(_arry[1]),
      };
      this.obj.timenum.forEach((ietm) => {
        if (ietm.text == "创建时间") {
          ietm.time = [getDates(_arry[0]), getDates(_arry[1])];
        }
      });
    }
    // 切换tabs关闭高级搜索
    this.$bus.$on("waitDocumentTabs", () => {
      this.onTabs();
    });
    this.height = Calculatedaltitude(60, 30, 20, 50, 67, 90);
  },
  components: {
    SeniorSearch,
    ViewDocument,
  },
  methods: {
    // 切换tabs关闭高级搜索
    onTabs() {
      this.ids.selectedRowKeys = [];
      this.search_flag = true;
      this.$refs.searchDetail.$el.style.height = "0px";
    },
    //表格变化函数（排序）
    Change(p, f, s) {
      this.objdatas();
      if (s.order) {
        let order = "";
        switch (s.order) {
          case "ascend":
            order = "asc";
            break;
          case "descend":
            order = "desc";
            break;
        }
        this.table_data.order_field = s.columnKey;
        this.table_data.sort = order;
        this.$emit(
          "get_list_repeat",
          this.search_ipt,
          this.status,
          2,
          this.current,
          this.pageSize,
          this.objdata,
          this.table_data
        );
      }
    },
    //批量打印
    batchPrinting(num) {
      let _this = this;
      let _arry;
      if (num == 1) {
        _this.view_data = [];
      }
      if (_this.ids.ids == "") {
        _arry = [];
      } else {
        _arry = _this.ids.ids.split(",");
      }
      _this.dayin.num = _arry.length;
      if (_this.dayin.num == 0) {
        _this.$message.error(`没有需要导出的数据`);
      } else {
        document_information({ id: _arry[_this.dayin.index] }).then((data) => {
          if (data.data != undefined) {
            _this.view_data.push(data.data);
          }
          _this.ViewDocument.vis2 = true;
          if (_this.dayin.index < _this.dayin.num) {
            _this.dayin.index++;
            _this.batchPrinting();
          } else {
            setTimeout(() => {
              _this.$print(_this.$refs.print);
            });
            _this.dayin.index = 0;
          }
        });
      }
    },
    // 搜索条件
    objdatas() {
      if (this.$route.query.type != undefined) {
        let _arry = get_time(this.$route.query.type);
        this.obj.one["创建时间"] = {
          arry: [_arry[0] / 1000, _arry[1] / 1000],
          intext: getDates(_arry[0]) + " ~ " + getDates(_arry[1]),
        };
        this.obj.timenum.forEach((ietm) => {
          if (ietm.text == "创建时间") {
            ietm.time = [getDates(_arry[0]), getDates(_arry[1])];
          }
        });
      }

      this.objdata = {
        template: this.obj.one["模板分类"]?.id,
        word_no: this.obj.one["公文字号"]?.intext,
        drafter: this.obj.one["拟稿人"]?.id,
        drafter_time: this.obj.one["拟稿时间"]?.arry.join(","),
        issue_time: this.obj.one["签发时间"]?.arry.join(","),
        create_time: this.obj.one["创建时间"]?.arry.join(","),
        dept: this.obj.one["发文单位"]?.intext,
      };
    },
    // 子组件需要调用的组件
    oninSearch() {
      this.objdatas();
      this.$emit(
        "get_list_repeat",
        this.search_ipt,
        this.status,
        2,
        this.current,
        this.pageSize,
        this.objdata,
        this.table_data
      );
      this.SearchTriangle = true;
      this.$refs.searchDetail.$el.style.height = "0px";
    },
    // 导出数据
    addDocumentExcelout() {
      documentExcelout({
        ids: this.ids.ids,
      }).then((data) => {
        filldownload(data);
      });
    },
    // 重置高级搜索数据
    chonghzi() {
      // 清空头部数据表
      this.obj.one = {};
      // 输入框重置
      this.obj.tree.forEach((e) => {
        e.intext = "";
      });
      // 模板文字重置
      this.mbtext = "";
      // 日期重置
      this.obj.timenum.forEach((e) => {
        e.time = [];
        e.num = 0;
      });
    },
    //日期变更
    date_onChange() {},
    //每页条数改变
    onShowSizeChange(current, pageSize) {
      this.objdatas();
      this.pageSize = pageSize;
      this.current = 1;
      this.$emit(
        "get_list_repeat",
        this.search_ipt,
        this.status,
        2,
        this.current,
        this.pageSize,
        this.objdata,
        this.table_data
      );
    },
    //页数改变
    page_change(v) {
      this.ids.selectedRowKeys = [];
      this.objdatas();
      this.current = v;
      this.$emit(
        "get_list_repeat",
        this.search_ipt,
        this.status,
        2,
        this.current,
        this.pageSize,
        this.objdata,
        this.table_data
      );
    },
    //搜索
    search() {
      this.chonghzi();
      this.current = 1;
      this.$emit(
        "get_list_repeat",
        this.search_ipt,
        this.status,
        2,
        this.current,
        this.pageSize,
        this.objdata,
        this.table_data
      );
    },
    //行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.$router.push({
              path: "/home/incoming",
              query: {
                id: record.id,
                file_type: 2,
              },
            });
          },
        },
      };
    },
    //显示/收起搜索
    change_search() {
      if (this.search_flag) {
        this.$refs.searchDetail.$el.style.height = "auto";
      } else {
        this.$refs.searchDetail.$el.style.height = "0px";
      }
      this.search_flag = !this.search_flag;
    },
  },
  computed: {
    comIds() {
      return this.ids.ids == "";
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-modal {
  width: 850px !important;
}
//  预览公文内容
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 500px;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}
.SeniorSearch {
  width: 100%;
  top: 89px;
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
}
.sign {
  .t-head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /deep/.ant-radio-button-wrapper {
      width: 70px;
      height: 36px;
      box-sizing: border-box;
      text-align: center;
      line-height: 36px;
    }
    .open-search {
      cursor: pointer;
      color: #b4bcccff;
      font-size: 14px;
    }

    .search-detail {
      position: absolute;
      top: 60px;
      height: 0;
      width: 100%;
      z-index: 2;
      background: white;
      transition: all 0.3s;
      overflow-y: scroll;

      box-sizing: border-box;
      .look_list {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        padding: 10px;
        color: #c0c4ccff;
        font-size: 14px;
        box-sizing: border-box;
        .item {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 178px;
          height: 28px;
          background: rgba(240, 242, 245, 1);
          border-radius: 100px;
          padding: 0 10px;
          box-sizing: border-box;
          border-bottom: none !important;
          .dynamic {
            color: #f56c6c;
          }
          .del {
            width: 12px;
            height: 12px;
            background: url("../../../../../assets/home/delete.png");
            background-size: 12px 12px;
          }
        }
      }
      .s-row {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        border-bottom: 1px dashed rgba(220, 223, 230, 1);
        padding: 10px;
        color: #c0c4ccff;
        font-size: 14px;
        box-sizing: border-box;
        &:last-child {
          margin-bottom: 20px;
        }
        .s-content {
          display: flex;
          align-items: center;
          .item {
            margin-right: 20px;
            &:first-child {
              span {
                &:first-child {
                  color: #0082ef;
                }
              }
            }
            /deep/.ant-calendar-picker-input {
              width: 280px;
            }
          }
          .draft-date {
            span {
              margin-right: 20px;
            }
          }
        }
        /deep/ .ant-input {
          width: 360px;
        }
        .label {
          width: 100px;
        }
      }

      .nav-class {
        position: relative;
        .class_list {
          position: absolute;
          top: 40px;
          left: 108px;
          width: 200px;
          height: 0;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.16);
          z-index: 5;
          overflow-y: scroll;
          transition: all 0.4s;
          box-sizing: border-box;

          .class_item {
            color: #666666;
            font-size: 14px;
            padding-left: 20px;
            margin: 10px;
            cursor: pointer;
            &:hover {
              color: #0082ef;
            }
            &:first-child {
              margin-top: 15px;
            }
          }
        }
        .s-content {
          span {
            cursor: pointer;
            margin-right: 20px;
            transition: all 0.3s;
          }
          .active {
            color: #0082efff;
          }
        }
      }
      .drafter {
        .item {
          .person {
            margin-right: 30px;
          }
        }
        .s-content {
          /deep/ .ant-input-search {
            width: 160px;
            .ant-input {
              width: 100%;
              border-radius: 100px;
            }
          }
        }
      }
    }
  }
  .search {
    padding: 14px 0;
    .left {
      display: flex;
      align-items: center;
      .search-ipt {
        display: flex;
        width: 240px;
        /deep/ .ant-btn {
          border: 1px solid rgba(218, 218, 219, 1);
          background: white;
          color: #dadadb;
          box-shadow: none;
        }
      }
      .senior {
        display: flex;
        margin-left: 20px;
        align-items: center;
        span {
          color: #0082ef;
        }
      }
    }
    .right {
      button {
        margin-left: 10px;
      }
      .export {
        margin: 0 6px 0 16px;
        border-left: 1px dashed #ababab;
        height: 20px;
      }
    }
  }
  .status-radio {
    margin-top: 25px;
    border-bottom: 1px solid rgba(230, 237, 245, 1);
    /deep/.ant-tabs-bar {
      margin: 0;
    }
    /deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar {
      .ant-tabs-tab-active {
        border: 1px solid #e8e8e8 !important;
        border-bottom: 1px solid #fff !important;
      }
      .ant-tabs-nav-container,
      .ant-tabs-tab {
        background: none;
        border: 1px solid transparent;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .content {
    height: 100%;
    /deep/ .ant-table-wrapper {
      height: 100%;
      .ant-spin-nested-loading {
        height: 100%;
        .ant-spin-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          .ant-pagination {
            text-align: right;
            align-self: flex-end;
          }
        }
      }
    }
    /deep/ .ant-pagination {
      margin: 20px 0 0 0;
    }
    .status {
      display: flex;
      align-items: center;
    }
    .status-dian {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .status1 {
      .status-dian {
        background: #0082ef;
      }
      span {
        color: #0082ef;
      }
    }
    .status2 {
      .status-dian {
        background: #0082ef;
      }
      span {
        color: #0082ef;
      }
    }
    .status3 {
      .status-dian {
        background: #62c232;
      }
      span {
        color: #62c232;
      }
    }
    .status4 {
      .status-dian {
        background: #f56c6c;
      }
      span {
        color: #f56c6c;
      }
    }
    .status8 {
      .status-dian {
        background: #f56c6c;
      }
      span {
        color: #f56c6c;
      }
    }
    .status9 {
      .status-dian {
        background: #909499;
      }
      span {
        color: #909499;
      }
    }
    .status10 {
      .status-dian {
        background: #f5ac40;
      }
      span {
        color: #f56c6c;
      }
    }

    .urgency {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 24px;
    }
  }
}
.sanjiao {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  margin-left: 6px;
}
.xia {
  border-bottom: 6px transparent;
  border-top: 6px solid rgba(180, 188, 204, 1);
}
.shang {
  border-top: 6px transparent;
  border-bottom: 6px solid rgba(180, 188, 204, 1);
}
/deep/.table-content-at {
  overflow-y: scroll;
}
/deep/ .ant-table-wrapper {
  height: 100%;
}
/deep/.ant-pagination {
  text-align: right;
  margin-top: 20px;
}
/deep/ .ant-table {
  height: 100%;
}
/deep/.ant-table-wrapper {
  position: relative;
}
/deep/#print {
  width: 750px;
  margin: 0 auto;
}
</style>