<template>
  <div v-if="tabs!= undefined">
    <a-tree :tree-data="tabs.tree.children" show-icon @select="onSelect" @expand="onExpand">
      <a-icon slot="FolderFilled" type="folder" />
      <a-icon slot="Folder" type="user" />
      <a-icon slot="Folders" type="tag" />
      <a-icon slot="user" type="usergroup-delete" />
    </a-tree>
  </div>
</template>
<script>
export default {
  name: "Tree",
  data() {
    return {};
  },
  mounted() {},
  props: ["tabs", "res"],
  methods: {
    onSelect(keys, e) {
      if (e.selected) {
        let a = e.node.dataRef;
        let { id, title, slots } = a;
        let value =
          slots.icon == "Folder"
            ? a.userid
            : slots.icon == "Folders"
            ? "tag" + a.id
            : slots.icon == "user"
            ? "user" + a.id
            : a.id;
        let type =
          slots.icon == "Folder"
            ? 0
            : slots.icon == "Folders"
            ? 2
            : slots.icon == "user"
            ? 5 // 这个是系统角色
            : 1;
        let avatar = slots.icon == "Folder" ? a.avatar : "";
        let receiver_name = null;
        if (a.receiver_name) {
          receiver_name = a.receiver_name;
        }
        if (
          (this.res.pe && type == 0) ||
          (this.res.bm && type == 1) ||
          (this.res.tags && type == 2) ||
          (this.res.xtjs && type == 5)
        ) {
          this.$emit("treeClick", {
            value,
            title,
            type,
            avatar,
            receiver_name,
          });
        }
      }
    },
    onExpand() {},
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-tree li {
  position: relative;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  width: calc(100%);
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
/deep/ .ant-tree li span.ant-tree-switcher {
  position: absolute;
}
</style>
