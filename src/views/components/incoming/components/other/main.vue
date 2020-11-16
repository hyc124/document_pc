<template>
  <div class="main">
    <a-table
      :columns="tabs.columns"
      :data-source="tabs.data"
      :row-selection="tabs.rowSelection"
      :pagination="false"
      :customRow="rowClicks"
      @change="Change"
    >
      <span slot="c_xiugai" slot-scope="text,record">
        <div class="flex-col operation">
          <div>{{text}}</div>
          <div v-if="text=='是'" @click="editclick(record)" class="operation-see">查看</div>
        </div>
      </span>
      <span slot="name" slot-scope="text,record">{{record}}</span>
      <!-- 流程状态表单操作 -->
      <span slot="operations" slot-scope="text,record">
        <div class="flex-col operationsbox hand" v-if="record.status==2&&button.cuiban==1">
          <SvgIcon item="thumbtack" />
          <div class="operationsbox-text" @click="addapproval_urge(record.id)">催办</div>
        </div>
      </span>
    </a-table>
    <!-- 修改详情对比展示弹窗 -->
    <mainassembly v-if="contrast.onOff" :contrast="contrast" />
  </div>
</template>
<script>
import { approval_urge } from "@/api/incoming.js";
import SvgIcon from "@/views/components/svgicon.vue";
import mainassembly from "@/views/components/incoming/components/other/mainassembly/mainassembly.vue";
import { get_approval } from "@/api/incoming.js";
import { urgent_type_list, secret_type_list } from "@/api/quick_post";
export default {
  name: "Main",
  data() {
    return {
      // 对比数据文本弹窗开关
      contrast: {
        onOff: false,
        info: ""
      },
      data: null,
      columns: null,
      rowSelection: null,
      visible: "",
      visibles: false,
      rules: {
        // 修改发文分类名称内容判断
        name: [
          {
            required: true,
            message: "请输入收文分类名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 15,
            message: "请输入不超过15个字符",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        //修改紧级名称内容
        name: ""
      },
      //分页
      current: 1,
      count: null,
      //表格数据
      table_data: {
        order_field: null,
        sort: null
      },
      urging: 0,

      // 紧急程度密级程度
      secret_level: [],
      urgent_level: []
    };
  },
  props: ["tabs"],
  components: {
    mainassembly,
    SvgIcon
  },
  computed: {
    button() {
      return this.$store.state.leftdata.button;
    }
  },
  mounted() {
    this.$bus.$off("set_flowstate_data");
    this.$bus.$on("set_flowstate_data", res => {
      this.urging = res.cuiban;
    });
    this.get_data();
  },
  methods: {
    //获取紧急程度，密级程度
    async get_data() {
      let data = await urgent_type_list({ limit: 99999 });
      let data2 = await secret_type_list({ limit: 99999 });
      this.secret_level = data2.data.data;
      this.urgent_level = data.data.data;
    },
    editclick(info) {
      this.contrast.onOff = true;
      this.contrast.info = info.xiugai;
      this.set_data(this.contrast.info.lastdata.fields);
      this.set_data(this.contrast.info.thisdata.fields);
    },
    // 重新修改紧急程度、密级程度的数据
    set_data(val) {
      val.forEach(el => {
        if (el.e_name == "secret_level") {
          this.secret_level.forEach(v => {
            if (el.value == v.id) {
              el.value = v.name;
            }
          });
        } else if (el.e_name == "urgent_level") {
          this.urgent_level.forEach(v => {
            if (el.value == v.id) {
              el.value = v.name;
            }
          });
        }
      });
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
        this.$emit("get_data", this.current, this.table_data);
      }
    },
    //分页
    page_change() {
      this.current = pagination;
      this.$emit("get_data", this.current, this.table_data);
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.visible.destroy();
      this.visible = this.$warning({
        title: "提示",
        content: "当前已有公文使用该收文类别，不可删除！",
        okText: "确认"
      });
    },
    // 打开修改紧级名称弹窗
    amend() {
      this.visibles = true;
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.visible = false;
        this.form.name = "";
      }
    },
    rowClicks(r) {
      return {
        on: {
          click: () => {
            this.$emit("rowClick", r);
          }
        }
      };
    },
    addapproval_urge(e) {
      approval_urge({ id: e }).then(data => {
        console.log("催办成功");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  padding: 15px 0 0;
  .operation {
    justify-content: space-between;
    .operation-see {
      color: #1890ff;
    }
    div {
      cursor: pointer;
    }
  }
}
.operationsbox {
  color: #4a99ed;
  .operationsbox-text {
    margin-left: 5px;
  }
}
/deep/.ant-modal {
  width: 1000px !important;
  .ant-modal-body {
    padding: 10px 30px 20px;
  }
  .mine-contrast-titlebox {
    background: #f7f7f7;
    line-height: 44px;
    .contrast-box {
      margin: 0px 17px 0px 20px;
      .contrast-box-back {
        width: 30px;
        height: 14px;
        border-radius: 2px;
        display: inline-block;
        margin-right: 8px;
      }
    }
  }
  /deep/.ant-modal-footer {
    display: none;
  }
  .mine-contrast-navbox {
    height: 686px;
    justify-content: space-between;
    .mine-contrast-navbox-inbox {
      width: 460px;
      height: 618px;
      border: 1px solid #d9d9d9;
    }
  }
}
</style>