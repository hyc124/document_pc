<template>
  <div class="list-box">
    <div class="list-box-cl list-box-left">
      <div>
        <a-input-search placeholder="请输入姓名部门名称"
                        @change="has"
                        v-model="kwd"
                        enter-button
                        @search="onSearch" />
      </div>
      <div>
        <a-tabs :default-active-key="default_key"
                @change="callback">
          <a-tab-pane :key="1"
                      v-if="tag.tab"
                      tab="组织架构">
            <Tree :tabs="treeVisual"
                  :res="tag"
                  @treeClick="treeClick" />
          </a-tab-pane>
          <a-tab-pane :key="2"
                      v-if="tag.tab2"
                      tab="发文收文单位">
            <Tree :tabs="treeVisualS"
                  :res="tag"
                  @treeClick="treeClick" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="list-box-cl list-box-right">
      <div class="list-box-right-top">已选中({{range.visual.length}})</div>
      <div class="list-box-right-bottom">
        <template v-for="item in range.visual">
          <div class="list-box-right-bottom-cl"
               :key="item.value">
            <div>
              <a-icon :type="item.type==0?'user':item.type==1?'folder':item.type==5?'usergroup-delete':'tag'"
                      style="margin-right:5px" />
              <span>{{item.title}}</span>
            </div>
            <span style="cursor: pointer;"
                  @click="delvisualcl(item.value)">
              <a-icon type="close" />
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { Getorganizationaldata } from '@/api/postflowpathset.js'
import { OrganiZationalList } from '@/api/public.js'
import Tree from '@/views/sendout/draft/addcompoents/components/organization/tree.vue'
import { get_role_list } from '@/api/roleset.js'
import { document_recently_circulated } from '@/api/incoming.js'
import { list_company } from '@/api/draft.js'
export default {
  name: 'Framelist',
  data() {
    return {
      kwd: '',
      treeClickid: '', // 点击文件夹的id
      treeVisual: null,
      treetagsid: '', // 点击文件夹的id
      treeVisualS: {
        tree: { children: [] },
      },
      treeRole: { tree: { children: [] } },
      treeChoices: { tree: { children: [] } },
      kwdtype: this.restype,

      //默认tab选项
      default_key: 1,

      //删除数据
      ids: [],
    }
  },
  props: [
    'range',
    'tag',
    'restype',
    'show_data_list',
    'show_data_flag',
    'open_type',
  ],
  components: {
    Tree,
  },
  mounted() {},
  created() {
    this.get_tab_datas()
  },
  methods: {
    //数据获取
    get_tab_datas() {
      if (this.tag.tab) {
        // 组织架构的数据list
        this.default_key = 1
        this.addList()
      }
      if (this.tag.tab2) {
        this.default_key = 2
        this.get_list_company()
      }
    },

    // 弹窗 搜索
    onSearch() {
      if (!isNaN(this.open_type)) {
        if (this.kwd.trim().length > 0) {
          if (this.open_type == 2) {
            this.get_list_company()
          } else {
            Getorganizationaldata({ type: this.kwdtype, kwd: this.kwd }).then(
              (res) => {
                if (this.kwdtype == 3) {
                  this.treeVisualS.tree.children = res.data
                } else {
                  this.treeVisual.tree.children = res.data
                }
              }
            )
          }
        }
      }
    },
    // tab切换
    callback(key) {
      this.kwd = ''
      this.addList()
      key == 2 ? (this.kwdtype = 3) : (this.kwdtype = this.restype)
      this.get_list_company()
    },
    // 获取组织架构列表信息
    addList() {
      OrganiZationalList({
        dept_id: this.treeClickid,
        type: this.tag.pe ? 3 : 1,
        keyword: this.kwd,
      }).then((data) => {
        this.treeVisual = data.data
      })
    },

    //获取发文收文单位的信息
    async get_list_company() {
      let { data } = await list_company({
        keyword: this.kwd,
        limit: 100000, //接口问题,获取全部数据
      })
      if (data.data) {
        data.data.forEach((el) => {
          el.slots = { icon: 'FolderFilled' }
          el.key = el.id
        })
      }

      this.treeVisualS.tree.children = data.data
    },
    // 选择人员
    treeClick(e) {
      // 用键做判断 有无这一条数据
      if (!this.range.visual.some((v) => v.value == e.value)) {
        this.range.visual.push(e)
      }
    },
    // 删除
    delvisualcl(e) {
      for (let i in this.range.visual) {
        if (this.range.visual[i].value == e) {
          this.ids.push(e)
          this.ids = [...this.ids]
          this.$emit('get_delete_ids', this.ids)
          this.range.visual.splice(i, 1)
          return true
        }
      }
    },
    //------------ 可见范围  ------------

    //当输入框内容为空的时候重置搜索
    has() {
      if (this.kwd.trim().length <= 0) {
        this.addList()
      }
    },
  },
  watch: {
    //用于监听数据更新（加载组织架构还是发文收文单位的数据）
    tag: {
      handler(val) {
        this.kwd = ''
        this.get_tab_datas()
      },
      deep: true,
    },
    show_data_flag() {
      this.range.visual = []
      this.ids = []
      this.show_data_list.forEach((el) => {
        this.range.visual.push({
          value: el.id,
          title: el.name,
          receiver_name: el.receiver_name,
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.list-box {
  height: 350px;
  // border: 1px solid #ebeef5;
  display: flex;
  .list-box-cl {
    width: 50%;
    height: 100%;
    padding: 0 2px;
    .list-box-cl-cell {
      height: 40px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      .transfer-icon {
        font-size: 24px;
        margin: 0 10px;
      }
      .transferlist-icon {
        color: #e6b821;
      }
      .transferlistcl-icon {
        color: #6fb9f6;
      }
    }
    .list-box-cl-cell-activ {
      background-color: #f2f7ff;
    }
  }
  .list-box-right {
    padding: 0 15px;
    border-left: 1px solid #ebeef5;
    .list-box-right-top {
      padding-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
    }
    .list-box-right-bottom {
      padding: 5px 0;
      height: calc(350px - 42px);
      overflow: auto;
      .list-box-right-bottom-cl {
        line-height: 40px;
        height: 40px;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
      }
      .list-box-right-bottom-cl:hover {
        background-color: #e6f7ff;
      }
    }
  }
  .list-box-left {
    /deep/ .ant-tabs-bar {
      margin: 0;
    }
    /deep/ .ant-tabs .ant-tabs-top-content .ant-tabs-tabpane {
      height: calc(350px - 32px - 45px);
      overflow: auto;
    }
  }
}
</style>
