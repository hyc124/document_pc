<template>
  <div class="comtable">
    <div class="table-content-at" :style="{height:`${height + 77}px`}">
      <a-table
        v-if="tabs.data!=''"
        :columns="columnsone"
        :data-source="tabs.data"
        :row-selection="tabs.rowSelection"
        :pagination="false"
        :customRow="rowClicks"
        :row-key="item=>item.id"
        :scroll="{ y: height }"
      >
        <span slot="avatar" slot-scope="text,record">
          <img :src="record.avatar|img" alt />
        </span>
        <span slot="handle" v-if="powers('organization_set_role')" slot-scope="text,record">
          <div class="flex-col operation">
            <div @click="editclick(text,record)">编辑</div>
          </div>
        </span>
      </a-table>
    </div>
    <Pagination :paging="paging" @pageChange="pageChange" @currentchange="currentchange" />
  </div>
</template>
<script>
import Pagination from "@/views/components/Pagination.vue";
import { Calculatedaltitude } from "@/js/public.js";
let columnsone = [
  // 表单格式
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: 100,
    ellipsis: true
  },
  {
    title: "性别",
    dataIndex: "gender",
    key: "gender",
    ellipsis: true,
    width: 100,
    customRender: num => {
      let text = "";
      if (num == 1) {
        text = "男";
      } else if (num == 2) {
        text = "女";
      } else {
        text = "未录入";
      }
      return text;
    }
  },
  {
    title: "头像",
    dataIndex: "avatar",
    key: "avatar",
    ellipsis: true,
    width: 70,
    scopedSlots: { customRender: "avatar" }
  },
  {
    title: "手机号",
    key: "mobile",
    dataIndex: "mobile",
    ellipsis: true
  },
  {
    title: "邮箱",
    key: "email",
    dataIndex: "email",
    ellipsis: true,
    width: 150
  },
  {
    title: "部门",
    dataIndex: "dep_name",
    key: "dep_name",
    ellipsis: true
  },
  {
    title: "角色",
    dataIndex: "role_name",
    key: "role_name",
    ellipsis: true
  },
  {
    title: "操作",
    key: "handle",
    dataIndex: "handle",
    width: 100,
    scopedSlots: { customRender: "handle" }
  }
];
export default {
  name: "Main",
  data() {
    return {
      columnsone,
      height: 0
    };
  },
  components: {
    Pagination
  },
  props: ["tabs", "paging"],
  computed: {
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction;
    }
  },
  mounted() {
    this.height = Calculatedaltitude(60, 46, 16, 70, 30, 53);
  },
  filters: {
    img(url) {
      let text = String(url).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = url;
      } else {
        imgurl = "http://lotus.mgtx-tech-dev.mgtx.com.cn/" + url;
      }
      return imgurl;
    }
  },
  methods: {
    //分页事件
    pageChange(e) {
      this.$emit("onTables");
      this.paging.current = e;
      this.$emit("rowClick", this.paging);
    },
    // 每页条数改变
    currentchange(v) {
      this.paging.pageSize = v;
      this.paging.current = 1;
      this.$emit("rowClick", this.paging);
    },
    // 点击编辑数据
    editclick(t, r) {
      this.$emit("compile", r);
    },
    // 点击一行数据
    rowClicks(r) {
      return {
        on: {
          click: () => {
            // this.$emit("rowClick", r);
          }
        }
      };
    },
    // 权限判断
    powers(text) {
      return this.jurisdiction[8].includes(text);
    }
  }
};
</script>
<style lang="less">
.comtable {
  padding: 12px 0 0px;
  img {
    height: 22.5px;
    width: 22.5px;
  }
  .operation {
    justify-content: space-between;
    div {
      cursor: pointer;
    }
  }
}
</style>