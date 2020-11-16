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
        <div class="list-box-tab">
          <a-tabs default-active-key="1"
                  @change="callback">
            <a-tab-pane key="1"
                        v-if="tag.tab"
                        tab="组织架构">
              <Tree :show_data_flag="show_data_flag"
                    :tabs="treeVisual"
                    :res="tag"
                    @treeClick="treeClick"
                    @delete_data="delete_data" />
            </a-tab-pane>
            <a-tab-pane key="2"
                        v-if="tag.tags"
                        tab="标签">
              <Tree :show_data_flag="show_data_flag"
                    :tabs="treeVisualS"
                    :res="tag"
                    @treeClick="treeClick"
                    @delete_data="delete_data" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="list-box-cl list-box-right">
        <div class="list-box-right-top">
          <span>已选择的角色({{range.visual.length}})</span>
          <span v-show="range.visual.length"
                class="list-box-right-top-close hand"
                @click="listCloseFun">全部删除</span>
        </div>
        <div class="list-box-right-bottom">
          <template v-for="item in range.visual">
            <div class="list-box-right-bottom-cl"
                 :key="item.value">
              <div class="flex-center">
                <a-icon :type="item.type==0?'user':item.type==1?'folder':'tag'"
                        style="margin-right:5px" />
                <span class="name"
                      :title="item.title">{{item.title}}</span>
              </div>
              <span style="cursor: pointer;"
                    @click="delvisualcl(item)">
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
import Tree from '@/views/sendout/draft/addcompoents/components/setting/tree.vue'
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
      kwdtype: this.restype,
    }
  },
  props: ['range', 'tag', 'restype', 'show_data_flag'],
  components: {
    Tree,
  },
  mounted() {},
  created() {
    // 组织架构的数据list
    this.addList()
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
    // 选择人员
    treeClick(e) {
      // 用键做判断 有无这一条数据
      if (!this.range.visual.some((v) => v.value == e.value)) {
        this.range.visual.push(e)
      }
    },
    // 删除
    delvisualcl(item) {
      //删除某个树形结构的数据（多选的）
      this.$bus.$emit('delete_tree_data_one', item)
      for (let i in this.range.visual) {
        if (this.range.visual[i].value == item.value) {
          this.range.visual.splice(i, 1)
        }
      }
    },
    //从树形结构传过来的删除数据（多选）
    delete_data(val) {
      this.range.visual.forEach((el, index) => {
        if (el.del_id == val) {
          this.range.visual.splice(index, 1)
        }
      })
    },
    // 全部删除
    listCloseFun() {
      this.range.visual = []
      //清空树形结构的数据（多选的）
      this.$bus.$emit('reset_tree_data')
    },
    //------------ 可见范围  ------------
  },
}
</script>

<style lang="less" scoped>
.list-div {
  .list-box-top {
    margin: 15px 0;
    text-align: center;
  }
  .list-box {
    height: 400px;
    border-top: 1px solid #ebeef5;
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
      padding: 0 20px;
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
        padding: 5px 0;
        height: calc(400px - 42px);
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
      position: relative;
      .list-search {
        width: 100%;
        padding: 12px 20px;
        position: absolute;
        top: 40px;
        left: 0;
        z-index: 10;
      }
      /deep/ .ant-tabs-bar {
        margin: 0;
        height: 40px;
        .ant-tabs-tab {
          padding: 10px 12px;
          margin: 0 15px 0 0;
        }
      }
      /deep/ .ant-tabs .ant-tabs-top-content .ant-tabs-tabpane {
        height: calc(400px - 56px - 40px);
        overflow: auto;
        margin-top: 54px;
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
