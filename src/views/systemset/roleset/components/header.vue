<template>
  <div class="header flex-col">
    <div class="flex-col" style="width:100%;">
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
    <SeniorSearch class="SeniorSearch" :obj="obj" @oninSearch="oninSearch" ref="searchDetail" />
    <div>
      <a-button type="primary" @click="showModal">新增</a-button>
    </div>
    <a-modal
      v-model="visible"
      cancelText="取消"
      okText="确定"
      title="新增角色"
      @cancel="form.name=''"
      @ok="handleOk"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item ref="name" label="角色名称" prop="name">
          <a-input placeholder="请输入名称，最长30字符" v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import SeniorSearch from "@/views/components/seniorSearch/seniorSearch.vue";
import { add_role } from "@/api/roleset.js";
export default {
  name: "Header",
  data() {
    return {
      Searchterms: "", // 搜索词
      visible: false,
      // disabled_search: true,
      SearchTriangle: true,
      // 新建用户
      new_user: "",
      rules: {
        name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "请输入不超过30个字符",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        name: ""
      },
      obj: {
        // 最上层搜索条件
        one: {},
        tree: [],
        // 日期选择
        condition: [
          {
            text: "创建时间",
            chlid: [
              { text: "不限" },
              { text: "近一周" },
              { text: "近一月" },
              { text: "近三月" }
            ]
          }
        ],
        // 日期选择后结果
        timenum: [{ num: 0, text: "创建时间", time: [] }],
        // 模板type
        num: 1,
        // 等于1时模板分类就隐藏
        dhOnoff: 1
      }
    };
  },
  components: {
    SeniorSearch
  },
  created() {},
  methods: {
    onSearch() {
           this.chonghzi()
      // this.disabled_search = false;
      this.$emit("update_user", this.Searchterms);
      // setTimeout(() => {
      //   this.disabled_search = true;
      // }, 3000);
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = "auto";
      } else {
        this.$refs.searchDetail.$el.style.height = "0px";
        this.$emit("onChange",this.obj.one);
      }
      this.SearchTriangle = !this.SearchTriangle;
    },
    showModal() {
      this.visible = true;
    },
    // 子组件需要调用的组件
    oninSearch() {
      this.$emit("onChange",this.obj.one);
      this.SearchTriangle = true;
      this.$refs.searchDetail.$el.style.height = "0px";
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
    async handleOk(e) {
      if (this.form.name.length < 16 && this.form.name.length != 0) {
        this.visible = false;
        let dt = await add_role({
          role_name: this.form.name
        });

        this.form.name = "";

        if (dt.code == 1) {
          this.$router.push({
            path: "/roleset/roleEditing",
            query: {
              id: dt.data
            }
          });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  justify-content: space-between;
  height: 60px;
  border-bottom: 1px solid #e4e7ed;
  .headerbtn {
    margin-left: 20px;
  }
}
/deep/.ant-input-group-wrapper{
  width: 290px;
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
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
  top: 59px;
}
/deep/.ant-modal-header {
  border-bottom: 0px solid #ccc;
}
/deep/.ant-modal-footer {
  border-top: 0px solid #ccc;
}
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
/deep/ .ant-form {
  width: 100%;
  .ant-row {
    display: flex;
    margin-bottom: 0;
    .ant-form-item-label {
      flex: 0 0 80px !important;
    }
    .ant-form-item-control-wrapper {
      flex: 1;
    }
  }
}
</style>