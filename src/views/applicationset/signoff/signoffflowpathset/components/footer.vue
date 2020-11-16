<template>
  <div class="footer flex-col">
    <div class="flex-col-bd"></div>
    <a-pagination
      show-size-changer
      :default-current="defaultCurrent"
      :default-pageSize="defaultPageSize"
      :total="total"
      @showSizeChange="onShowSizeChange"
      @change="onChange"
    />
  </div>
</template>
<script>
import { GetpathsetList } from "@/api/postflowpathset";
export default {
  name: "Footer",
  data() {
    return {
      // 默认当前页数
      defaultCurrent: 1,
      defaultPageSize: 10,
      total: 0,
      current: 1,
      getgetList: false,
      kwd: ""
    };
  },
  mounted() {
    // 获取列表
    this.getdataList();
  },
  created() {
    // 获取删除后发出的通知
    this.$bus.$on("signoffflowpathsetdeldataList", val => {
      this.getdataList();
    });
    this.$bus.$on("signoffflowpathsetGetdatakwd", val => {
      this.kwd = val;
      this.getdataList();
    });
  },
  methods: {
    // 获取列表
    getdataList() {
      GetpathsetList({
        type: 3, // 收文
        page: this.current,
        limit: this.defaultPageSize,
        kwd: this.kwd
      }).then(res => {
        if (res.code == 1) {
          this.total = res.data.count;
          this.$bus.$emit("signoffflowpathsetGetdata", res.data.data);
        }
      });
    },
    // 改变分页
    onChange(page, pageSize) {
      this.current = page;
      this.getdataList();
    },
    // 修改条数
    onShowSizeChange(current, size) {
      this.current = current;
      this.defaultPageSize = size;
      this.getdataList();
    }
  }
};
</script>
<style lang="less" scoped>
.footer {
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid #e6edf5;
}
</style>