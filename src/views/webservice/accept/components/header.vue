<template>
  <div class="header">
    <div class="search">
      <a-input-search
        placeholder="请输入关键字"
        style="width: 259px"
        v-model="Searchterms"
        enter-button
        @change="onSearch"
        @search="onPolling"
        :maxLength="20"
      />
      <span class="open-search" @click="change_search">
        {{SearchTriangle?"高级搜索":"收起搜索"}}
        <i class="triangle" v-if="SearchTriangle"></i>
        <i class="triangle-top" v-else></i>
      </span>
    </div>
    <SeniorSearch class="SeniorSearch" :obj="obj" @oninSearch="oninSearch" ref="searchDetail" />
    <div class="header-name-dian" v-if="remindOnOff"></div>
    <a-tabs type="card" v-model="mode" @change="onChange">
      <a-tab-pane :key="10" tab="全部"></a-tab-pane>
      <a-tab-pane :key="0" tab="待查阅"></a-tab-pane>
      <a-tab-pane :key="1" tab="待签收"></a-tab-pane>
      <a-tab-pane :key="2" tab="已签收"></a-tab-pane>
      <a-tab-pane :key="3" tab="已退回"></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import SeniorSearch from "@/views/components/seniorSearch/seniorSearch.vue";
export default {
  name: "Header",
  data() {
    return {
      Searchterms: "", // 搜索词
      visible: false,
      keyword: "", // 新建发文名称输入框关键字
      SearchTriangle: true,
      rules: {
        name: [
          {
            required: true,
            message: "请输入正确的类别名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 15,
            message: "请输入不超过15个字符",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        name: ""
      },
      mode: 10,
      obj: {
        // 最上层搜索条件
        one: {},
        two: [
          {
            title: "签发人",
            info: []
          }
        ],
        tree: [
          {
            title: "来文单位",
            intext: ""
          },
          {
            title: "来文字号",
            intext: ""
          },
          {
            title: "接收单位",
            intext: ""
          }
        ],
        // 日期选择
        condition: [
          {
            text: "接收时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          }
        ],
        // 日期选择后结果
        timenum: [{ num: 0, text: "接收时间", time: [] }],
        // 模板type
        num: 1,
        // 等于1时模板分类就隐藏
        dhOnoff: 1
      }
    };
  },
  mounted() {},
  components: {
    SeniorSearch
  },
  computed: {
    // 公文交换未读提醒状态
    remindOnOff() {
      return this.$store.state.remindOnOff;
    }
  },
  methods: {
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = "auto";
      } else {
        this.$refs.searchDetail.$el.style.height = "0px";
        this.$bus.$emit("acceptButesenior", this.obj.one);
      }
      this.SearchTriangle = !this.SearchTriangle;
    },
    // 重置高级搜索数据
    chonghzi() {
      // 清空头部数据表
      this.obj.one = {};
      // 输入框重置
      this.obj.tree.forEach(e => {
        e.intext = "";
      });
      // 模板文字重置
      this.mbtext = "";
      // 日期重置
      this.obj.timenum.forEach(e => {
        e.time = [];
        e.num = 0;
      });
    },
    onSearch() {
      this.chonghzi();
      this.$bus.$emit("acceptKwd", this.Searchterms);
    },
    // 点击查询调用获取列表函数
    onPolling() {
      this.chonghzi();
      this.$bus.$emit("acceptaddList");
    },
    // 选择不同状态的标签
    onChange(key) {
      if (key == 0) {
        this.$store.commit("REMINDONOFF", false);
      }
      this.$bus.$emit("acceptState", key);
    },
    // 子组件需要调用的组件
    oninSearch() {
      this.$bus.$emit("acceptButesenior", this.obj.one);
      this.SearchTriangle = true;
      this.$refs.searchDetail.$el.style.height = "0px";
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  position: relative;
  .header-name-dian {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 84px;
    left: 123px;
    z-index: 10;
  }
  .search {
    padding: 24px 0;
    .headerbtn {
      margin-left: 20px;
    }
  }
  .radiogroup {
    justify-content: space-between;
    height: 60px;
    .radiobox {
      height: 36px;
      /deep/ .ant-radio-button-wrapper {
        height: 36px;
        line-height: 34px;
      }
      /deep/.ant-radio-button-wrapper-checked {
        background: #e6f1fc;
      }
    }
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
.inleft {
  color: #f33636;
}
.intitle {
  font-size: 14px;
  color: #303133;
  margin-left: 8px;
}
.input {
  width: 332px;
  margin-left: 10px;
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