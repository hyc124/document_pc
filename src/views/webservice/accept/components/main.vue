<template>
  <div>
    <div class="table-content-at" :style="{height:`${height + 54 + 24}px`}">
      <a-table
        :customRow="onClicks"
        :columns="columns"
        :data-source="data"
        :row-key="(itme)=>itme.id"
        @change="Change"
        :scroll="{ y: height }"
        :pagination="false"
      >
        <span slot="status" slot-scope="item">
          <div class="flex-col operation" :style="{'color':ffstate[item].color}">
            <span class="status-span">·</span>
            {{ffstate[item].text}}
          </div>
        </span>
      </a-table>
    </div>
    <a-modal v-model="visibles" cancelText="取消" okText="确定" title="修改收文类别名称" @ok="handleOks">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="类别名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <Pagination
      @pageChange="pagechangepathget"
      @currentchange="currentchangepathget"
      :paging="paging"
    />
  </div>
</template>
<script>
import { Calculatedaltitude } from "@/js/public.js";
import { acceptList } from "@/api/accept.js";
import Pagination from "@/views/components/Pagination.vue";
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
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
      // 头部组件里面的状态
      statenum: "",
      // 头部组件里输入框的文字
      kwdtext: "",
      height: 0,
      //表格数据
      table_data: {
        order_field: null,
        sort: null
      },
      // 文件状态
      ffstate: {
        0: {
          text: "待查阅",
          color: "#0082EF"
        },
        1: {
          text: "待签收",
          color: "#0082EF"
        },
        2: {
          text: "已签收",
          color: "#62C232"
        },
        3: {
          text: "已退回",
          color: "#F56C6C"
        }
      },
      // 传送给分页的数据
      paging: {
        // 数据总条数
        total: null,
        // 当前分页数
        current: 1,
        pageSize: 10
      },
      obj: {
        one: {}
      }
    };
  },
  components: {
    Pagination
  },
  created() {
    this.columns = [
      // 表单格式
      {
        title: "来文标题",
        dataIndex: "title",
        key: "title",
        width: 120,
        ellipsis: true
      },
      {
        title: "来文字号",
        dataIndex: "word_no",
        key: "word_no",
        width: 150,
        ellipsis: true
      },
      {
        title: "来文单位",
        dataIndex: "ffDepts",
        key: "ffDepts",
        width: 150,
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
        title: "签发人",
        key: "ff_user",
        dataIndex: "ff_user",
        width: 90,
        ellipsis: true
      },
      {
        title: "接收单位",
        key: "jsDepts",
        dataIndex: "jsDepts",
        width: 150,
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
        title: "分发接收人",
        key: "js_user",
        dataIndex: "js_user",
        width: 110,
        ellipsis: true
      },
      {
        title: "接收日期",
        key: "create_time",
        dataIndex: "create_time",
        width: 120,
        ellipsis: true,
        sorter: (a, b) => a.create_time.length - b.create_time.length
      },
      {
        title: "收文状态",
        key: "status",
        dataIndex: "status",
        width: 100,
        scopedSlots: { customRender: "status" }
      }
    ];
  },
  mounted() {
    this.height = Calculatedaltitude(80, 30, 83, 60);
    this.addList();
    // 每次在头部组件里面tabs编号把状态的值传过来赋给statenum
    this.$bus.$off("acceptState"); //先解绑，不然会多次出发
    this.$bus.$on("acceptState", num => {
      this.statenum = Number(num);
      this.kwdtext = "";
      this.addList();
    });
    // 监听用户在头部组件输入框的输入的文字
    this.$bus.$off("acceptKwd"); //先解绑，不然会多次出发
    this.$bus.$on("acceptKwd", text => {
      this.kwdtext = text;
    });
    this.$bus.$off("acceptaddList"); //先解绑，不然会多次出发
    // 把获取列表事件发送给header头部查询按钮调用
    this.$bus.$on("acceptaddList", this.addList);
    this.$bus.$off("acceptpagenum"); //先解绑，不然会多次出发
    // 底部组件的分页数
    this.$bus.$on("acceptpagenum", page => {
      this.kwdtext = "";
      this.pagenum = page;
      this.addList();
    });
    this.$bus.$off("acceptButesenior"); //先解绑，不然会多次出发
    // 监听用户在头部组件的高级搜索
    this.$bus.$on("acceptButesenior", one => {
      this.obj.one = one;
      this.addList();
    });
  },

  methods: {
    editclick(el, num) {
      if (num == 1) {
        this.amend();
      } else {
        this.showModal();
      }
    },
    // 表单表格点击跳转事件
    onClicks(record, index) {
      let _this = this;
      return {
        on: {
          click: () => {
            this.$router.push({
              path: "/accept/acceptadd",
              query: {
                id: record.id,
                type: 2,
                num: _this.statenum,
                cut: 2
              }
            });
          }
        }
      };
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
    // 点击分页器事件
    pagechangepathget(key) {
      this.pagenum = key;
      this.addList();
    },
    // 每页条数发生变化
    currentchangepathget(val) {
      this.paging.current = 1;
      this.paging.pageSize = val;
      this.addList();
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
        this.addList();
      }
    },
    // 根据条件获取列表信息
    addList() {
      let obj = this.obj;
      acceptList({
        type: "", // 1发文，2收文，3签报
        kwd: this.kwdtext, // 搜索关键词
        page: this.paging.current, // 当前页码
        limit: this.paging.pageSize, // 每页条数
        status: this.statenum, // lab为1（1处理中 2已签收 3退回）lab为2（0待查阅 1待签收 2已签收 3退回）
        lab: 2, // 1我分发的 2我接收的 默认我分发的
        order_field: this.table_data.order_field, // 排序字段 按返回的字段名传值
        sort: this.table_data.sort, // 排序方式 asc升序 desc倒序
        advanced: {
          copy_users: obj.one["来文单位"]?.intext, // 来文单位
          word_no: obj.one["来文字号"]?.intext, // 来文字号
          issuer: obj.one["签发人"]?.id, // 签发人
          receiving_unit: obj.one["接收单位"]?.intext, // 接收单位
          receiving_time: obj.one["接收时间"]?.arry.join(",") // 接收时间
        }
      }).then(data => {
        this.data = data.data;
        this.paging.total = data.count;
      });
    }
  }
};
</script>
<style lang="less" >
.accept-main {
  padding: 12px 0;
  .operation {
    div {
      cursor: pointer;
    }
  }
  .distribute-main-tables {
    height: calc(100% - 40px);
    overflow: auto;
  }
  .accept-main-footer {
    padding: 10px 0px 0px;
  }
}
.status-span {
  line-height: 20px;
  font-size: 40px;
  transform: translateY(-4px);
  margin-right: 5px;
}
</style>