<template>
  <div class="header flex-col">
    <div>
      <a-input-search
        placeholder="请输入关键字"
        v-model="Searchterms"
        enter-button
        style="width: 260px"
        @search="onSearchIcon"
        :maxLength="20"
      />
    </div>
    <div class="flex-col-bd"></div>
    <div>
      <a-button @click="onSearch" type="primary">新建</a-button>
    </div>
  </div>
</template>

<script>
import { Getpostrulese } from "@/api/postruleset.js";
export default {
  name: "Header",
  data() {
    return {
      Searchterms: "",
      defaultCurrent: 1,
      defaultPageSize: 0,
      sort_field: null,
      sort: null
    };
  },
  computed: {},
  created() {
    // 接收到传来的页数和码数
    this.$bus.$on("postformworksetSendpage", val => {
      this.defaultCurrent = val.defaultCurrent;
      this.defaultPageSize = val.defaultPageSize;
    });
    // 刷新页面
    this.$bus.$on("postformworksetSetpostList", val => {
      this.defaultCurrent = val.current;
      this.defaultPageSize = val.page;
      this.getpost();
    });
    // 获取排序
    this.$bus.$on("postruesetsort", val => {
      this.sort_field = val.sort_field;
      this.sort = val.sort;
      this.getpost();
    });
  },
  methods: {
    onSearchIcon() {
      this.onInquire();
    },
    onSearch() {
      this.$router.push({ name: "add" });
    },
    // 查询
    onInquire() {
      this.defaultCurrent = 1;
      this.$bus.$emit("postrulesetpage", 1);
      this.getpost();
    },
    // 查询发文编号规则列表
    getpost() {
      // 点击点查询获取发文列表
      Getpostrulese({
        type: 1,
        kwd: this.Searchterms,
        limit: this.defaultPageSize,
        page: this.defaultCurrent,
        order_field: this.sort_field,
        sort: this.sort
      }).then(res => {
        if (res.code == 1) {
          this.$bus.$emit("postformworksetGetpostList", {
            data: res.data,
            getpostList: true,
            total: res.count
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  .headerbtn {
    border-radius: 0px 4px 4px 0px;
    margin-left: -2px;
    height: 32px;
  }
  /deep/.ant-input-wrapper.ant-input-group .ant-btn-primary {
    color: #dadadb;
    background-color: #fff;
    border-color: #dadadb;
  }
  /deep/ .ant-input {
    border-radius: 4px 0px 0px 4px;
  }
}
</style>