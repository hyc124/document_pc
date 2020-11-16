<template>
  <div class="library">
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <!-- 查询新建 -->
      <div class="head">
        <div class="left">
          <a-input-search placeholder="请输入关键字"
                          v-model="from.name"
                          enter-button
                          style="width: 260px"
                          @search="onSearch"
                          :maxLength="20" />
          <span @click="change_search"
                class="open-search">
            {{SearchTriangle?"高级搜索":"收起搜索"}}
            <i class="triangle-top"
               v-if="SearchTriangle"></i>
            <i class="triangle"
               v-else></i>
          </span>
        </div>
        <div class="right">
          <a-button class="btn"
                    @click="onJump"
                    type="primary">新建</a-button>
          <a-icon type="more" />
          <a-button class="btn"
                    @click="addDocumentExcelout" :disabled="comIds">导出</a-button>
          <a-button v-if="powers('post_print')"
                    class="btn"
                    @click="onBatchPrinting(1)">批量打印</a-button>
        </div>
      </div>
      <SeniorSearch class="SeniorSearch"
                    :obj="obj"
                    @oninSearch="oninSearch"
                    ref="searchDetail" />
      <a-tabs type="card"
              v-model="status"
              @change="onChange">
        <a-tab-pane :key="10"
                    tab="全部"></a-tab-pane>
        <a-tab-pane :key="1"
                    tab="待审"></a-tab-pane>
        <a-tab-pane :key="2"
                    tab="驳回"></a-tab-pane>
        <a-tab-pane :key="3"
                    tab="完成"></a-tab-pane>
        <a-tab-pane :key="4"
                    tab="发布"></a-tab-pane>
        <a-tab-pane :key="5"
                    tab="草稿"></a-tab-pane>
      </a-tabs>
      <!-- 列表内容 -->
      <div class="table-content-at"
           :style="{height:`${height + 24 + 54}px`}">
        <a-table :columns="columns"
                 :data-source="data"
                 @change="Change"
                 :customRow="rowClick"
                 :row-selection="checkBoxSelect(ids)"
                 :scroll="{ y: height }"
                 :pagination="false">
          <span slot="operation"
                slot-scope="item,record">
            <span id="operation"
                  class="hand"
                  style="color:#F56C6C;"
                  @click.stop="editclick(record)">删除</span>
          </span>
          <span slot="process_urgent_level"
                slot-scope="item,record">
            <span id="degree"
                  :class="record.ClassType">{{record.process_urgent_level}}</span>
          </span>
          <span slot="status"
                slot-scope="item,record">
            <span id="status"
                  :style="{color:style_color[record.status]}">
              <span class="status_span">·</span>
              {{record.status}}
            </span>
          </span>
        </a-table>
      </div>
      <Pagination :paging="paging"
                  @pageChange="pagechange"
                  @currentchange="currentchange" />
    </Maincontent>
    <!-- 全部文件夹 -->
    <NewDocument @delNewDoucument="delNewDoucument"
                 @getcollectDocument="getcollectDocument"
                 :TemplatePopup="TemplatePopup" />
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
</template>
<script>
import SeniorSearch from '@/views/components/seniorSearch/seniorSearch.vue'
import NewDocument from '@/views/components/NewDocument.vue'
import {
  Calculatedaltitude,
  filldownload,
  checkBoxSelect,
} from '@/js/public.js'
import { documentExcelout, document_information } from '@/api/public.js'
import Pagination from '@/views/components/Pagination.vue'
import Maincontent from '@/views/components/maincontent.vue'
import Maintitle from '@/views/components/maintitle.vue'
import { libraryList, DelDocument } from '@/api/library.js'
import ViewDocument from '@/views/components/viewDocument.vue'
export default {
  name: 'library',
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false, // 返回开关
      },
      style_color: {
        待审: '#0082EF',
        驳回: '#F56C6C',
        完成: '#62C232',
        归档: '#909499',
        暂放: '#F5AC40',
        发布: '#F5AC40',
        草稿: '#F56C6C',
      },
      columns: [],
      columnsone: [
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
          key: 'creater',
          width: 90,
        },
        {
          title: '拟稿日期',
          dataIndex: 'create_time',
          key: 'create_time',
          ellipsis: true,
          width: 110,
          sorter: (a, b) => a.date - b.date,
        },
        {
          title: '紧急程度',
          dataIndex: 'process_urgent_level',
          key: 'process_urgent_level',
          ellipsis: true,
          scopedSlots: { customRender: 'process_urgent_level' },
          width: 110,
          sorter: (a, b) => a.process_urgent_level - b.process_urgent_level,
        },
        {
          title: '签报状态',
          width: 110,
          dataIndex: 'status',
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
      columnstwo: [
        {
          title: '签报标题',
          key: 'jsDepts',
          dataIndex: 'title',
          ellipsis: true,
          width: 100,
        },
        {
          key: 'word_no',
          width: 100,
          title: '签报字号',
          dataIndex: 'word_no',
          ellipsis: true,
        },
        {
          title: '签报单位',
          key: 'fDepts',
          dataIndex: 'fDepts',
          ellipsis: true,
          width: 100,
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
          key: 'creater',
          width: 80,
        },
        {
          title: '创建日期',
          dataIndex: 'create_time',
          key: 'create_time',
          ellipsis: true,
          width: 100,
          sorter: (a, b) => a.date - b.date,
        },
        {
          title: '紧急程度',
          dataIndex: 'process_urgent_level',
          key: 'process_urgent_level',
          ellipsis: true,
          scopedSlots: { customRender: 'process_urgent_level' },
          width: 110,
          sorter: (a, b) => a.process_urgent_level - b.process_urgent_level,
        },
        {
          title: '签报状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          key: 'status',
        },
        {
          width: 180,
          title: '当前处理人/当前部门',
          dataIndex: 'current',
          key: 'current',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          ellipsis: true,
        },
      ],
      // 删除草稿的id
      id: '',
      value: '',
      checkBoxSelect, // 表单多选按钮点击函数挂载
      ids: {
        // 嵌套是因为引用类型，函数里改了数据外面就可以直接使用
        ids: '', // 多选按钮选中文件id
        selectedRowKeys:[]
      },
      selectedRowKeys: [],
      //数据
      data: [],
      height: 0,
      // 状态 默认10
      status: 10,
      from: {
        name: '',
      },
      //分页
      paging: {
        current: 1,
        total: null,
        pageSize: 10,
      },
      //展开/收起搜索
      SearchTriangle: true,
      //搜索分类导航
      search_class_nav: 1,
      table_data: {
        order_field: null,
        sort: null,
      },
      TemplatePopup: { visibles: false, type: 3, title: '签报模板', type2: 3 },
      //query传参
      query: null,
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
          {
            title: '签报字号',
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
            text: '签发时间',
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
          { num: 0, text: '签发时间', time: [] },
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
    }
  },
  created() {
    this.query = this.$route.query
    if (this.query.type) {
      this.status = parseInt(this.query.type)
    }
    this.addlist()
  },
  components: {
    Maintitle,
    Maincontent,
    NewDocument,
    Pagination,
    SeniorSearch,
    ViewDocument,
  },
  mounted() {
    this.height = Calculatedaltitude(60, 30, 20, 62, 55)
  },
  methods: {
    // 删除草稿
    editclick(info) {
      this.id = info.id
      this.showModal()
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
    // 新建签报拟稿
    onJump() {
      this.TemplatePopup.visibles = true
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
    oninSearch() {
      this.addlist()
      this.SearchTriangle = true
      this.$refs.searchDetail.$el.style.height = '0px'
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
    // 点击删除按钮，打开弹窗
    showModal() {
      this.visible = this.$confirm({
        title: '提示',
        content: '删除后数据不可恢复，是否继续？',
        okText: '确认',
        cancelText: '取消',
        icon: 'info-circle',
        onOk: this.handleOk,
      })
    },
    // 判断是否在使用，不然不能删除
    handleOk() {
      let _this = this
      this.delDocument()
    },
    // 删除公文
    delDocument() {
      DelDocument({ id: this.id }).then((res) => {
        this.addlist()
      })
    },
    // 打开全部文件
    openFiles() {
      this.TemplatePopup.visibles = true
    },
    // 关闭模态框
    delNewDoucument() {
      this.TemplatePopup.visibles = false
    },
    // 导出数据
    addDocumentExcelout() {
      documentExcelout({
        ids: this.ids.ids,
      }).then((data) => {
        filldownload(data)
      })
    },
    // 获取列表数据函数
    addlist() {
      let obj = this.obj
      libraryList({
        type: 3, // 1发文，2收文，3签报
        kwd: this.from.name, // 搜索关键词
        page: this.paging.current, // 当前页码
        limit: this.paging.pageSize, // 每页条数
        status: this.status, // 1待审 2驳回 3完成 4发布 5草稿 6预发文 10全部
        order_field: this.table_data.order_field, // 排序字段 按返回的字段名传值
        sort: this.table_data.sort, // 排序方式 asc升序 desc倒序
        advanced: {
          type_id: obj.one['模板分类']?.id, // 分类id
          copy_users: obj.one['签报单位']?.intext, // 签报单位
          word_no: obj.one['签报字号']?.intext, // 签报字号
          creater: obj.one['拟稿人']?.id, // 拟稿人
          create_time: obj.one['创建时间']?.arry.join(','), // 创建时间
          draft_time: obj.one['拟稿时间']?.arry.join(','), // 拟稿时间
          isstime: obj.one['签发时间']?.arry.join(','), // 签发时间
        },
      }).then((data) => {
        if (this.status == 5) {
          this.columns = this.columnstwo
        } else {
          this.columns = this.columnsone
        }
        data.data.map((item, index) => {
          item.key = index
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
        data.data.forEach((el) => {
          let rec_department = ''
          if (el.dDepts.length > 0) {
            el.dDepts.forEach((el2) => {
              rec_department += el2.dep_name + ','
            })
          }
          el.rec_department = rec_department
        })
        this.paging.total = data.count
        this.data = data.data
      })
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
    // 搜索
    onSearch() {
      this.chonghzi()
      this.addlist()
    },

    //行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            let go_path = ''
            switch (record.r_status) {
              case 4:
                if (record.can_edit == 1) {
                  go_path = `/draft/addDraft?d_id=${record.id}&type=3&can_edit=true`
                } else {
                  go_path = `/home/incoming?id=${record.id}&file_type=3`
                }
                break
              case 8:
                go_path = `/draft/addDraft?d_id=${record.id}&type=3`
                break
              default:
                go_path = `/home/incoming?id=${record.id}&file_type=3`
            }
            this.$router.push(go_path)
          },
        },
      }
    },

    // 某一行选中
    onSelect() {},

    // 全选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    onChange(e) {
      this.status = Number(e)
      this.paging.current = 1
      this.addlist()
    },
    // 点击上下切换页面
    pagechange(e) {
            this.ids.selectedRowKeys = []
      this.paging.current = e
      this.addlist()
    },
    // 条数变化
    currentchange(v) {
      this.paging.current = 1
      this.paging.pageSize = v
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
  },
  computed: {
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction[3]
    },
    comIds() {
      return this.ids.ids == "";
    }
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
.maincontent {
  padding: 0 20px 0 !important;
}
.library-paginationbott {
  margin-top: 10px;
}
.ant-btn-primary {
  text-shadow: none;
}
.title-content-right {
  color: rgba(180, 188, 204, 1);
  font-size: 13px;
  cursor: pointer;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  // border-bottom: 1px solid rgba(228, 231, 237, 1);
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
.ant-table-tbody {
  font-size: 14px;
  color: #303233;
}
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
.ant-table-thead {
  .ant-table-column-title {
    color: #909399;
  }
}
.status_span {
  font-size: 40px;
  line-height: 0px;
  vertical-align: -7px;
}
.ant-table-pagination.ant-pagination {
  margin-top: 140px;
  .ant-pagination-item-link {
    width: 30px;
    height: 30px;
    background: rgba(240, 242, 245, 1);
    opacity: 1;
    border-radius: 2px;
  }
  .ant-pagination-item {
    background: rgba(240, 242, 245, 1);
    color: #606266;
  }
}
.ant-pagination-item.active {
  background: #0082ef;
  color: #fff;
}
/deep/.ant-tabs-bar {
  margin: 0;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar {
  .ant-tabs-tab-active {
    position: relative;
    border: 1px solid #e8e8e8 !important;
    border-bottom: 1px solid #fff !important;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }
  .ant-tabs-nav-container {
    height: 30px;
  }
  .ant-tabs-tab {
    position: relative;
    background: none;
    border: 1px solid transparent;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
  }
}
/deep/#print {
  width: 750px;
  margin: 0 auto;
}
</style>