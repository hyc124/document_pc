<template>
  <div class="pending">
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <a-tabs default-active-key="1"
              @change="onCallback">
        <a-tab-pane key="1">
          <span slot="tab">
            <SvgIcon item="myApproval" />待我审的
          </span>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <SvgIcon item="ApprovalOthers" />待别人审的
          </span>
        </a-tab-pane>
      </a-tabs>
      <div class="head">
        <div class="left">
          <a-input-search placeholder="请输入关键字"
                          v-model="from.name"
                          enter-button
                          style="width: 260px"
                          @search="onSearch"
                          :maxLength="20" />
          <span class="open-search"
                @click="change_search">
            {{SearchTriangle?"高级搜索":"收起搜索"}}
            <i class="triangle"
               v-if="SearchTriangle"></i>
            <i class="triangle-top"
               v-else></i>
          </span>
        </div>
        <div class="right">
          <a-button class="btn"
                    @click="onJump"
                    type="primary">新建</a-button>
          <a-icon type="more" />
          <a-button class="btn"
                    @click="addDocumentExcelout"
                    :disabled="comIds">导出</a-button>
          <a-button v-if="powers('post_print')"
                    class="btn"
                    @click="onBatchPrinting(1)">批量打印</a-button>
        </div>
      </div>
      <SeniorSearch class="SeniorSearch"
                    :obj="obj"
                    @oninSearch="oninSearch"
                    ref="searchDetail" />
      <div class="flex-row-db">
        <div class="table-content-at"
             :style="{height:`${height + 54 + 12 +12}px`}">
          <a-table :columns="columns"
                   :pagination="false"
                   :data-source="data"
                   @change="Change"
                   :customRow="rowClick"
                   :scroll="{ y: height }"
                   :row-selection="checkBoxSelect(ids)">
            <span slot="process_urgent_level"
                  slot-scope="item,record">
              <span id="degree"
                    :class="record.ClassType">{{record.process_urgent_level}}</span>
            </span>
            <span slot="status"
                  slot-scope="item,record">
              <span id="status"
                    :style="[1,2].includes(record.r_status)?'color:#0082EF;':'color:rgb(245, 172, 64);'">
                <span class="status_span">·</span>
                {{record.status}}
              </span>
            </span>
          </a-table>
        </div>
        <Pagination :paging="paging"
                    @pageChange="pagechange"
                    @currentchange="currentchange" />
        <!-- 全部文件夹 -->
        <NewDocument @delNewDoucument="delNewDoucument"
                     :TemplatePopup="TemplatePopup"
                     @getcollectDocument="getcollectDocument" />
        <a-modal class="preview-modal z1000"
                 v-model="ViewDocument.vis2"
                 footer>
          <div id="print"
               ref="print">
            <template v-for="item in view_data">
              <ViewDocument :key="item.id"
                            :ViewDocument="ViewDocument"
                            :datas="item"
                            v-show="ViewDocument.vis2" />
            </template>
          </div>
        </a-modal>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import {
  Calculatedaltitude,
  filldownload,
  checkBoxSelect,
} from '@/js/public.js'
import { documentExcelout, document_information } from '@/api/public.js'
import Maintitle from '@/views/components/maintitle.vue'
import Pagination from '@/views/components/Pagination.vue'
import Maincontent from '@/views/components/maincontent.vue'
import { document_wait_approval_list } from '@/api/library.js'
import SeniorSearch from '@/views/components/seniorSearch/seniorSearch.vue'
import NewDocument from '@/views/components/NewDocument.vue'
import ViewDocument from '@/views/components/viewDocument.vue'
import SvgIcon from '@/views/components/svgicon.vue'
export default {
  components: {
    Maintitle,
    Maincontent,
    Pagination,
    SeniorSearch,
    NewDocument,
    ViewDocument,
    SvgIcon,
  },
  name: 'pending',
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false, // 返回开关
      },
      checkBoxSelect, // 表单多选按钮点击函数挂载
      ids: {
        // 嵌套是因为引用类型，函数里改了数据外面就可以直接使用
        ids: '', // 多选按钮选中文件id
        selectedRowKeys:[]
      },
      //表头标题
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: 60,
        },
        {
          title: '签报标题',
          key: 'jsDepts',
          dataIndex: 'title',
          ellipsis: true,
          width: 110,
        },
        {
          key: 'word_no',
          width: 110,
          title: '签报字号',
          dataIndex: 'word_no',
          ellipsis: true,
        },
        {
          title: '签报单位',
          key: 'fDepts',
          dataIndex: 'fDepts',
          ellipsis: true,
          width: 110,
          customRender: (item) => {
            let text = []
            for (let i = 0; i < item.length; i++) {
              text.push(item[i].dep_name)
            }
            return text.join('、')
          },
        },
        {
          title: '拟稿人',
          dataIndex: 'creater',
          ellipsis: true,
          key: 'creater',
          width: 75,
        },
        {
          title: '拟稿日期',
          dataIndex: 'create_time',
          key: 'create_time',
          ellipsis: true,
          width: 120,
          sorter: (a, b) => a.date - b.date,
        },
        {
          title: '紧急程度',
          dataIndex: 'process_urgent_level',
          key: 'process_urgent_level',
          ellipsis: true,
          scopedSlots: { customRender: 'process_urgent_level' },
          width: 90,
          sorter: (a, b) => a.process_urgent_level - b.process_urgent_level,
        },
        {
          title: '签报状态',
          width: 90,
          dataIndex: 'status',
          ellipsis: true,
          scopedSlots: { customRender: 'status' },
          key: 'status',
        },
        {
          width: 200,
          title: '当前处理人/当前部门',
          dataIndex: 'current',
          key: 'current',
          ellipsis: true,
        },
      ],
      //页数配置
      paging: {
        current: 1,
        total: null,
        pageSize: 10,
      },
      selectedRowKeys: [],
      //数据
      data: [],
      // 查询文本
      from: {
        name: '',
      },
      // 跳转带的参数
      page: 1,
      count: null,
      type: 5,
      //tabel高度
      height: 0,
      // 小三角
      SearchTriangle: true,
      // 模板弹窗数据
      TemplatePopup: { visibles: false, type: 3, title: '签报模板', type2: 3 },
      table_data: {
        order_field: null,
        sort: null,
      },
      spanClass: false, //紧急程度背景颜色效果
      obj: {
        // 最上层搜索条件
        one: {},
        two: [
          {
            title: '拟稿人',
            info: [],
          },
        ],
        tree: [
          {
            title: '签报单位',
            intext: '',
          },
        ],
        // 日期选择
        condition: [
          {
            text: '拟稿时间',
            chlid: [
              { text: '不限' },
              { text: '近一周' },
              { text: '近一月' },
              { text: '近三月' },
            ],
          },
          {
            text: '创建时间',
            chlid: [
              { text: '不限' },
              { text: '近一周' },
              { text: '近一月' },
              { text: '近三月' },
            ],
          },
        ],
        // 日期选择后结果
        timenum: [
          { num: 0, text: '拟稿时间', time: [] },
          { num: 0, text: '创建时间', time: [] },
        ],
        // 模板type
        num: 1,
      },
      dayin: {
        num: 0, // 当前选中元素总长度
        index: 0, //当前循环打印下标
      },
      ViewDocument: {
        // 预览
        vis2: false,
        condition: true, // 是否是打印，如果是的话就要打开分页
      },
      view_data: [], // 打印数据集合
      tabsid: 1, // 待我审核和待别人审核的区别
    }
  },
  created() {
    this.addlist()
  },
  mounted() {
    this.height = Calculatedaltitude(60, 20, 100, 73)
  },
  methods: {
    // tabs切换事件
    onCallback(id) {
       this.ids.selectedRowKeys = []
      this.tabsid = id
      this.paging.pageSize = 10
      this.paging.current = 1
      this.SearchTriangle = true
      this.$refs.searchDetail.$el.style.height = '0px'
      this.from.name = ''
      this.chonghzi()
      this.addlist()
    },
    // 批量打印
    onBatchPrinting(num) {
      let _this = this
      let _arry
      if (num == 1) {
        _this.view_data = []
      }
      if (_this.ids.ids == '') {
        _arry = []
      } else {
        _arry = _this.ids.ids.split(',')
      }
      _this.dayin.num = _arry.length
      if (_this.dayin.num == 0) {
        _this.$message.error(`没有需要导出的数据`)
      } else {
        document_information({ id: _arry[_this.dayin.index] }).then((data) => {
          if (data.data != undefined) {
            _this.view_data.push(data.data)
          }
          _this.ViewDocument.vis2 = true
          if (_this.dayin.index < _this.dayin.num) {
            _this.dayin.index++
            _this.onBatchPrinting()
          } else {
            setTimeout(() => {
              _this.$print(_this.$refs.print)
            })
            _this.dayin.index = 0
          }
        })
      }
    },
    // 关闭模态框
    delNewDoucument() {
      this.TemplatePopup.visibles = false
    },
    // 点击收藏之后刷新页面
    getcollectDocument(data) {
      if (data.data.collection) {
        this.common = data.data.collection.resource
      }
    },
    // 权限判断
    powers(text) {
      return this.jurisdiction.includes(text)
    },
    // 新建签报拟稿
    onJump() {
      this.TemplatePopup.visibles = true
    },
    //表格变化函数（排序）
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
        this.addlist()
      }
    },
    // 子组件需要调用的组件
    oninSearch() {
      this.addlist()
      this.SearchTriangle = true
      this.$refs.searchDetail.$el.style.height = '0px'
    },
    //页数改变
    pagechange(v) {
            this.ids.selectedRowKeys = []
      this.paging.current = v
      this.addlist()
    },
    // 每页条数改变
    currentchange(v) {
      this.paging.pageSize = v
      this.paging.current = 1
      this.addlist()
    },
    //行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.$router.push({
              path: '/home/incoming',
              query: {
                id: record.id,
                file_type: 3,
              },
            })
          },
        },
      }
    },
    //搜索
    onSearch() {
      this.chonghzi()
      this.page = 1
      this.addlist()
    },
    // 查询
    Inquire() {
      this.page = 1
      this.addlist()
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = 'auto'
      } else {
        this.$refs.searchDetail.$el.style.height = '0px'
        this.addlist()
      }
      this.SearchTriangle = !this.SearchTriangle
    },
    // 重置高级搜索数据
    chonghzi() {
      // 清空头部数据表
      this.obj.one = {}
      // 输入框重置
      this.obj.tree.forEach((e) => {
        e.intext = ''
      })
      // 模板文字重置
      this.mbtext = ''
      // 日期重置
      this.obj.timenum.forEach((e) => {
        e.time = []
        e.num = 0
      })
    },
    // 导出数据
    addDocumentExcelout() {
      documentExcelout({
        ids: this.ids.ids,
      }).then((data) => {
        filldownload(data)
      })
    },
    //数据获取
    addlist() {
      let obj = this.obj
      document_wait_approval_list({
        type: 3, // 1发文，2收文，3签报
        lab: this.tabsid, // 1待我审核的 2待别人审核的
        kwd: this.from.name, // 搜索关键词
        page: this.paging.current, // 当前页码
        limit: this.paging.pageSize, //	每页条数
        status: 1, // 1待审 2驳回 3完成 4发布 5草稿 6预发文 10全部
        order_field: this.table_data.order_field, // 排序字段
        sort: this.table_data.sort, // 排序方式 asc升序 desc倒序
        advanced: {
          type_id: obj.one['模板分类']?.id, // 分类id
          copy_users: obj.one['签报单位']?.intext, // 签报、签报单位
          creater: obj.one['拟稿人']?.id, // 拟稿人
          create_time: obj.one['创建时间']?.arry.join(','), // 创建时间
          draft_time: obj.one['拟稿时间']?.arry.join(','), // 拟稿时间
        },
      }).then((data) => {
        data.data.map((item, index) => {
          item.key = (this.paging.current - 1) * 10 + index + 1
          if (item.process_urgent_level == 1) {
            this.spanClass = 1
            item.process_urgent_level = '普通'
            item.ClassType = 'normal'
          } else if (item.process_urgent_level == 2) {
            this.spanClass = 2
            item.process_urgent_level = '紧急'
            item.ClassType = 'urgent'
          } else if (item.process_urgent_level == 3) {
            this.spanClass = 3
            item.process_urgent_level = '加急'
            item.ClassType = 'so-urgent'
          }
        })
        this.data = data.data
        this.paging.total = data.count
      })
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction[3]
    },
    comIds() {
      return this.ids.ids == ''
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 850px !important;
}
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 500px;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
}
.table-content-at {
  overflow-y: scroll;
  .status_span {
    font-size: 40px;
    line-height: 0px;
    vertical-align: -7px;
  }
}
.pending {
  .head {
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid rgba(228, 231, 237, 1);
    .left {
      display: flex;
      align-items: center;
      /deep/ .ant-input-search {
        width: 422px;
        margin-right: 10px;
      }
      /deep/.ant-input-wrapper.ant-input-group .ant-btn-primary {
        color: #dadadb;
        background-color: #fff;
        border-color: #dadadb;
      }
      .open-search {
        margin-left: 10px;
        cursor: pointer;
        color: #0082ef;
        font-size: 12px;
        font-weight: 500;
        position: relative;
        .triangle {
          width: 0;
          height: 0;
          overflow: hidden;
          font-size: 0;
          line-height: 0;
          border-top: 4px solid #b4bccc;
          border-bottom: 4px solid transparent;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          position: absolute;
          top: 8px;
          left: 54px;
        }
        .triangle-top {
          width: 0;
          height: 0;
          overflow: hidden;
          font-size: 0;
          line-height: 0;
          border-bottom: 4px solid #b4bccc;
          border-top: 4px solid transparent;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          position: absolute;
          top: 2px;
          left: 54px;
        }
      }
    }
    .right {
      .btn {
        margin: 0 5px;
      }
    }
  }
  /deep/.ant-table-row {
    cursor: pointer;
  }

  .table-content-at {
    #degree {
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 52px;
      height: 26px;
      border-radius: 2px;
      text-align: center;
      font-size: 12px;
    }
  }
}
/deep/.ant-tabs-nav .ant-tabs-tab-active {
  line-height: 32px;
}
/deep/.ant-tabs {
  height: 56px;
}
/deep/#print {
  width: 750px;
  margin: 0 auto;
}
</style>