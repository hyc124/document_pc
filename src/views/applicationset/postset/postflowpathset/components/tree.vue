<template>
  <div v-if="tabs!= undefined">
    <a-tree :tree-data="tabs.tree.children"
            show-icon
            @select="onSelect"
            @expand="onExpand">
      <a-icon slot="FolderFilled"
              type="folder" />
      <a-icon slot="Folder"
              type="user" />
      <a-icon slot="Folders"
              type="tag" />
    </a-tree>
  </div>
</template>
<script>
import {
  OrganiZationalList,
  addLabelList,
  document_role_index,
} from '@/api/public.js'
export default {
  name: 'Tree',
  data() {
    return {}
  },
  mounted() {
  },
  props: ['tabs', 'res', 'transformation'],
  methods: {
    onSelect(keys, e) {
      if (e.selected) {
        let a = e.node.dataRef
        let { id, title, slots } = a
        let value =
          slots.icon == 'Folder'
            ? a.userid
            : slots.icon == 'Folders'
            ? 'tag' + a.id
            : a.id
        let type = slots.icon == 'Folder' ? 0 : slots.icon == 'Folders' ? 2 : 1

        let avatar = slots.icon == 'Folder' ? a.avatar : ''
        // 当选接收人选部门的时候（会将部门里面的人提出来）
        if (type == 1 && this.res.pe && this.res.bm && this.transformation) {
          OrganiZationalList({
            dept_id: id,
            type: 3,
          }).then((data) => {
            let _arr = []
            data.data.members.forEach((el) => {
              _arr.push({
                value: el.userid,
                title: el.name,
                type: 0,
                avatar: el.avatar,
              })
            })
            this.$emit('treeClick', _arr)
          })
          return
        }
        if (
          (this.res.pe && type == 0) ||
          (this.res.bm && type == 1) ||
          (this.res.tags && type == 2)
        ) {
          this.$emit('treeClick', {
            value,
            // id,
            title,
            type,
            avatar,
          })
        }
      }
    },
    onExpand() {
    },
  },
}
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
  padding-left: 35px;
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
  padding-left: 18px;
}
</style>
