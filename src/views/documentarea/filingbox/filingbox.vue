<template>
  <div>
    <Maintitle :titleObj="titleObj">
      <div></div>
    </Maintitle>
    <Maincontent>
      <Tabs :tabsarry="tabsarry" @changeTab="changeTab"></Tabs>
      <Header
        @documentarea_header_search="documentarea_search"
        @onXj="onXj"
        :objs="obj"
        :tabs="tabs"
        @onChanges="onChanges"
        @BatchPrinting="BatchPrinting"
      />
      <Main
        @page_size_change="page_size_change"
        @sort_change="sort_change"
        @main_page_change="page_change"
        :tabs="tabs"
        class="Main"
      />
      <NewDocument
        @delNewDoucument="delNewDoucument"
        :TemplatePopup="TemplatePopup"
        @getcollectDocument="getcollectDocument"
      />
    </Maincontent>
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
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Tabs from "../components/tabs.vue";
import Header from "../components/header.vue";
import Main from "../components/main.vue";
import NewDocument from "@/views/components/NewDocument.vue";
import { filing_box } from "@/api/file_management.js";
import { documentExcelout, document_information } from "@/api/public.js";
import { filldownload } from "@/js/public.js";
import ViewDocument from "@/views/components/viewDocument.vue";

export default {
  name: "Filingbox",
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      },
      tabsarry: [
        { name: "发文归档箱", value: 1, icon: "分发发文" },
        { name: "收文归档箱", value: 2, icon: "分发收文" },
        { name: "签报归档箱", value: 3, icon: "分发收文" }
      ],
      columns_list: [
        [
          // 表单格式
          {
            title: "序号",
            dataIndex: "inx",
            key: "inx",
            width: 60
          },
          {
            title: "发文标题",
            dataIndex: "title",
            key: "title",
            width: 140,
            ellipsis: true
          },

          {
            title: "发文字号",
            dataIndex: "word_no",
            key: "word_no",
            width: 140,
            ellipsis: true
            // sorter: (a, b) => a.word_no.length - b.word_no.length
          },
          {
            title: "发文单位",
            dataIndex: "dep_name",
            key: "dep_name",
            width: 140,
            ellipsis: true
          },
          {
            title: "拟稿人",
            key: "name",
            dataIndex: "name"
          },
          {
            title: "拟稿日期",
            key: "create_time",
            dataIndex: "create_time",
            sorter: (a, b) => a.create_time.length - b.create_time.length
          },
          {
            title: "紧急程度",
            key: "process_urgent_level",
            dataIndex: "process_urgent_level",
            scopedSlots: { customRender: "process_urgent_level" },
            align: "center",
            sorter: (a, b) => a.create_time.length - b.create_time.length
          },
          {
            title: "发文状态",
            key: "status",
            dataIndex: "status",
            scopedSlots: { customRender: "status" },
            ellipsis: true
          }
        ],
        [
          // 表单格式
          {
            title: "序号",
            dataIndex: "inx",
            key: "inx",
            width: 60
          },
          {
            title: "收文标题",
            dataIndex: "title",
            key: "title",
            width: 140,
            ellipsis: true
          },
          {
            title: "收文字号",
            dataIndex: "word_no",
            key: "word_no",
            width: 140,
            ellipsis: true,
            sorter: (a, b) => a.word_no.length - b.word_no.length
          },
          {
            title: "来文单位",
            dataIndex: "dep_name",
            key: "dep_name",
            width: 140,
            ellipsis: true
          },

          {
            title: "收文日期",
            key: "create_time",
            dataIndex: "create_time",
            sorter: (a, b) => a.create_time.length - b.create_time.length
          },
          {
            title: "紧急程度",
            key: "process_urgent_level",
            dataIndex: "process_urgent_level",
            scopedSlots: { customRender: "process_urgent_level" },
            align: "center",
            sorter: (a, b) => a.create_time.length - b.create_time.length
          },
          {
            title: "收文状态",
            key: "status",
            dataIndex: "status",
            scopedSlots: { customRender: "status" },
            ellipsis: true
          }
        ],
        [
          // 表单格式
          {
            title: "序号",
            dataIndex: "inx",
            key: "inx",
            width: 60
          },
          {
            title: "签报标题",
            dataIndex: "title",
            key: "title",
            width: 140,
            ellipsis: true
          },

          {
            title: "签报字号",
            dataIndex: "word_no",
            key: "word_no",
            width: 140,
            ellipsis: true,
            sorter: (a, b) => a.word_no.length - b.word_no.length
          },
          {
            title: "拟稿人",
            key: "name",
            dataIndex: "name"
          },
          {
            title: "签报日期",
            key: "create_time",
            dataIndex: "create_time",
            width: 140,
            ellipsis: true,
            sorter: (a, b) => a.create_time.length - b.create_time.length
          },
          {
            title: "紧急程度",
            key: "process_urgent_level",
            dataIndex: "process_urgent_level",
            scopedSlots: { customRender: "process_urgent_level" },
            align: "center",
            sorter: (a, b) => a.create_time.length - b.create_time.length
          },
          {
            title: "签报状态",
            key: "status",
            dataIndex: "status",
            scopedSlots: { customRender: "status" },
            ellipsis: true
          }
        ]
      ],
      tabs: {
        columns: null,
        data: null,
        ids: "", // 多选按钮选中文件id
        selectedRowKeys:[],
        page: 1,
        count: null,
        type: 1,
        file_type: 1,
        cut: 12
      },
      //当前类别文件类型（1发文，2收文，3签报）
      file_type: 1,
      obj: {
        // 最上层搜索条件
        one: {},
        two: [
          {
            title: "拟稿人",
            info: []
          }
        ],
        tree: [
          { title: "归档单位", intext: "" },
          { title: "公文字号", intext: "" }
        ],
        // 日期选择
        condition: [
          {
            text: "拟稿时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          },
          {
            text: "签发时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          },
          {
            text: "创建时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          },
          {
            text: "归档时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          }
        ],
        // 日期选择后结果
        timenum: [
          { num: 0, text: "拟稿时间", time: [] },
          { num: 0, text: "签发时间", time: [] },
          { num: 0, text: "创建时间", time: [] },
          { num: 0, text: "归档时间", time: [] }
        ],
        // 模板type
        num: 1,
        // 存储高级搜索信息
        Storage: {}
      },
      //草稿箱新建组建传值
      TemplatePopup: {
        visibles: false,
        type: 1,
        title: "新建发文模板",
        type2: 1
      },
      texttitle: {
        1: "新建发文模板",
        2: "新建收文模板",
        3: "新建签报模板"
      },
      dayin: {
        num: 0, // 当前选中元素总长度
        index: 0 //当前循环打印下标
      },
      ViewDocument: {
        // 预览
        vis2: false,
        condition: true // 是否是打印，如果是的话就要打开分页
      },
      view_data: [] // 打印数据集合
    };
  },
  components: {
    Header,
    Main,
    Maintitle,
    Maincontent,
    Tabs,
    NewDocument,
    ViewDocument
  },
  watch: {
    file_type(v) {
      this.obj.num = v;
      this.TemplatePopup.type = v;
      this.TemplatePopup.type2 = v;
      this.TemplatePopup.title = this.texttitle[v];
    }
  },
  created() {
    this.get_file_list();
    this.tabs.columns = this.columns_list[this.file_type - 1];
  },
  methods: {
    //批量打印
    BatchPrinting(num) {
      let _this = this;
      let _arry;
      if (num == 1) {
        _this.view_data = [];
      }
      if (_this.tabs.ids == "") {
        _arry = [];
      } else {
        _arry = _this.tabs.ids.split(",");
      }
      _this.dayin.num = _arry.length;
      if (_this.dayin.num == 0) {
        _this.$message.error(`没有需要导出的数据`);
      } else {
        document_information({ id: _arry[_this.dayin.index] }).then(data => {
          if (data.data != undefined) {
            _this.view_data.push(data.data);
          }
          _this.ViewDocument.vis2 = true;
          if (_this.dayin.index < _this.dayin.num) {
            _this.dayin.index++;
            _this.BatchPrinting();
          } else {
            setTimeout(() => {
              _this.$print(_this.$refs.print);
            });
            _this.dayin.index = 0;
          }
        });
      }
    },
    // 关闭模态框
    delNewDoucument() {
      this.TemplatePopup.visibles = false;
    },
    // 新建模板
    onXj(v) {
      if (v == 1) {
        this.TemplatePopup.visibles = true;
      } else if (v == 2) {
        this.addDocumentExcelout();
      }
    },
    // 点击收藏之后刷新页面
    getcollectDocument(data) {
      if (data.data.collection) {
        this.common = data.data.collection.resource;
      }
    },
    // 导出数据
    addDocumentExcelout() {
      documentExcelout({
        ids: this.tabs.ids
      }).then(data => {
        filldownload(data);
      });
    },
    //获取归档箱数据
    async get_file_list(
      page = 1,
      val = "",
      table_data = { order_field: null, sort: null },
      listRow = 10
    ) {
      let { data } = await filing_box({
        type: this.file_type,
        status: 9,
        page,
        keyword: val,
        order_field: table_data.order_field,
        sort: table_data.sort,
        listRow,
        word_no: this.obj.one["公文字号"]?.intext,
        drafter: this.obj.one["拟稿人"]?.id,
        abandonment: this.obj.one["废弃人"]?.intext,
        class: this.obj.one["分类导航"]?.id,
        create_time: this.obj.one["创建时间"]?.arry.join(","),
        place_time: this.obj.one["归档时间"]?.arry.join(","),
        issue_time: this.obj.one["签发时间"]?.arry.join(","),
        drafter_time: this.obj.one["拟稿时间"]?.arry.join(",")
      });
      if (data && data.data) {
      } else {
        data = [];
        data.data = [];
      }
      data.data.forEach((el, index) => {
        el.key = el.id;
        el.inx = index + 1;
      });
      this.tabs.count = data.count;
      this.tabs.data = data.data;
    },
    onChanges(obj) {
      this.obj.one = obj;
      this.get_file_list();
    },
    //页数改变重新获取数据
    page_change(page, val, table_data, listRow) {
      this.get_file_list(page, val, table_data, listRow);
    },
    //排序改变重新获取数据
    sort_change(page, val, table_data, listRow) {
      this.get_file_list(page, val, table_data, listRow);
    },
    //搜索
    documentarea_search(val) {
      this.get_file_list(1, val);
    },
    //数据条数改变
    page_size_change(page, val, table_data, listRow) {
      this.get_file_list(1, val, table_data, listRow);
    },
    // tabs选项卡切换事件
    changeTab(e) {
      this.file_type = e;
      this.tabs.file_type = e;
      this.get_file_list();
      this.tabs.columns = this.columns_list[this.file_type - 1];
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 850px !important;
}

.Main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 150px);
  /deep/ .ant-pagination {
    text-align: right;
    margin-top: 20px;
  }
}
//  预览公文内容
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 500px;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
  .preview {
    padding: 0 30px 30px 30px;
    h2 {
      text-align: center;
      color: #fa5555;
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: bold;
    }
    .time {
      text-align: right;
      color: #909399;
      font-size: 12px;
    }
    .content-text {
      .line {
        display: flex;
        align-items: center;
        border-bottom: none;
        &:last-child {
          border-bottom: 1px solid #fa5555;
        }
        .head {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 124px;
          color: #fa5555;
        }
        .content {
          border-left: 1px solid #fa5555;
        }
      }

      // 第一种
      .fir {
        line-height: 32px;
        box-sizing: border-box;
        border: 1px solid #fa5555;
        border-bottom: none;

        .head {
          margin-top: -1px;

          padding-left: 10px;
          color: #fa5555;
          height: 48px !important;
          width: 124px;
        }
        .content {
          display: flex;
          align-items: center;
          max-width: 443px;
          height: 100%;
          padding-left: 10px;
          min-height: 48px;
        }
      }
      .sec {
        display: flex;
        border: 1px solid #fa5555;
        border-bottom: none;
        position: relative;
        overflow: hidden;
        .item {
          display: flex;
          height: 100%;
          min-height: 48px;
          border-right: 1px solid #fa5555;
          &:last-child {
            border-right: none;
          }
        }
        .content {
          width: 284px;
          min-height: 48px;
          padding: 15px;
        }
      }
    }
    .file-text {
      margin-top: 60px;
      .head {
        text-align: center;
        h3 {
          color: #fa5555;
          padding: 10px 0;
          font-size: 20px;
          font-weight: 600;
          border-bottom: 1px solid #f56c6c;
        }
      }
    }
  }
}
/deep/#print {
  width: 750px;
  margin: 0 auto;
}
</style>