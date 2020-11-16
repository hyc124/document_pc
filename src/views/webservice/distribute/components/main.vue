<template>
  <div>
    <div class="distribute-main table-content-at"
         :style="{height:`${height + 66}px`}">
      <a-table :scroll="{ y: height }"
               :columns="columns"
               :customRow="onClicks"
               :data-source="data"
               :row-key="(itme)=>itme.id"
               @change="Change"
               :pagination="false">
        <span slot="status"
              slot-scope="item">
          <div class="flex-col operation"
               :style="{'color':ffstate[item].color}">
            <span class="status-span">·</span>
            {{ffstate[item].text}}
          </div>
        </span>
      </a-table>
    </div>
    <a-modal v-model="visibles"
             cancelText="取消"
             okText="确定"
             title="修改收文类别名称"
             @ok="handleOks">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules">
        <a-form-model-item ref="name"
                           label="类别名称"
                           prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <Pagination @pageChange="pagechangepathget"
                @currentchange="currentchangepathget"
                :paging="paging" />
  </div>
</template>
<script>
import { Calculatedaltitude } from '@/js/public.js'
import { distributeList } from '@/api/distribute.js'
import Pagination from '@/views/components/Pagination.vue'
export default {
  name: 'Main',
  data() {
    return {
      data: null,
      columns: null,
      visible: '',
      visibles: false,
      rules: {
        // 修改发文分类名称内容判断
        name: [
          {
            required: true,
            message: '请输入收文分类名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 15,
            message: '请输入不超过15个字符',
            trigger: ['change', 'blur'],
          },
        ],
      },
      form: {
        //修改紧级名称内容
        name: '',
      },
      // 头部组件里面的状态
      statenum: '',
      // 头部组件里输入框的文字
      kwdtext: '',
      // tabs发文或收文或全部的状态
      postisgetnum: '',
      // 当前分页数
      pagenum: 1,
      count: 0,
      height: 0,
      //表格数据
      table_data: {
        order_field: null,
        sort: null,
      },
      // 文件状态
      ffstate: {
        0: {
          text: '处理中',
          color: '#0082EF',
        },
        1: {
          text: '处理中',
          color: '#0082EF',
        },
        2: {
          text: '已签收',
          color: '#62C232',
        },
        3: {
          text: '被退回',
          color: '#F56C6C',
        },
      },
      // 传送给分页的数据
      paging: {
        // 数据总条数
        total: null,
        // 当前分页数
        current: 1,
        pageSize: 10,
      },
      obj: {
        one: {},
      },
    }
  },
  components: {
    Pagination,
  },
  created() {
    this.columns = [
      // 表单格式
      {
        title: `${
          this.postisgetnum == ''
            ? '公文'
            : this.postisgetnum == 1
            ? '发文'
            : '收文'
        }标题`,
        dataIndex: 'title',
        key: 'title',
        width: 120,
        ellipsis: true,
      },
      {
        title: `${
          this.postisgetnum == ''
            ? '公文'
            : this.postisgetnum == 1
            ? '发文'
            : '收文'
        }字号`,
        dataIndex: 'word_no',
        key: 'word_no',
        width: 150,
        ellipsis: true,
      },
      {
        title: '分发单位',
        dataIndex: 'ffDepts',
        key: 'ffDepts',
        width: 150,
        ellipsis: true,
        customRender: (item) => {
          let text = []
          for (let i = 0; i < item.length; i++) {
            text.push(item[i].dep_name)
          }
          return text.join('、')
        },
      },
      {
        title: '分发人',
        key: 'ff_user',
        dataIndex: 'ff_user',
        width: 90,
        ellipsis: true,
      },
      {
        title: '分发日期',
        key: 'create_time',
        dataIndex: 'create_time',
        width: 150,
        ellipsis: true,
        sorter: (a, b) =>
          new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
      },
      {
        title: '发往单位',
        key: 'jsDepts',
        dataIndex: 'jsDepts',
        ellipsis: true,
        width: 150,
        customRender: (item) => {
          let text = []
          for (let i = 0; i < item.length; i++) {
            text.push(item[i].dep_name)
          }
          return text.join('、')
        },
      },
      {
        title: '分发状态',
        key: 'status',
        dataIndex: 'status',
        width: 120,
        ellipsis: true,
        scopedSlots: { customRender: 'status' },
      },
    ]
  },
  mounted() {
    // 获取列表信息
    this.addList()
    this.$bus.$off('distributeState') //先解绑，不然会多次出发
    // 每次在头部组件里面点击状态按钮就把状态的值传过来赋给statenum
    this.$bus.$on('distributeState', (num) => {
      this.statenum = Number(num)
      this.pagenum = 1
      this.kwdtext = ''
      this.addList()
    })

    // 监听用户在头部组件输入框的输入的文字
    this.$bus.$on('distributeKwd', (text) => {
      this.kwdtext = text
    })
    this.$bus.$off('distributesenior') //先解绑，不然会多次出发
    // 监听用户在头部组件的高级搜索
    this.$bus.$on('distributesenior', (one) => {
      this.obj.one = one
      this.addList()
    })
    // tabs头部条件数据，是发文还是收文，或者是全部
    this.$bus.$on('distributePostIsget', (num) => {
      this.kwdtext = ''
      this.postisgetnum = num
      this.pagenum = 1
      this.addList()
      this.columns = [
        // 表单格式
        {
          title: `${
            this.postisgetnum == ''
              ? '公文'
              : this.postisgetnum == 1
              ? '发文'
              : '收文'
          }标题`,
          dataIndex: 'title',
          key: 'title',
          width: 120,
          ellipsis: true,
        },
        {
          title: `${
            this.postisgetnum == ''
              ? '公文'
              : this.postisgetnum == 1
              ? '发文'
              : '收文'
          }字号`,
          dataIndex: 'word_no',
          key: 'word_no',
          width: 150,
          ellipsis: true,
        },
        {
          title: '分发单位',
          dataIndex: 'ffDepts',
          key: 'ffDepts',
          width: 150,
          ellipsis: true,
          customRender: (item) => {
            let text = []
            for (let i = 0; i < item.length; i++) {
              text.push(item[i].dep_name)
            }
            return text.join('、')
          },
        },
        {
          title: '分发人',
          key: 'ff_user',
          dataIndex: 'ff_user',
          width: 90,
          ellipsis: true,
        },
        {
          title: '分发日期',
          key: 'create_time',
          dataIndex: 'create_time',
          width: 150,
          ellipsis: true,
          sorter: (a, b) =>
            new Date(a.create_time).getTime() -
            new Date(b.create_time).getTime(),
        },
        {
          title: '发往单位',
          key: 'jsDepts',
          dataIndex: 'jsDepts',
          ellipsis: true,
          width: 150,
          customRender: (item) => {
            let text = []
            for (let i = 0; i < item.length; i++) {
              text.push(item[i].dep_name)
            }
            return text.join('、')
          },
        },
        {
          title: '分发状态',
          key: 'status',
          dataIndex: 'status',
          width: 120,
          ellipsis: true,
          scopedSlots: { customRender: 'status' },
        },
      ]
    })
    // 把获取列表事件发送给header头部查询按钮调用
    this.$bus.$on('distributeaddList', this.addList)
    this.height = Calculatedaltitude(80, 80, 80, 43)
  },
  computed: {},
  methods: {
    editclick(el, num) {
      if (num == 1) {
        this.amend()
      } else {
        this.showModal()
      }
    },
    // 表单表格点击跳转事件
    onClicks(record, index) {
      return {
        on: {
          click: () => {
            this.$router.push({
              path: '/distribute/adddistribute',
              query: {
                id: record.id,
                type: 2,
                cut: 2,
              },
            })
          },
        },
      }
    }, //表格变化函数（排序）
    Change(p, f, s) {
      if (s.order) {
        let order = ''
        switch (s.order) {
          case 'ascend':
            order = 'asc'
            break
          case 'descend':
            order = 'desc'
            break
        }
        this.table_data.order_field = s.columnKey
        this.table_data.sort = order
        this.addList()
      }
    },
    // 分页点击事件，获取点击的数字
    pagechangepathget(key) {
      this.pagenum = key
      this.addList()
    },
    // 每页条数发生变化
    currentchangepathget(val) {
      this.paging.current = 1
      this.paging.pageSize = val
      this.addList()
    },
    // 点击删除按钮，打开弹窗
    showModal() {
      this.visible = this.$confirm({
        title: '提示',
        content: '删除后数据不可恢复,是否继续？',
        okText: '确认',
        cancelText: '取消',
        icon: 'info-circle',
        onOk: this.handleOk,
      })
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this
      this.visible.destroy()
      this.visible = this.$warning({
        title: '提示',
        content: '当前已有公文使用该收文类别，不可删除！',
        okText: '确认',
      })
    },
    // 打开修改紧级名称弹窗
    amend() {
      this.visibles = true
    },
    // 点击编辑弹窗的确定按钮
    handleOks(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.visible = false
        this.form.name = ''
      }
    },
    // 根据条件获取列表信息
    addList() {
      let obj = this.obj
      distributeList({
        type: this.postisgetnum, // 1发文，2收文，3签报
        kwd: this.kwdtext, // 搜索关键词
        page: this.paging.current, // 当前页码
        limit: this.paging.pageSize, // 每页条数
        status: this.statenum, // lab为1（1处理中 2已签收 3退回）lab为2（0待查阅 1待签收 2已签收 3退回）
        lab: 1, // 1我分发的 2我接收的 默认我分发的
        order_field: this.table_data.order_field, // 排序字段 按返回的字段名传值
        sort: this.table_data.sort, // 排序方式 asc升序 desc倒序
        advanced: {
          copy_users: obj.one['分发单位']?.intext, // 分发单位
          word_no: obj.one['发文字号']?.intext, // 发文字号
          distributer: obj.one['分发人']?.id, // 分发人
          distribute_time: obj.one['分发时间']?.intext, // 分发时间
          isstime: obj.one['分发时间']?.arry.join(','), // 签发时间
        },
      }).then((data) => {
        this.data = data.data
        this.paging.total = data.count
      })
    },
  },
}
</script>
<style lang="less" scoped>
.distribute-main {
  padding: 12px 0;
  .operation {
    span {
      font-size: 40px;
      line-height: 0px;
      vertical-align: -7px;
    }
  }
}
/deep/.ant-table-row {
  cursor: pointer;
}
.status-span {
  line-height: 20px;
  font-size: 40px;
  transform: translateY(-4px);
  margin-right: 5px;
}
</style>