<template>
  <div class="flowlog">
    <Main @get_data="get_main"
          :tabs="tabs"
          class="main" />
  </div>
</template>
<script>
let columnsone = [
  // 表单格式
  {
    title: '操作者',
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: '接收时间',
    key: 'create_time',
    dataIndex: 'create_time',
    sorter: (a, b) => a.create_time.length - b.create_time.length,
  },
  {
    title: '操作状态',
    key: 'c_handle',
    dataIndex: 'c_handle',
  },
  {
    title: '是否修改',
    key: 'c_xiugai',
    dataIndex: 'c_xiugai',
    scopedSlots: { customRender: 'c_xiugai' },
    width: 120,
  },
]

import Main from './main.vue'
import { procedure_journal } from '@/api/incoming.js'
export default {
  name: 'Flowlog',
  data() {
    return {
      tabs: {
        columns: columnsone,
        data: null,
      },
    }
  },
  components: { Main },
  created() {
    this.get_procedure_journal()
  },
  methods: {
    async get_procedure_journal() {
      let { data } = await procedure_journal({
        data_id: this.$route.query.id,
        way: 2,
      })
      data.forEach((el, index) => {
        switch (el.handle) {
          case 1:
            el.c_handle = '未查看'
            break
          case 2:
            el.c_handle = '已查看'
            break
          case 3:
            el.c_handle = '暂放'
            break
          case 4:
            el.c_handle = '已提交'
            break
        }
        el.key = index
        el.xiugai != 0 ? (el.c_xiugai = '是') : (el.c_xiugai = '否')
      })
      this.tabs.data = data
    },
    get_main(page, paixu) {
      this.get_procedure_journal(page, paixu)
    },
  },
}
</script>
<style lang="less" scoped>
.flowlog {
  max-height: 560px;
  overflow-y: scroll;
}
.main {
  padding: 0px;
}
</style>