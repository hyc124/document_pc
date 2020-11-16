<template>
  <div class="header">
    <div class="search">
      <a-input-search placeholder="请输入关键字"
                      style="width: 259px"
                      v-model="Searchterms"
                      enter-button
                      @change="onSearch"
                      @search="onPolling"
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
    <SeniorSearch class="SeniorSearch"
                  :obj="obj"
                  @oninSearch="oninSearch"
                  ref="searchDetail" />
    <a-tabs type="card"
            v-model="mode"
            @change="onChange">
      <a-tab-pane :key="10"
                  tab="全部"></a-tab-pane>
      <a-tab-pane :key="2"
                  tab="已签收"></a-tab-pane>
      <a-tab-pane :key="3"
                  tab="被退回"></a-tab-pane>
      <a-tab-pane :key="1"
                  tab="处理中"></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import SeniorSearch from '@/views/components/seniorSearch/seniorSearch.vue'
import { libraryList } from '@/api/library.js'
export default {
  name: 'Header',
  data() {
    return {
      Searchterms: '', // 搜索词
      visible: false,
      keyword: '', // 新建发文名称输入框关键字
      rules: {
        name: [
          {
            required: true,
            message: '请输入正确的类别名称',
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
        name: '',
      },
      mode: 10,
      SearchTriangle: true,
      obj: {
        // 最上层搜索条件
        one: {},
        two: [
          {
            title: '分发人',
            info: [],
          },
        ],
        tree: [
          {
            title: '分发单位',
            intext: '',
          },
          {
            title: '发文字号',
            intext: '',
          },
        ],
        // 日期选择
        condition: [
          {
            text: '分发时间',
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
        ],
        // 日期选择后结果
        timenum: [
          { num: 0, text: '分发时间', time: [] },
          { num: 0, text: '签发时间', time: [] },
        ],
        // 模板type
        num: '1,2',
      },
    }
  },
  components: {
    SeniorSearch,
  },
  mounted() {
    this.$bus.$off('distributePostIsget') //先解绑，不然会多次出发
    // tabs头部条件数据，是发文还是收文，或者是全部
    this.$bus.$on('distributePostIsget', (num) => {
      if (num == 1) {
        this.obj.num = 1
        this.obj.tree[1].title = '发文字号'
      } else if (num == 2) {
        this.obj.num = 2
        this.obj.tree[1].title = '收文字号'
      } else {
        this.obj.num = '1,2'
        this.obj.tree[1].title = '公文字号'
      }
      this.onTabs()
    })
  },
  methods: {
    // 切换tab时关闭高级选项
    onTabs() {
      this.SearchTriangle = true
      this.$refs.searchDetail.$el.style.height = '0px'
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = 'auto'
      } else {
        this.$refs.searchDetail.$el.style.height = '0px'
        this.$bus.$emit('distributesenior', this.obj.one)
      }
      this.SearchTriangle = !this.SearchTriangle
    },
    onSearch() {
      this.chonghzi()
      this.$bus.$emit('distributeKwd', this.Searchterms)
    },
    // 点击状态，全部，退回，处理中，签收
    onChange(e) {
      this.$bus.$emit('distributeState', e)
    },
    // 点击查询调用获取列表函数
    onPolling() {
      this.chonghzi()
      this.$bus.$emit('distributeaddList')
      this.Searchterms = ''
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
    // 子组件需要调用的组件
    oninSearch() {
      this.$bus.$emit('distributesenior', this.obj.one)
      this.SearchTriangle = true
      this.$refs.searchDetail.$el.style.height = '0px'
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  .search {
    margin: 23px 0px 24px;
  }
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
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
/deep/.ant-tabs-bar {
  margin: 0;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar {
  .ant-tabs-tab-active {
    border: 1px solid #e8e8e8 !important;
    border-bottom: 1px solid #fff !important;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }
  .ant-tabs-nav-container {
    height: 30px;
  }
  .ant-tabs-tab {
    background: none;
    border: 1px solid transparent;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
  }
}
// 改页面新加的css
/deep/ .ant-input-group-addon > .ant-btn-primary {
  background: #ffffff;
  color: #c0c4cc;
  padding: 0 14px;
  border: 1px solid #dadadb;
}
</style>