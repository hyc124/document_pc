
<template>
  <div class="centertext">
    <div class="flex-col">
      <span class="left">正文编辑方式</span>
      <a-checkbox-group v-model="value" @change="onChange" :options="datas"></a-checkbox-group>
    </div>
  </div>
</template>

<script>
let datas = [
  { label: "导入正文内容", value: 1 },
  { label: "在线编辑", value: 2 },
];
//正文类型 1附件 2在线编辑 同时存在 逗号隔开
export default {
  name: "CenterText",
  components: {},

  data() {
    return {
      value: [1, 2],
      datas,
    };
  },
  mounted() {},
  created() {
    this.$bus.$on("postsetcentertext", (val) => {
      this.$bus.$emit("postsetcentertextAdd", this.value.join(","));
    });
  },
  methods: {
    onChange(item) {
      this.$emit("onChangeMain", item.join(","));
    },
  },
};
</script>

<style lang="less" scoped>
.centertext {
  padding-top: 14px;
  width: 1200px;

  .flex-col {
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    border: 1px solid #ccc;
  }
  .left {
    text-align: center;
    display: inline-block;
    color: #303133;
    font-size: 14px;
    background-color: #f9f9f9;
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;
    margin-right: 31px;
  }
  .radioleft {
    margin-right: 40px;
  }
}
</style>