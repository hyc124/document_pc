<template>
  <div v-if="tabs!= undefined">
    <a-tree :tree-data="tabs.tree.children"
            v-model="checked_arr"
            show-icon
            :checkable="true"
            :checkStrictly="true"
            @select="onSelect"
            @expand="onExpand"
            @check="onCheck">
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
export default {
  name: 'Tree',
  data() {
    return {
      checked_arr: {
        checked: [],
      },
      del_prefix: {
        0: 'pe',
        1: 'bm',
        2: 'tags',
      },
    }
  },
  mounted() {
    //清空树形结构的数据（多选的）
    this.$bus.$on('reset_tree_data', () => {
      this.checked_arr.checked = []
    })

    //删除某个树形结构的数据（多选的）
    this.$bus.$on('delete_tree_data_one', (val) => {
      let _str = val.del_id.split(
        this.res.pe ? 'pe' : this.res.bm ? 'bm' : 'tags'
      )
      this.checked_arr.checked.forEach((el, index) => {
        if (_str[_str.length - 1] == el) {
          this.checked_arr.checked.splice(index, 1)
        }
      })
    })
  },
  props: ['tabs', 'res', 'show_data_flag'],
  methods: {
    //点击
    onSelect(keys, e) {
      let { id, title, slots } = e.node.dataRef
      let type = slots.icon == 'Folder' ? 0 : slots.icon == 'Folders' ? 2 : 1
      if (!this.checked_arr.checked.includes(e.node.dataRef.id)) {
        if (
          (this.res.pe && type == 0) ||
          (this.res.bm && type == 1) ||
          (this.res.tags && type == 2)
        ) {
          this.checked_arr.checked.push(e.node.dataRef.id)
          this.processing(e)
        }
      } else {
        this.$emit(
          'delete_data',
          this.del_prefix[type] +
            this.checked_arr.checked[
              this.checked_arr.checked.indexOf(e.node.dataRef.id)
            ]
        )

        this.checked_arr.checked.splice(
          this.checked_arr.checked.indexOf(e.node.dataRef.id),
          1
        )
      }
    },
    //数据处理
    processing(e) {
      let a = e.node.dataRef
      let { id, title, slots, dep_name } = a


      if (dep_name) {
        dep_name = dep_name.split(';')
      }
      let value =
        slots.icon == 'Folder'
          ? a.userid
          : slots.icon == 'Folders'
          ? 'tag' + a.id
          : a.id
      let type = slots.icon == 'Folder' ? 0 : slots.icon == 'Folders' ? 2 : 1
      let avatar = slots.icon == 'Folder' ? a.avatar : ''

      //唯一的标识
      let del_id = this.del_prefix[type] + a.id

      if (
        (this.res.pe && type == 0) ||
        (this.res.bm && type == 1) ||
        (this.res.tags && type == 2)
      ) {
        this.$emit('treeClick', {
          value,
          id,
          title,
          type,
          avatar,
          dname: dep_name, //选人部门
          del_id,
        })
      }
    },

    //多选
    onCheck(checkedKeys, e) {
      let { id, title, slots } = e.node.dataRef
      let type = slots.icon == 'Folder' ? 0 : slots.icon == 'Folders' ? 2 : 1
      if (e.checked) {
        if (
          (this.res.pe && type == 0) ||
          (this.res.bm && type == 1) ||
          (this.res.tags && type == 2)
        ) {
          this.processing(e)
        } else {
          this.checked_arr.checked.splice(
            this.checked_arr.checked.indexOf(e.node.dataRef.id),
            1
          )
        }
      } else {
        this.$emit('delete_data', this.del_prefix[type] + e.node.dataRef.id)
      }
    },
    onExpand() {},
  },
  watch: {
    show_data_flag() {
      this.checked_arr.checked = []
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
/deep/ .ant-tree-checkbox {
  position: absolute;
  right: 20px;
  top: 14px !important;
}
</style>
