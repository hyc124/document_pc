<template>
  <div>
    <a-button @click="fanhui" :disabled="selectdata.length<=1">返回上一层</a-button>
    <template v-for="item in selectdata[selectdata.length-1]">
      <div
        :class="{'selectall':true,'selectavt':item.id==avt_id?true:false}"
        :key="item.id"
        @dblclick="selectCL(item)"
        @click="dselectCL(item)"
      >
        <div>{{item.title}}</div>
      </div>
    </template>
  </div>
</template>
<script>
import { group_list } from "@/api/incoming.js";
export default {
  name: "Ottree",
  props: ["avt_id"],
  data() {
    return {
      data: null,
      selectdata: []
    };
  },
  async created() {
    let res = await group_list();
    this.data = res.data;
    this.selectdata.push(res.data);
  },
  methods: {
    fanhui() {
      if (this.selectdata.length == 1) {
        this.$message.warning("已经是最上层了");
        return;
      }
      this.$emit("renqclick", "");
      this.selectdata.pop();
    },
    qianjin() {},
    dselectCL(as) {
      if (this.avt_id == as.id) {
        this.$emit("renqclick", "");
        return;
      }
      this.$emit("renqclick", as.id);
    },
    selectCL(item) {
      if (item.children) {
        this.$emit("renqclick", "");
        this.selectdata.push(item.children);
      } else {
        this.$message.warning("没有文件夹了");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.selectall {
  user-select: none;
  height: 40px;
  margin: 10px 0;
  display: flex;
  padding: 0 20px;
  align-items: center;
  background-color: #f2f7ff;
}
.selectavt {
  background-color: #77acff;
}
</style>