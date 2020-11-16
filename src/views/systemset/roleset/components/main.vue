  <template>
  <div class="mains">
    <div class="table-content-at" :style="{height:`${height + 54+24}px`}">
      <a-table
        v-if="userList"
        :scroll="{ y: height }"
        :columns="columns"
        :data-source="userList"
        :pagination="false"
        :row-key="record => record.id"
      >
        <span slot="operation" slot-scope="item,record">
          <div class="flex-col operation" v-if="record.id!==1">
            <div class="cz" @click="editclick(record,3)" style="color:#0082EF;">用户列表</div>
            <div class="cz" @click="editclick(record,1)" style="color:#0082EF;">编辑</div>
            <div class="cz-del" @click="editclick(record,2)" style="color:#F56C6C;">删除</div>
          </div>
          <div class="flex-col operation" v-else>
            <div>系统默认</div>
            <div class="cz" @click="editclick(record,3)" style="color:#0082EF;">用户列表</div>
          </div>
        </span>
      </a-table>
    </div>
    <a-pagination
      v-model="paging.current"
      :total="paging.total"
      :page-size="paging.size"
      :page-size-options="pageSizeOptions"
      @change="pageChange"
      show-size-changer
      @showSizeChange="onShowSizeChange"
      class="a-pagination"
    ></a-pagination>
    <a-modal
      title="删除用户"
      :visible="delete_visible"
      :confirm-loading="confirmLoading"
      @ok="delete_ok"
      @cancel="delete_visible=false"
      okText="确认"
      cancelText="取消"
    >
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>
<script>
import { delete_role } from "@/api/roleset.js";
import Pagination from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
export default {
  name: "Main",
  props: {
    userList: {
      default: null
    },
    count: {
      default: null
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      data: null,
      columns: null,
      rowSelection: null,
      load_flag: false,
      //删除提醒
      delete_visible: false,
      ModalText: "该操作不可逆，请谨慎操作",
      confirmLoading: false,
      //删除的用户id
      delete_id: null,

      //tabel高度
      height: 0,
      // 分页组件参数
      paging: {
        current: 1,
        total: null,
        size: 10
      },
      //当前页条数
      pageSizeOptions: ["10", "20", "30", "40", "50"]
    };
  },
  mounted() {
    this.height = Calculatedaltitude(60, 60, 70);
  },
  created() {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "role_name",
        key: "role_name",
        scopedSlots: { customRender: "name" },
        ellipsis: true
      },
      {
        title: "创建时间",
        dataIndex: "created_time",
        key: "created_time",
        ellipsis: true
      },
      // {
      //   title: "用户列表",
      //   dataIndex: "users",
      //   key: "users",
      //   ellipsis: true
      // },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 170
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

    this.$bus.$on("roleset_add_user", this.add_user);
  },
  methods: {
    //分页操作
    pageChange(val) {
      this.paging.current = val;
      this.$emit("update_user", this.paging);
    },
    onShowSizeChange(size, pageSize) {
      this.paging.size = pageSize;
      this.$emit("update_user", this.paging);
    },
    //删除用户
    async delete_user(id) {
      let { code } = await delete_role({ id });
      this.$emit("update_user", this.paging);
      this.delete_id = null;
      this.delete_visible = false;
    },
    //确认删除
    delete_ok() {
      if (this.delete_id) {
        this.delete_user(this.delete_id);
      }
    },

    //编辑、删除用户
    editclick(el, num) {
      if (num == 1) {
        this.$router.push({
          path: "/roleset/roleEditing",
          query: {
            id: el.id
          }
        });
      } else if (num == 2) {
        this.delete_visible = true;
        this.delete_id = el.id;
      } else {
        this.$router.push({
          path: "/organizational",
          query: {
            id: el.id
          }
        });
      }
    }
  },
  watch: {
    count() {
      this.paging.total = this.count;
    }
  }
};
</script>
<style lang="less" scoped>
.mains {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
}
.a-pagination {
  margin: 10px 0px !important;
}
</style>