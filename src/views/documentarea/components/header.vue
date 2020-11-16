<template>
  <div class="header">
    <div>
      <div class="search flex-col">
        <a-input-search
          placeholder="请输入关键字"
          @search="onSearch"
          enter-button
          v-model="Searchterms"
          :maxLength="20"
        />
        <span class="open-search" @click="change_search">
          {{SearchTriangle?"高级搜索":"收起搜索"}}
          <i class="triangle" v-if="SearchTriangle"></i>
          <i class="triangle-top" v-else></i>
        </span>
      </div>
      <SeniorSearch class="SeniorSearch" :obj="objs" @oninSearch="oninSearch" ref="searchDetail" />
    </div>
    <div class="right flex-col">
      <a-button @click="transfer(1)" type="primary">新建</a-button>
      <div class="Dottedline"></div>
      <a-button class="btn" @click="transfer(2)" :disabled="comIds">导出</a-button>
      <a-button v-if="powers('post_print')" @click="onBatchPrinting" class="btn">批量打印</a-button>
    </div>
  </div>
</template>
<script>
import SeniorSearch from "@/views/components/seniorSearch/seniorSearch.vue";
export default {
  name: "Header",
  props: ["objs", "tabs"],
  data() {
    return {
      Searchterms: "", // 搜索词
      //搜索防抖节流
      Searchterms2: "",
      SearchTriangle: true
    };
  },
  computed: {
    // 获取权限
    jurisdiction() {
      return this.$store.state.jurisdiction[1];
    },
    comIds() {
      return this.tabs.ids == "";
    }
  },
  created() {
    // 刷新
    this.$bus.$on("DocumentareaTabs", () => {
      this.onTbas();
    });
  },
  components: {
    SeniorSearch
  },
  methods: {
    // 批量打印
    onBatchPrinting() {
      this.$emit("BatchPrinting", 1);
    },
    // 权限判断
    powers(text) {
      return this.jurisdiction.includes(text);
    },
    // 新建按钮
    transfer(v) {
      this.$emit("onXj", v);
    },
    //搜索
    onSearch() {
      if (this.Searchterms2 == this.Searchterms) {
        return;
      }
      this.chonghzi();
      this.Searchterms2 = this.Searchterms;
      this.$emit("documentarea_header_search", this.Searchterms);
    },
    onTbas() {
      this.$refs.searchDetail.$el.style.height = "0px";
      this.SearchTriangle = true;
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = "auto";
      } else {
        this.$refs.searchDetail.$el.style.height = "0px";
        this.$emit("onChange", this.objs.one);
      }
      this.SearchTriangle = !this.SearchTriangle;
    },
    // 重置高级搜索数据
    chonghzi() {
      // 清空头部数据表
      this.objs.one = {};
      // 输入框重置
      this.objs.tree.forEach(e => {
        e.intext = "";
      });
      // 模板文字重置
      this.mbtext = "";
      // 日期重置
      this.objs.timenum.forEach(e => {
        e.time = [];
        e.num = 0;
      });
    },
    // 子组件需要调用的组件
    oninSearch() {
      this.$emit("onChanges", this.objs.one);
      this.SearchTriangle = true;
      this.$refs.searchDetail.$el.style.height = "0px";
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ant-input-wrapper {
  display: flex;
  width: 240px;
  .ant-btn {
    border: 1px solid rgba(218, 218, 219, 1);
    background: white;
    color: #dadadb;
    box-shadow: none;
  }
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
  top: 112px;
}
.header {
  padding: 20px 0 15px 0;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    .btn {
      margin: 0 5px;
    }
  }
}
.open-search {
  width: 200px;
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
.Dottedline {
  height: 20px;
  border-right: 1px dashed #ababab;
  margin: 0px 14px 0px 16px;
}
</style>