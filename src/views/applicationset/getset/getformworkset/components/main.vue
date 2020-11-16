<template>
  <div>
    <div class="main table-content-at" :style="{height:`${height + 54 + 12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: height }"
        @change="ChangeSort"
      >
        <span slot="temp_name" slot-scope="item,record">
          <div class="flex-col">
            <div>{{item}}</div>
            <div class="commonlyUsed" v-if="record.allways_use==1">常用</div>
          </div>
        </span>
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div style="color:#0082EF" @click="editclick(record,3)">预览</div>
            <div style="color:#0082EF" @click="editclick(record,1)">编辑</div>
            <div style="color:#fa5555" @click="editclick(record,2)">删除</div>
          </div>
        </span>
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangegetwork"
      @currentchange="currentchangegetwork"
      :paging="paging"
      class="Page"
    />
    <a-modal v-model="visibles" cancelText="取消" okText="确定" title="修改发文类别名称" @ok="handleOks">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="类别名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal class="preview-modal" @ok="ViewDocument.vis2=false" v-model="ViewDocument.vis2" footer>
      <div id="print" ref="print">
        <ViewDocument :ViewDocument="ViewDocument" :datas="datas" v-if="ViewDocument.vis2" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import { DelAllList, GetpostinfoList } from "@/api/applicationset.js";
import Pagetion from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
import ViewDocument from "@/views/components/viewDocument.vue";
import { Postinfo } from "@/api/applicationset.js";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      visible: "",
      visibles: false,
      height: 0,
      rules: {
        // 修改发文分类名称内容判断
        name: [
          {
            required: true,
            message: "请输入发文分类名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 15,
            message: "请输入不超过15个字符",
            trigger: ["change", "blur"],
          },
        ],
      },
      form: {
        //修改紧级名称内容
        name: "",
      },
      row: [],
      // 传送给分页的数据
      paging: {
        total: null,
        current: 1,
        pageSize: 10,
      },
      getpostList: false, //分页改变的时候判断获取查询的数据还是列表数据
      table_data: {}, //排序
      ViewDocument: {
        // 预览
        vis2: false,
        condition: false, // 是否是打印，如果是的话就要打开分页
      },
    };
  },
  components: { Pagetion, ViewDocument },
  created() {
    // 获取收文模板列表数据
    this.getdataList();
    // 获取查询列表数据
    this.onList();
    // 发送页数和显示条数给其他组件
    this.$bus.$emit("getformworksetSendpage", {
      defaultCurrent: this.paging.current,
      defaultPageSize: this.paging.pageSize,
    });
    // 获取查询之后的页码
    this.$bus.$on("getformworksetpage", (val) => {
      this.paging.current = val;
    });
    this.columns = [
      // 表单格式
      {
        title: "模板名称",
        dataIndex: "temp_name",
        key: "temp_name",
        scopedSlots: { customRender: "temp_name" },
      },
      {
        title: "创建账号",
        dataIndex: "username",
        key: "username",
        align: "center",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
        ellipsis: true,
        sorter: (a, b) => a.create_time.length - b.create_time.length,
      },
      {
        title: "模板类别",
        dataIndex: "type_name",
        key: "type_name",
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 140,
        align: "center",
      },
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(10, 60, 12, 54, 59);
  },
  methods: {
    editclick(el, num) {
      this.row = el;
      if (num == 1) {
        // this.$store.commit("refreshTemplate", "all");
        this.$router.push({
          path: "/getformworkset/getcompileformwork",
          query: { id: el.id, name: el.temp_name },
        });
      } else if (num == 2) {
        this.showModal();
      } else {
        Postinfo({ id: el.id }).then((res) => {
          this.datas = res.data;
          this.ViewDocument.vis2 = true;
        });
      }
    },
    // 点击删除按钮，打开弹窗
    showModal() {
      this.visible = this.$confirm({
        title: "提示",
        content: "删除后数据不可恢复，是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: this.handleOk,
      });
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.delallList();
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
    // 页码改变
    pagechangegetwork(val) {
      this.paging.current = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("getformworksetSetpostList", {
          current: val,
          page: this.paging.pageSize,
        });
      } else {
        this.getdataList();
      }
    },
    // 每页条数改变
    currentchangegetwork(val) {
      this.paging.current = 1;
      this.paging.pageSize = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("getformworksetSetpostList", {
          current: this.paging.current,
          page: val,
        });
      } else {
        this.getdataList();
      }
    },
    // 获取列表
    getdataList() {
      GetpostinfoList({
        type: 2,
        page: this.paging.current,
        limit: this.paging.pageSize,
        order_field: this.table_data.sort_field,
        sort: this.table_data.sort_type,
      }).then((res) => {
        if (res.code == 1) {
          this.paging.total = res.count;
          res.data.map((v) => {
            v.key = v.id;
          });
          this.data = res.data;
        }
      });
    },
    // 查询列表
    onList() {
      this.$bus.$on("getformworksetGetpostList", (val) => {
        this.paging.total = val.total;
        this.getpostList = val.getpostList;
        val.data.map((v) => {
          v.key = v.id;
        });
        this.data = val.data;
      });
    },
    // 删除列表
    delallList() {
      DelAllList({ id: this.row.id }).then((res) => {
        if (res.code == 1) {
          this.getdataList();
        }
      });
    },
    // 排序变化
    ChangeSort(p, f, s) {
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
        this.table_data.sort_field = s.columnKey;
        this.table_data.sort_type = order;
        this.$bus.$emit("getformworkset", {
          sort_field: s.columnKey,
          sort: order,
        });
        if (this.getpostList) {
          this.onList();
        } else {
          this.getdataList();
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.commonlyUsed {
  margin-left: 8px;
  padding: 0px 5px;
  background: #eaf0fc;
  color: #839ccf;
}
.main {
  padding-top: 0;
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
}
//  预览公文内容
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 800px;
    padding: 0;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}
</style>