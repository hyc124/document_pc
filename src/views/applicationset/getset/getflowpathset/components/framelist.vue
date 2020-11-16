<template>
  <div class="list-box">
    <div class="list-box-cl list-box-left">
      <div>
        <a-input-search
          placeholder="请输入姓名部门名称"
          v-model="kwd"
          enter-button
          @search="onSearch"
        />
      </div>
      <div>
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" v-if="tag.tab" tab="组织架构">
            <Tree :tabs="treeVisual" :res="tag" @treeClick="treeClick" />
          </a-tab-pane>
          <a-tab-pane key="2" v-if="tag.tags" tab="标签">
            <Tree :tabs="treeVisualS" :res="tag" @treeClick="treeClick" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="list-box-cl list-box-right">
      <div class="list-box-right-top">已选中({{range.visual.length}})</div>
      <div class="list-box-right-bottom">
        <template v-for="item in range.visual">
          <div class="list-box-right-bottom-cl" :key="item.value">
            <div>
              <a-icon
                :type="item.type==0?'user':item.type==1?'folder':'tag'"
                style="margin-right:5px"
              />
              <span>{{item.title}}</span>
            </div>
            <span style="cursor: pointer;" @click="delvisualcl(item.value)">
              <a-icon type="close" />
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { Getorganizationaldata } from "@/api/postflowpathset.js";
import { OrganiZationalList, addLabelList } from "@/api/public.js";
import Tree from "@/views/applicationset/getset/getflowpathset/components/tree.vue";
export default {
  name: "Framelist",
  data() {
    return {
      kwd: "",
      treeClickid: "", // 点击文件夹的id
      treeVisual: null,
      treetagsid: "", // 点击文件夹的id
      treeVisualS: {
        tree: { children: [] }
      },
      kwdtype: this.restype
    };
  },
  props: ["range", "tag", "restype"],
  components: {
    Tree
  },
  mounted() {

  },
  created() {
    // 组织架构的数据list
    this.addList();
  },
  methods: {
    // 弹窗 搜索
    onSearch() {
      if (this.kwd.trim() == "") {
        this.addList();
      } else {
        Getorganizationaldata({ type: this.kwdtype, kwd: this.kwd }).then(
          res => {
            if (this.kwdtype == 3) {
              this.treeVisualS.tree.children = res.data;
            } else {
              this.treeVisual.tree.children = res.data;
            }
          }
        );
      }
    },
    // tab切换
    callback(key) {
      this.kwd = "";
      this.addList();
      key == 2 ? (this.kwdtype = 3) : (this.kwdtype = this.restype);
    },
    // 获取组织架构列表信息
    addList() {
      OrganiZationalList({
        dept_id: this.treeClickid,
        type: this.tag.pe ? 3 : 1
      }).then(data => {
        this.treeVisual = data.data;
      });
      addLabelList({ tagid: this.treetagsid }).then(data => {
        this.treeVisualS.tree.children = data.data.tags;
      });
    },
    // 选择人员
    treeClick(e) {
      // 用键做判断 有无这一条数据
      if (!this.range.visual.some(v => v.value == e.value)) {
        this.range.visual.push(e);
      }
    },
    // 删除
    delvisualcl(e) {
      for (let i in this.range.visual) {
        if (this.range.visual[i].value == e) {
          this.range.visual.splice(i, 1);
          return true;
        }
      }
    }
    //------------ 可见范围  ------------
  }
};
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
