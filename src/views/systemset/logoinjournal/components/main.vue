  <template>
  <div class="mains">
    <div class="table-content-at" :style="{height:`${height + 24+60}px`}">
      <a-table
        :columns="columns"
        :data-source="data"
        :scroll="{ y: height }"
        :pagination="false"
        @change="Change"
      >
        <span slot="status" slot-scope="item,all">
          <div class="flex-col loginstate">
            <img :src="all.status==0?imgurl:imgs" style="padding-right: 5px;" />
            <div>{{item}}</div>
          </div>
        </span>
      </a-table>
    </div>
    <a-pagination
      v-model="that_page"
      :total="count"
      :page-size="size"
      :page-size-options="pageSizeOptions"
      @change="page_change"
      show-size-changer
      @showSizeChange="onShowSizeChange"
      class="a-pagination"
    ></a-pagination>
  </div>
</template>
<script>
import { logoinjournal } from "@/api/roleset.js";
import { Calculatedaltitude } from "@/js/public.js";
export default {
  props: ["search"],
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      rowSelection: null,
      imgs: require("../../../../assets/addpostset/fail.png"),
      imgurl: require("../../../../assets/addpostset/sucss.png"),
      that_page: 1,
      count: 0,
      //tabel高度
      height: 0,
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
        dataIndex: "username",
        key: "username",
        scopedSlots: { customRender: "username" },
        ellipsis: true
      },
      {
        title: "角色",
        dataIndex: "rolename",
        key: "rolename",
        ellipsis: true
      },
      {
        title: "登录终端型号",
        dataIndex: "terminal",
        key: "terminal",
        ellipsis: true
      },
      {
        title: "操作系统",
        dataIndex: "system",
        key: "system",
        ellipsis: true
      },
      {
        title: "IP",
        dataIndex: "ip",
        key: "ip",
        ellipsis: true
      },
      {
        title: "登陆状态",
        dataIndex: "c_status",
        key: "c_status",
        scopedSlots: { customRender: "status" },
        ellipsis: true
      },
      {
        title: "登录时间",
        dataIndex: "login_time",
        key: "login_time",
        width: "17%",
        sorter: (a, b) => a.login_time.length - b.login_time.length,
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
    this.get_logoinjournal_list();
  },
  mounted() {
    this.$bus.$on("onLoginjournal", obj => {
      this.obj.one = obj;
      this.get_logoinjournal_list();
    });
    this.height = Calculatedaltitude(75, 60, 61);
  },
  methods: {
    //获取登录日志
    async get_logoinjournal_list(keyword = "") {
      let { code, data } = await logoinjournal({
        keyword,
        page: this.that_page,
        order_field: this.table_data.order_field,
        sort: this.table_data.sort,
        limit: this.size,
        time: this.obj.one["登录时间"]?.arry.join(",")
      });

      if (data && data.res) {
        data.res.forEach((element, index) => {
          element.key = index;
          element.c_status = element.status == 0 ? "登录成功" : "登录失败";
          this.data = data.res;
          this.count = data.count;
        });
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
        this.get_logoinjournal_list();
      }
    },
    editclick(el, num) {},
    //分页
    page_change(page) {
      this.that_page = page;
      this.get_logoinjournal_list();
    },
    onShowSizeChange(page, pagesize) {
      this.size = pagesize;
      this.get_logoinjournal_list();
    }
  },
  watch: {
    search() {
      this.get_logoinjournal_list(this.search);
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
  .ant-pagination {
    text-align: right;
    margin: 15px 0 0 0;
  }
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
    div:hover {
      color: #0082ef;
    }
  }
}
</style>