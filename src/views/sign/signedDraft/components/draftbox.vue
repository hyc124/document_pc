<template>
  <div class="advance">
    <div class="advance-topbtnbox flex-col">
      <a-input-search
        placeholder="请输入关键字"
        style="width: 259px"
        v-model="form.name"
        enter-button
        @search="Inquire"
        :maxLength="20"
      />
      <span class="open-search" @click="change_search">
        {{SearchTriangle?"高级搜索":"收起搜索"}}
        <i class="triangle" v-if="SearchTriangle"></i>
        <i class="triangle-top" v-else></i>
      </span>
      <div class="flex-col-bd"></div>
      <a-button @click="transfer" type="primary">新建</a-button>
      <div class="Dottedline"></div>
      <a-button class="Printing" @click="addDocumentExcelout" :disabled="comIds">导出</a-button>
      <a-button v-if="powers('sign_print')" @click="onBatchPrinting(1)">批量打印</a-button>
    </div>
    <SeniorSearch class="SeniorSearch" :obj="obj" @oninSearch="oninSearch" ref="searchDetail" />
    <div class="table-content-at" :style="{height:`${height+60+18}px`}">
      <a-table
        class="tables"
        :columns="columns"
        :pagination="false"
        :data-source="data"
        :row-selection="checkBoxSelect(ids)"
        :scroll="{ y: height}"
        @change="Change"
        :customRow="onClicks"
      >
        <span slot="process_urgent_level" slot-scope="item,record">
          <span id="degree" :class="record.ClassType">{{record.process_urgent_level}}</span>
        </span>
        <span slot="status" slot-scope="item,record">
          <span class="status">
            <span>·</span>
            {{record.status}}
          </span>
        </span>
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div
              class="hand"
              v-if="powers('sign_delete')"
              style="color:#F56C6C;"
              @click.stop="editclick(record)"
            >删除</div>
          </div>
        </span>
      </a-table>
    </div>
    <Pagination :paging="paging" @pageChange="pagechange" @currentchange="currentchange" />
    <NewDocument
      @delNewDoucument="delNewDoucument"
      @getcollectDocument="getcollectDocument"
      :TemplatePopup="TemplatePopup"
    />
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
  Calculatedaltitude,
  filldownload,
  checkBoxSelect
} from "@/js/public.js";
import { documentExcelout, document_information } from "@/api/public.js";
import { libraryList, DelDocument } from "@/api/library.js";
import Pagination from "@/views/components/Pagination.vue";
import NewDocument from "@/views/components/NewDocument.vue";
import ViewDocument from "@/views/components/viewDocument.vue";
export default {
  name: "advance",
  data() {
    return {
      data: null,
      columns: null,
      visible: false,
      confirmLoading: false,
      transferlist: [],
      transferlistcl: [],
      transferlist_index: 0,
      transferlistcl_index: 0,
      height: 0,
      form: {
        name: ""
      },
      SearchTriangle: true, // 高级搜索开关
      //草稿箱新建组建传值
      TemplatePopup: {
        visibles: false,
        type: 3,
        title: "新建签报模板",
        type2: 3
      },
      id: null,
      checkBoxSelect, // 表单多选按钮点击函数挂载
      ids: {
        // 嵌套是因为引用类型，函数里改了数据外面就可以直接使用
        ids: "", // 多选按钮选中文件id
        selectedRowKeys:[]
      },
      //分页
      paging: {
        current: 1,
        total: null
      },
      //表格数据
      table_data: {
        order_field: null,
        sort: null,
        pagesize: 10
      },
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
          {
            title: "签报单位",
            intext: ""
          }
        ],
        // 日期选择
        condition: [
          {
            text: "创建时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          }
        ],
        // 日期选择后结果
        timenum: [{ num: 0, text: "创建时间", time: [] }],
        // 模板type
        num: 1
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
  computed: {
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction[3];
    },
    comIds() {
      return this.ids.ids == "";
    }
  },
  components: {
    NewDocument,
    Pagination,
    SeniorSearch,
    ViewDocument
  },
  created() {
    this.getlibraryList();
    this.columns = [
      // 表单格式
      {
        title: "序号",
        dataIndex: "noid",
        key: "noid",
        width: 65
      },
      {
        title: "签报标题",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        scopedSlots: { customRender: "name" }
      },
      {
        title: "签报单位",
        dataIndex: "fDepts",
        key: "fDepts",
        ellipsis: true,
        customRender: item => {
          let text = [];
          for (let i = 0; i < item.length; i++) {
            text.push(item[i].dep_name);
          }
          return text.join("、");
        }
      },
      {
        title: "拟稿人",
        dataIndex: "creater",
        ellipsis: true,
        key: "creater",
        width: 85
      },
      {
        title: "创建日期",
        dataIndex: "create_time",
        key: "create_time",
        ellipsis: true,
        ellipsis: true,
        sorter: (a, b) => a.create_time.length - b.create_time.length
      },
      {
        title: "紧急程度",
        dataIndex: "process_urgent_level",
        ellipsis: true,
        key: "process_urgent_level",
        scopedSlots: { customRender: "process_urgent_level" },
        width: 90,
        sorter: (a, b) => a.process_urgent_level - b.process_urgent_level
      },
      {
        title: "签报状态",
        dataIndex: "status",
        ellipsis: true,
        key: "status",
        scopedSlots: { customRender: "status" },
        width: 90
      },
      {
        width: 200,
        title: "当前处理人/当前部门",
        dataIndex: "current",
        key: "current",
        ellipsis: true
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 100
      }
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(40, 60, 60, 73);
    // tabs 改变就关闭高级搜索
    setTimeout(() => {
      this.$bus.$on("SigngetBoxList", () => {
        this.$refs.searchDetail.$el.style.height = "0px";
        this.SearchTriangle = true;
      });
    }, 100);
  },
  methods: {
    // 批量打印
    onBatchPrinting(num) {
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
        document_information({ id: _arry[_this.dayin.index] }).then(data => {
          if (data.data != undefined) {
            _this.view_data.push(data.data);
          }
          _this.ViewDocument.vis2 = true;
          if (_this.dayin.index < _this.dayin.num) {
            _this.dayin.index++;
            _this.onBatchPrinting();
          } else {
            setTimeout(() => {
              _this.$print(_this.$refs.print);
            });
            _this.dayin.index = 0;
          }
        });
      }
    },
    // 权限判断
    powers(text) {
      return this.jurisdiction.includes(text);
    },
    addDocumentExcelout() {
      documentExcelout({
        ids: this.ids.ids
      }).then(data => {
        filldownload(data);
      });
    },
    //分页事件
    pagechange(val) {
            this.ids.selectedRowKeys = []
      this.paging.current = val;
      this.getlibraryList();
    },
    // 点击收藏之后刷新页面
    getcollectDocument(data) {
      if (data.data.collection) {
        this.common = data.data.collection.resource;
      }
    },
    // 改变页数事件
    currentchange(val) {
      this.paging.pagesize = val;
      this.paging.current = 1;
      this.getlibraryList();
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = "auto";
      } else {
        this.$refs.searchDetail.$el.style.height = "0px";
        this.getlibraryList();
      }
      this.SearchTriangle = !this.SearchTriangle;
    },
    // 搜索时间
    oninSearch() {
      this.getlibraryList();
      this.SearchTriangle = true;
      this.$refs.searchDetail.$el.style.height = "0px";
    },
    // 重置高级搜索数据
    chonghzi() {
      // 清空头部数据表
      this.obj.one = {};
      // 输入框重置
      this.obj.tree.forEach(e => {
        e.intext = "";
      });
      // 模板文字重置
      this.mbtext = "";
      // 日期重置
      this.obj.timenum.forEach(e => {
        e.time = [];
        e.num = 0;
      });
    },
    editclick(info) {
      this.id = info.id;
      this.showModal();
    },
    // 表单表格点击跳转事件
    onClicks(record, index) {
      return {
        on: {
          click: () => {
            let go_path = "";
            if (record.is_fast == 1) {
              go_path = `draft/quickPost?d_id=${record.id}`;
            } else {
              go_path = `/draft/addDraft?d_id=${record.id}&type=3`;
            }
            this.$router.push({
              path: go_path
            });
          }
        }
      };
    },
    //表格变化函数（排序）
    Change(p, f, s) {
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
        this.getlibraryList();
      }
    },
    // 新建按钮
    transfer() {
      this.TemplatePopup.visibles = true;
    },
    // 关闭模态框
    delNewDoucument() {
      this.TemplatePopup.visibles = false;
    },

    // 点击删除按钮，打开弹窗
    showModal() {
      this.visible = this.$confirm({
        title: "提示",
        content: "删除后数据不可恢复，是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.handleOk
      });
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.delDocument();
    },
    // 获取查询列表
    getlibraryList() {
      let obj = this.obj;
      libraryList({
        type: 3, // 1发文，2收文，3签报
        status: 5, // 1待审 2驳回 3完成 4发布 5草稿 6预发文 10全部
        kwd: this.form.name, // 搜索关键词
        page: this.paging.current, // 当前页码
        limit: this.paging.pagesize, // 每页条数
        order_field: this.table_data.order_field, // 排序字段 按返回的字段名传值
        sort: this.table_data.sort, // 排序方式 asc升序 desc倒序
        advanced: {
          type_id: obj.one["模板分类"]?.id, // 模板id
          copy_users: obj.one["签报单位"]?.intext, // 签报单位
          creater: obj.one["拟稿人"]?.id, // 拟稿人
          create_time: obj.one["创建时间"]?.arry.join(",") // 创建时间
        }
      }).then(res => {
        this.paging.total = res.count;
        res.data.map((v, index) => {
          v.noid = index + 1;
          v.key = index;
          if (v.process_urgent_level == 1) {
            this.spanClass = 1;
            v.process_urgent_level = "普通";
            v.ClassType = "normal";
          } else if (v.process_urgent_level == 2) {
            this.spanClass = 2;
            v.process_urgent_level = "紧急";
            v.ClassType = "urgent";
          } else if (v.process_urgent_level == 3) {
            this.spanClass = 3;
            v.process_urgent_level = "加急";
            v.ClassType = "so-urgent";
          }
        });
        this.data = res.data;
      });
    },
    // 查询
    Inquire() {
      this.chonghzi();
      this.getlibraryList();
    },
    // 删除公文
    delDocument() {
      DelDocument({ id: this.id }).then(res => {
        this.getlibraryList();
      });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 850px !important;
}
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 500px;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
}
.open-search {
  margin-left: 10px;
  cursor: pointer;
  color: #0082ef;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  .triangle {
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-top: 4px solid #b4bccc;
    border-bottom: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    top: 8px;
    left: 54px;
  }
  .triangle-top {
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-bottom: 4px solid #b4bccc;
    border-top: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    top: 2px;
    left: 54px;
  }
}
.accept-main {
  padding: 12px 0;
}

#degree {
  display: inline-block;
  text-align: center;
  line-height: 26px;
  width: 52px;
  height: 26px;
  border-radius: 2px;
  text-align: center;
  font-size: 12px;
}
.status {
  color: #f56c6c;
  span {
    font-size: 40px;
    line-height: 0px;
    vertical-align: -7px;
  }
}
.advance {
  height: 100%;
  .advance-topbtnbox {
    height: 32px;
    padding-top: 4px;
    margin-bottom: 4px;
  }
}
.advance-footer {
  height: 60px;
}
.ant-tabs .ant-tabs-top-content {
  height: calc(100% - 120px);
}
.mr10 {
  margin-right: 10px;
}
// 改页面新加的css
/deep/ .ant-input-group-addon > .ant-btn-primary {
  background: #ffffff;
  color: #c0c4cc;
  padding: 0 14px;
  border: 1px solid #dadadb;
}
.Dottedline {
  height: 20px;
  border-right: 1px dashed #ababab;
  margin: 0px 14px 0px 16px;
}
.Printing {
  margin-right: 8px;
}/deep/#print {
  width: 750px;
  margin: 0 auto;
}
</style>