<template>
  <div class="main">
    <div class="main table-content-at" :style="{height:`${height + 54 + 12}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: height }"
        @change="Change"
      >
        <span slot="name" slot-scope="item,record">
          <span>{{item}}</span>
          <span class="main-table-at-cy" v-if="record.status == 1">常用</span>
        </span>
        <span slot="operation" slot-scope="item,record">
          <div class="flex-db operation">
            <span style="color:#0082EF" @click="editclick(record,4)">预览</span>
            <span style="color:#0082EF" @click="editclick(record,1)">编辑</span>
            <a
              :href="`${HttpUrl}/red_template_download?id=${record.key}&type=2&token=${$store.state.token}`"
              download="123"
            >
              <span style="color:#0082EF" @click="editclick(record,2)">下载</span>
            </a>
            <span style="color:#fa5555" @click="editclick(record,3)">删除</span>
          </div>
        </span>
      </a-table>
    </div>
    <Pagetion
      @pageChange="pagechangemsonset"
      @currentchange="currentchangemsonset"
      :paging="paging"
      class="Page"
    />
    <a-modal v-model="visibles" cancelText="取消" okText="确定" title="修改套红模板名称" @ok="handleOks">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="模板名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 套红预览 -->
    <a-modal
      class="transfer-modal"
      title="套红模板预览"
      :visible="view_template.visible"
      :confirm-loading="confirmLoading"
      @ok="view_template.visible=false"
      @cancel="view_template.visible=false"
      :footer="null"
      cancelText="取消"
      okText="确认"
    >
      <div class="view_template">
        <span class="content" v-html="view_template.content"></span>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  Delloadcrims,
  Setloadcrims,
  Getloadcrims,
  Download,
} from "@/api/postcrimsonset.js";

import { Calculatedaltitude } from "@/js/public.js";
import Pagetion from "@/views/components/Pagination.vue";
import { HttpUrl } from "@/js/public.js";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      visibles: false,
      height: 0,
      form: {
        //修改套红模板内容
        name: "",
      },
      row: {},
      rules: {
        // 修改套红模板内容判断
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
      // 传送给分页的数据
      paging: {
        total: null,
        current: 1,
        pageSize: 10,
      },
      getpostList: false, //分页改变的时候判断获取查询的数据还是列表数据
      table_data: {}, //排序
      HttpUrl,
      view_template: { visible: false, content: "" }, //套红模板预览
      //弹窗动画
      confirmLoading: false,
    };
  },
  components: {
    Pagetion,
  },
  created() {
    // 获取套红模板列表
    this.getloadcrims();
    //  查询套红列表
    this.onList();
    // 接收到传来的页数和码数
    this.$bus.$emit("getsendpage", (val) => {
      this.defaultCurrent = val.paging.current;
      this.defaultPageSize = val.paging.pageSize;
    });
    // 接收查询以后的页码
    this.$bus.$on("getcrimsonset", (val) => {
      this.paging.current = val;
    });
    this.columns = [
      {
        title: "模板名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: { customRender: "name" },
      },
      {
        title: "创建账号",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
        ellipsis: true,
        sorter: (a, b) => a.create_time.length - b.create_time.length,
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        width: 160,
        scopedSlots: { customRender: "operation" },
      },
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(10, 60, 54, 12, 59);
  },
  methods: {
    ///postcrimsonset/crimsonadd   type：1:=>新建，2=>预览，3=>编辑
    editclick(el, num) {
      // num:1=>删除
      if (num == 1) {
        this.row = el;
        this.form.name = el.name;
        this.$router.push({
          path: "/getcrimsonset/getcrimsonadd",
          query: { id: el.key, type: 3 },
        });
      }
      if (num == 2) {
        this.row = el;
        // this.download();
      }
      if (num == 3) {
        this.row = el;
        this.showModal();
      }
      if (num == 4) {
        this.view_template.visible = true;
        this.view_template.content = el.content;
      }
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
        this.$bus.$emit("getcrimsonset", {
          order_field: s.columnKey,
          sort: order,
        });
        if (this.getpostList) {
          this.onList();
        } else {
          this.getloadcrims();
        }
      }
    },
    // 点击确定关闭编辑套红模板弹窗
    handleOks() {
      this.setloadcrims();
      this.visibles = false;
    },
    // 打开编辑套红模板弹窗
    amend(record) {
      this.visibles = false;
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
    // 页码发生变化
    pagechangemsonset(val) {
      this.paging.current = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("getsetpostList", {
          current: this.paging.current,
          page: this.paging.pageSize,
        });
      } else {
        this.getloadcrims();
      }
    },
    // 条数发生变化
    currentchangemsonset(val) {
      this.paging.current = 1;
      this.paging.pageSize = val;
      if (this.getpostList) {
        this.onList();
        // 让查询的数据也改变
        this.$bus.$emit("getsetpostList", {
          current: this.paging.current,
          page: this.paging.pageSize,
        });
      } else {
        this.getloadcrims();
      }
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this;
      this.delloadcrims();
    },
    // 获取套红模板列表
    // 获取列表
    getloadcrims() {
      Getloadcrims({
        page: this.paging.current,
        type: 2,
        sort: this.table_data.sort_type,
        order_field: this.table_data.sort_field,
      }).then((res) => {
        if (res.code == 1 && res.data.data != undefined) {
          let arr = [];
          res.data.data.map((v) => {
            let obj = {};
            obj.key = v.id;
            obj.name = v.name;
            obj.create_time = v.create_time;
            obj.age = v.username;
            obj.path = v.path;
            obj.status = v.status;
            obj.content = v.content;
            arr.push(obj);
          });
          this.data = arr;
          this.paging.total = res.data.count;
        } else {
          this.data = [];
          this.paging.total = 0;
        }
      });
    },
    // 查询套红模板列表
    onList() {
      // 接收点击查询之后传来的参数
      this.$bus.$on("getloadList", (val) => {
        if (val.res) {
          let arr = [];
          val.res.map((v) => {
            let obj = {};
            obj.key = v.id;
            obj.name = v.name;
            obj.create_time = v.create_time;
            obj.age = v.username;
            obj.path = v.path;
            obj.content = v.content;
            arr.push(obj);
          });
          this.data = arr;
          this.paging.total = val.total;
          this.getpostList = val.getpostList;
        } else {
          this.data = [];
        }
      });
    },

    // 删除套红模板
    delloadcrims() {
      Delloadcrims({ id: this.row.key }).then((res) => {
        if (res.code == 1) {
          this.getloadcrims();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding-top: 0;
  .operation {
    * {
      cursor: pointer;
    }
  }
}
.main-table-at-cy {
  display: inline-block;
  text-align: center;
  font-size: 12px;
  width: 34px;
  height: 20px;
  background: #eaf0fc;
  color: #839ccf;
  margin-left: 6px;
}
.transfer-modal {
  /deep/ .ant-modal-footer {
    border: none;
  }
  /deep/.ant-modal-content {
    width: 594px;
  }
  .view_template {
    display: flex;
    margin-top: 50px;
    height: 500px;
    .content {
      width: 100%;
      height: 80px;
      padding-bottom: 20px;
      border-bottom: 3px solid #fa5555;
      box-sizing: border-box;
    }
  }
}
</style>