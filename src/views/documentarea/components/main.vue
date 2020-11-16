<template>
  <div class="main">
    <div class="table-content-at" :style="{height:`${height+54 +24}px`}">
      <a-table
        :columns="tabs.columns"
        :data-source="tabs.data"
        :row-selection="checkBoxSelect(tabs)"
        :pagination="false"
        :customRow="rowClicks"
        :scroll="{ y: height }"
        @change="Change"
      >
        <span slot="process_urgent_level" slot-scope="text">
          <div class="flex-col">
            <div
              class="process-status"
              :class="StatusColor(text)"
            >{{text}}</div>
          </div>
        </span>
        <span slot="status" slot-scope="text">
          <div class="flex-col" :style="`color:${StateColor(text)};`">
            <div class="main-status-dian">·</div>
            <div>{{text}}</div>
          </div>
        </span>
        <span slot="operation" slot-scope="text,record">
          <div class="flex-col operation">
            <template v-for="(item, index) in tabs.operation">
              <div :key="index" @click="editclick(text,record)">{{item.name}}</div>
            </template>
          </div>
        </span>
      </a-table>
    </div>
    <a-pagination
      v-model="paging.current"
      :total="tabs.count"
      :page-size="paging.size"
      :page-size-options="paging.pageSizeOptions"
      @change="pageChange"
      show-size-changer
      @showSizeChange="onShowSizeChange"
      class="a-pagination"
    />
  </div>
</template>
<script>
import Pagination from "@/views/components/Pagination.vue";
import { Calculatedaltitude, checkBoxSelect } from "@/js/public.js";

export default {
  props: {
    tabs: {
      default: null,
      type: Object
    },
    iswastetank: {
      default: null
    }
  },
  //1为归档，2为废弃
  data() {
    return {
      checkBoxSelect, // 表单多选按钮点击函数挂载
      data: null,
      columns: null,
      rowSelection: null,
      visible: "",
      visibles: false,
      height: 0,
      page: 1,

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
      //表格数据
      table_data: {
        order_field: null,
        sort: null
      },
      // 分页组件参数
      paging: {
        //当前页
        current: 1,
        //总页
        total: null,
        //数据条数
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        size: 10
      }
    };
  },

  created() {
    setTimeout(() => {
      this.paging.total = this.tabs.count;
    }, 200);
  },
  components: {
    Pagination
  },
  mounted() {
    this.height = Calculatedaltitude(45, 68.5, 24, 54, 72);
  },
  methods: {
    editclick(t, r) {},
    //页码改变
    pageChange(e) {
      this.tabs.selectedRowKeys = []
      this.paging.current = e;
      this.$emit(
        "main_page_change",
        this.paging.current,
        this.form.name,
        this.table_data,
        this.paging.size
      );
    },
    //数据条数改变
    onShowSizeChange(page, pagesize) {
      this.paging.size = pagesize;
      this.$emit(
        "page_size_change",
        this.paging.current,
        this.form.name,
        this.table_data,
        this.paging.size
      );
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
        this.$emit(
          "main_page_change",
          this.page,
          this.form.name,
          this.table_data
        );
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
        onOk: this.handleOk
      });
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
    StatusColor(text) {
      let _obj = {
        紧急: "urgent",
        普通: "normal",
        加急: "so-urgent"
      };
      return _obj[text];
    },
    StateColor(text) {
      let _obj = {
        等待中: "#F5AC40",
        审核通过: "#62C232",
        报废: "#F56C6C",
        归档: "#909499",
        审核进行中: "#F5AC40"
      };
      return _obj[text];
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.visible = false;
        this.form.name = "";
      }
    },
    rowClicks(r) {
      let _this = this;
      return {
        on: {
          click: function() {
            if (r.status == "报废") {
              this.$router.push({
                path: "/home/incoming",
                query: {
                  id: r.id,
                  file_type: r.type == "发文" ? 1 : 2,
                  area_type: 2,
                  cut: _this.tabs.cut
                }
              });
            } else {
              this.$router.push({
                path: "/home/incoming",
                query: {
                  id: r.id,
                  file_type: r.type == "发文" ? 1 : 2,
                  cut: _this.tabs.cut
                }
              });
            }
          }.bind(this)
        }
      };
    }
  }
};
</script>
<style lang="less" scoped>
.main {
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
  /deep/.ant-table-row {
    cursor: pointer;
  }
  .main-status-dian {
    transform: scale(3.5);
    margin-right: 10px;
    line-height: 20px;
    position: relative;
    bottom: 2px;
  }
  .process-status {
    padding: 0 10px;
    margin: 0 auto;
  }
}
</style>