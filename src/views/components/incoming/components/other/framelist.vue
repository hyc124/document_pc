<template>
  <div class="list-div">
    <!-- <div class="list-box-top">
      <a-radio-group default-value="a"
                     button-style="solid">
        <a-radio-button value="a">当前组织</a-radio-button>
        <a-radio-button value="b"
                        disabled>互联企业</a-radio-button>
      </a-radio-group>
    </div> -->
    <div class="list-box">
      <div class="list-box-cl list-box-left">
        <div class="list-search">
          <a-input-search placeholder="请输入姓名部门名称"
                          v-model="kwd"
                          @search="onSearch" />
        </div>
        <div>
          <a-tabs default-active-key="1"
                  @change="callback">
            <a-tab-pane key="1"
                        v-if="tag.tab"
                        tab="组织架构">
              <Tree :tabs="treeVisual"
                    :res="tag"
                    @treeClick="treeClick" />
            </a-tab-pane>
            <a-tab-pane key="2"
                        v-if="tag.tags"
                        tab="标签">
              <Tree :tabs="treeVisualS"
                    :res="tag"
                    @treeClick="treeClick" />
            </a-tab-pane>
            <a-tab-pane key="3"
                        v-if="tag.xtjs"
                        tab="系统角色">
              <Tree :tabs="treeRole"
                    :res="tag"
                    @treeClick="treeClick" />
            </a-tab-pane>
            <a-tab-pane key="4"
                        v-if="tag.zjsy"
                        tab="最近选择">
              <Tree :tabs="treeChoices"
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
  </div>

</template>
<script>
import { Getorganizationaldata } from '@/api/postflowpathset.js'
import { OrganiZationalList, addLabelList } from '@/api/public.js'
import Tree from '@/views/components/incoming/components/other/tree.vue'
import { get_role_list } from '@/api/roleset.js'
import { document_recently_circulated } from '@/api/incoming.js'
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
    }
  },
  props: ['range', 'tag', 'restype'],
  components: {
    Tree,
  },
  mounted() {
  },
  created() {
    // 组织架构的数据list
    this.addList()
    this.get_role_list_m()
    this.get_document_recently_circulated()
  },
  methods: {
    // 弹窗 搜索
    onSearch() {
      if (this.kwd.trim() == '') {
        this.addList()
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
    },
    // tab切换
    callback(key) {
      this.kwd = ''
      this.addList()
      key == 2 ? (this.kwdtype = 3) : (this.kwdtype = this.restype)
    },
    // 获取组织架构列表信息
    addList() {
      OrganiZationalList({
        dept_id: this.treeClickid,
        type: this.tag.pe ? 3 : 1,
      }).then((data) => {
        this.treeVisual = data.data
      })
      addLabelList({ tagid: this.treetagsid }).then((data) => {
        this.treeVisualS.tree.children = data.data.tags
      })
    },
    //获取角色列表
    async get_role_list_m() {
      let { data } = await get_role_list()

      data.datas.forEach((el) => {
        el.title = el.role_name
        el.key = el.id
        el.slots = { icon: 'user' }
      })
      this.treeRole.tree.children = data.datas
    },
    //获取最近选择
    async get_document_recently_circulated() {
      let { data } = await document_recently_circulated({})
      data.forEach((el) => {
        el.title = el.name
        el.key = el.id
        el.slots = { icon: 'user' }
      })
      this.treeChoices.tree.children = data
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
          this.range.visual.splice(i, 1)
          return true
        }
      }
    },
    //------------ 可见范围  ------------
  },
}
</script>

<style lang="less" scoped>
.list-div {
  border-top: 1px solid rgba(238, 238, 238, 1);
  .list-box-top {
    margin: 15px 0;
    text-align: center;
  }
  .list-box {
    height: 466px;
    display: flex;
    .list-box-cl {
      height: 100%;
      padding: 0 2px;
      box-sizing: border-box;
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
      width: 330px;
      padding: 0 0 0 20px;
      border-left: 1px solid #ebeef5;
      .list-box-right-top {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .list-box-right-top-close {
          color: #0082ef;
        }
      }
      .list-box-right-bottom {
        padding: 10px 0;
        height: 430px;
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
      width: 370px !important;
      position: relative;
      .list-search {
        width: 330px;
        padding: 12px 20px;
        position: absolute;
        top: 40px;
        left: 0;
        z-index: 10;
        box-sizing: border-box;
      }
      /deep/ .ant-tabs-bar {
        margin: 0;
        height: 40px;
        .ant-tabs-tab {
          padding: 10px 6px;
          margin: 0 15px 0 0;
        }
      }
      /deep/ .ant-tabs .ant-tabs-top-content .ant-tabs-tabpane {
        height: 390px;
        overflow: auto;
        margin-top: 50px;
      }
    }
  }
}
.flex-center {
  display: flex;
  align-items: center;
}
.name {
  width: 210px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
