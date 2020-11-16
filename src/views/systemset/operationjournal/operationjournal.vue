<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div class="header flex-col">
        <div>
          <a-input-search
            placeholder="请输入关键字"
            @search="search_btn"
            enter-button
            v-model="Searchterms"
            :maxLength="20"
          />
        </div>
        <span class="open-search" @click="change_search">
          {{SearchTriangle?"高级搜索":"收起搜索"}}
          <i class="triangle" v-if="SearchTriangle"></i>
          <i class="triangle-top" v-else></i>
        </span>
        <SeniorSearch class="SeniorSearch" :obj="obj" @oninSearch="oninSearch" ref="searchDetail" />
      </div>
      <Main class="Main" :search="Searchterms_ok" />
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Main from "./components/main.vue";
import SeniorSearch from "@/views/components/seniorSearch/seniorSearch.vue";
export default {
  components: {
    Main,
    Maintitle,
    Maincontent,
    SeniorSearch
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      },
      //将搜索框的值作为参数传到子组件，子组件通过监听该值的变化来进行发送请求
      Searchterms: "",
      Searchterms_ok: "",
      SearchTriangle: true,
      obj: {
        // 最上层搜索条件
        one: {},
        tree: [],
        // 日期选择
        condition: [
          {
            text: "操作时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          }
        ],
        // 日期选择后结果
        timenum: [{ num: 0, text: "操作时间", time: [] }],
        // 模板type
        num: 1,
        // 等于1时模板分类就隐藏
        dhOnoff: 1
      }
    };
  },
  methods: {
    search_btn() {
      this.chonghzi();
      this.Searchterms_ok = this.Searchterms;
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
    // 子组件需要调用的组件
    oninSearch() {
      this.SearchTriangle = true;
      this.$refs.searchDetail.$el.style.height = "0px";
      this.$bus.$emit("onOperationjournal", this.obj.one);
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = "auto";
      } else {
        this.$refs.searchDetail.$el.style.height = "0px";
        this.$bus.$emit("onOperationjournal", this.obj.one);
      }
      this.SearchTriangle = !this.SearchTriangle;
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
.header {
  padding: 14px 0px;
  border-bottom: 1px solid #e4e7ed;
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
  top: 59px;
}
.open-search {
  width: 200px;
  margin-left: 60px;
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
</style>