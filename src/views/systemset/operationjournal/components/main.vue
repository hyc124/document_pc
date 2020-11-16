<template>
  <div class="mains">
    <div class="table-content-at" :style="{height:`${height + 60+24}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :row-selection="rowSelection"
        :pagination="false"
        :scroll="{ y: height }"
        @change="Change"
      >
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation">
            <div @click="details(record,1)">详情</div>
          </div>
        </span>
      </a-table>
    </div>
    <a-modal v-model="visible" title="日志详情" cancelText="取消" okText="确定" @ok="visible=false">
      <p class="item">
        <span class="title">操作人</span>
        <span class="content">{{oper_detail.user_name}}</span>
      </p>
      <p class="item">
        <span class="title">操作人角色</span>
        <span
          class="content"
          v-for="(item,index) in oper_detail.role"
          :key="index"
        >{{item.role_name}}</span>
      </p>
      <p class="item">
        <span class="title">操作行为</span>
        <span class="content">{{oper_detail.remark}}</span>
      </p>
      <p class="item">
        <span class="title">配置对象</span>
        <span class="content">{{oper_detail.to_name}}</span>
      </p>

      <p class="item">
        <span class="title">操作详情</span>
        <span class="content">
          【
          <span class="operation">{{oper_detail.remark}}</span> 】
          <span class="active bl">{{oper_detail.user_name}}</span>
          为
          <span class="passive bl">{{oper_detail.to_name}}</span> 配置
          <span class="role bl">管理员</span>
          角色
        </span>
      </p>
      <p class="item">
        <span class="title">操作时间</span>
        <span class="content">{{oper_detail.create_time}}</span>
      </p>
      <p class="item">
        <span class="title">IP地址</span>
        <span class="content">{{oper_detail.ip}}</span>
      </p>
      <p class="item">
        <span class="title">操作终端</span>
        <span class="content">Chrome浏览器</span>
      </p>
    </a-modal>
    <a-pagination
      v-model="that_page"
      :total="count"
      :page-size="size"
      :page-size-options="pageSizeOptions"
      @change="count_change"
      show-size-changer
      @showSizeChange="onShowSizeChange"
      class="a-pagination"
    ></a-pagination>
  </div>
</template>
<script>
import { operationjournal, operationjournal_detail } from "@/api/roleset.js";
import { Calculatedaltitude } from "@/js/public.js";
export default {
  props: ["search"],
  data() {
    return {
      data: null,
      columns: null,
      rowSelection: null,
      load_flag: false,
      //页数配置
      pagination: {
        pageSize: 10
      },
      //当前页数
      that_page: 1,
      //总页数
      count: null,

      //详情
      visible: false,
      //详情id
      detail_id: null,
      oper_detail: {
        user_name: "",
        role: [{ role_name: "" }],
        remark: "",
        to_name: "",
        create_time: "",
        ip: ""
      },
      height: null,
      //表格数据
      table_data: {
        order_field: null,
        sort: null
      },
      //当前页条数
      pageSizeOptions: ["10", "20", "30", "40", "50"],
      size: 10,
      obj: {
        one: {}
      }
    };
  },
  created() {
    this.columns = [
      {
        title: "用户名称",
        dataIndex: "user_name",
        key: "user_name",
        scopedSlots: { customRender: "name" },
        ellipsis: true
      },
      {
        title: "角色",
        dataIndex: "role_name",
        key: "role_name",
        ellipsis: true
      },
      {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
        ellipsis: true
      },
      {
        title: "登录时间",
        dataIndex: "create_time",
        key: "create_time",
        sorter: (a, b) => a.create_time.length - b.create_time.length,
        ellipsis: true
      },
      {
        title: "操作内容",
        dataIndex: "remark",
        key: "remark",
        ellipsis: true
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 110,
        ellipsis: true
      }
    ];

    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      }
    };
    this.get_operator();
  },
  mounted() {
    this.$bus.$on("onOperationjournal", obj => {
      this.obj.one = obj;
      this.get_operator();
    });
    this.height = Calculatedaltitude(70, 60, 67);
  },
  methods: {
    // 获取列表数据
    async get_operator(keyword = "") {
      let { data } = await operationjournal({
        keyword,
        page: this.that_page,
        order_field: this.table_data.order_field,
        sort: this.table_data.sort,
        limit: this.size,
        time: this.obj.one["操作时间"]?.arry.join(",")
      });

      if (data && data.data) {
        data.data.forEach((element, index) => {
          element.key = index;
        });
        this.data = data.data;
        this.count = data.count;
      } else {
        this.data = null;
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
        this.get_operator();
      }
    },
    //分页操作
    count_change(page, pageSize) {
      this.that_page = page;
      this.get_operator();
    },
    onShowSizeChange(page, pagesize) {
      this.size = pagesize;
      this.get_operator();
    },
    //详情
    async details(el, num) {
      this.detail_id = el.id;
      let { code, data } = await operationjournal_detail({
        id: this.detail_id
      });
      this.oper_detail = data;
      this.visible = true;
    }
  },
  watch: {
    search() {
      this.get_operator(this.search);
    }
  }
};
</script>
<style lang="less" scoped>
.a-pagination {
  margin: 10px 0px !important;
}
.mains {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
    div:hover {
      color: #0082ef;
    }
  }
  /deep/.ant-descriptions-item > span {
    margin-right: 60px;
  }
  .operation {
    justify-content: space-between;
    color: #0082ef;
    div {
      cursor: pointer;
    }
    div:hover {
      color: #0082ef;
    }
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
}
.item {
  font-size: 16px;
  .title {
    display: inline-block;
    width: 80px;
    margin-right: 30px;
    text-align: right;
  }
  .content {
    color: #909399;
    .bl {
      color: #0082efff;
    }
  }
}
.header {
  justify-content: space-between;
  height: 60px;
  // margin-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #e4e7ed;
  .headerbtn {
    margin-left: 20px;
  }
}
</style>