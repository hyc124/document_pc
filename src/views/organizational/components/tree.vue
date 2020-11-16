<template>
  <div class="treebigbox">
    <a-tree :tree-data="children" show-icon @select="onSelect" @expand="onExpand">
      <a-icon slot="FolderFilled" type="folder" theme="twoTone" />
      <a-icon slot="Folders" type="tag" twoToneColor="#333333" />
    </a-tree>
  </div>
</template>
<script>
export default {
  name: "Tree",
  data() {
    return {};
  },
  mounted() {
  },
  props: ["children"],
  methods: {
    onSelect(keys) {
      this.$emit("treeClick", keys);
    },
    onExpand() {
      console.log(this.children);
    }
  }
};
</script>

<style lang="less" scoped>
.treebigbox {
  height: 600px;
  overflow-y: auto;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  width: calc(100% - 25px);
  height: 40px;
  line-height: 40px;
  border-radius: 0px;
  padding-left: 20px;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  border-right: 2px solid #0082ef;
  background: #e5f2fe;
}
/deep/ .ant-tree li span.ant-tree-iconEle {
  height: 40px;
  line-height: 40px;
}
/deep/ .ant-tree li span.ant-tree-switcher {
  height: 40px;
  line-height: 40px;
}
</style>
