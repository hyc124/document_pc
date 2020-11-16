<template>
  <div v-if="tabs!= undefined">
    <a-tree :tree-data="tabs.tree.children"
            @select="onSelect"
            @expand="onExpand"
            :selectedKeys="val">
      <a-icon slot="FolderFilled2"
              type="folder" />
      <a-icon slot="FolderFilled"
              type="folder" />
      <a-icon slot="Folder"
              type="user" />
      <a-icon slot="Folders"
              type="tag" />
      <a-icon slot="user"
              type="usergroup-delete" />
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
    return {
      checked_arr: {
        checked: [],
      },
      val: [],
      del_prefix: {
        1: 'bm',
        2: 'pe',
        3: 'company',
        4: 'label',
        5: 'role',
        6: 'lately',
      },
    }
  },
  mounted() {},
  props: [
    'tabs',
    'res',
    'prefix',
    'show_data_flag',
    'show_data_list',
    'transformation',
  ],
  methods: {
    //点击
    onSelect(keys, e) {
      this.processing(e)
    },
    onExpand() {},
    //数据处理
    async processing(e) {
      let a = e.node.dataRef
      let { id, title } = a
      let type = null
      if (e.node.dataRef.type) {
        type = e.node.dataRef.type
      } else {
        switch (e.node.dataRef.slots.icon) {
          case 'Folder':
            type = 2
            break
          case 'FolderFilled':
            type = 1
            break
        }
      }

      // 当选接收人选部门的时候（会将部门里面的人提出来）
      if (type == 1 && this.res.pe && this.res.bm && !this.transformation) {
        OrganiZationalList({
          dept_id: id,
          type: 3,
        }).then((data) => {
          let _arr = []
          data.data.members.forEach((el) => {
            _arr.push({
              value: el.userid,
              title: el.name,
              type: 2,
              avatar: el.avatar,
              del_id: this.del_prefix[2] + el.id,
            })
          })
          this.$emit('treeClick', _arr)
        })
        return
      }
      // 选标签请求下面的人
      if (type == 4 && !this.transformation) {
        let data = await addLabelList({ tagid: id, kwd: this.kwd })
        let _arr = []
        data.data.user.forEach((el) => {
          _arr.push({
            value: el.userid,
            title: el.name,
            type: 2,
            avatar: el.avatar,
            del_id: this.del_prefix[2] + el.id,
          })
        })
        this.$emit('treeClick', _arr)
        return
      }

      // 选角色请求下面的人
      if (type == 5 && !this.transformation) {
        let _arr = []
        a.all_users.forEach((el) => {
          _arr.push({
            value: el.userid,
            title: el.name,
            type: 2,
            avatar: el.avatar,
            del_id: this.del_prefix[2] + el.id || el.userid,
          })
        })
        this.$emit('treeClick', _arr)
        return
      }

      let value = type == 2 || type == 6 ? a.userid : a.id
      if (type == 1) {
        title = this.prefix + '-' + title
      }

      //唯一的标识（防止id重复）
      let del_id = this.del_prefix[type] + a.id

      let avatar = type == 2 || type == 6 ? a.avatar : ''
      let receiver_name = null
      if (a.receiver_name) {
        receiver_name = a.receiver_name
      }
      if (
        (this.res.pe && type == 2) ||
        (this.res.bm && type == 1) ||
        (this.res.label && type == 4) ||
        (this.res.role && type == 5) ||
        (this.res.company && type == 3) ||
        (this.res.lately && type == 6)
      ) {
        let _data = {}
        switch (type) {
          case 4:
            _data = {
              value,
              title,
              type,
              avatar,
              receiver_name,
              del_id,
              userids: a.userids,
            }
            break
          case 5:
            _data = {
              value,
              title,
              type,
              avatar,
              receiver_name,
              del_id,
              all_users: a.all_users,
            }
            break
          case 6:
            _data = {
              value,
              title,
              type,
              avatar,
              receiver_name,
              del_id,
            }
            break
          default:
            _data = {
              value,
              title,
              type,
              avatar,
              receiver_name,
              del_id,
            }
            break
        }

        this.$emit('treeClick', _data)
      }
    },
  },


}
</script>

<style lang="less" scoped>
/deep/ .ant-tree li {
  position: relative;
}
/deep/ .ant-tree li .ant-tree-node-content-wrapper {
  display: flex;
  align-items: center;
  width: calc(100%);
  height: 40px;
  line-height: 40px;
  border-radius: 0px;
  padding: 0 20px;
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
