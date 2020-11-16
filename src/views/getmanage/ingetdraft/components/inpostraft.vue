<template>
  <div class="inpostraft">
    <div class="flex-col">
      <a-input-search
        placeholder="请输入关键字"
        style="width: 259px"
        v-model="form.name"
        enter-button
        @search="Inquire"
        :maxLength="20"
      />
    </div>
    <p class="inpostraft-toptitle" v-if="searchdata.length">搜索结果</p>
    <div class="flex-col bigbox" v-if="searchdata.length">
      <div
        class="inpostraft-inbox hand"
        v-for="item in searchdata"
        :key="item.id"
      >
        <p class="inpostraft-inbox-title" :title="item.temp_name">
          {{ item.temp_name }}
        </p>
        <div class="inpostraft-inbox-title-box">
          <div
            class="inpostraft-inbox-title-xj hand"
            @click="onSelect(item.id)"
          >
            新建
          </div>
          <div
            class="inpostraft-inbox-title-xj hand"
            @click="onPreview(item.id)"
          >
            预览
          </div>
        </div>
        <p class="inpostraft-inbox-text flex-col">
          <img
            class="textimg"
            src="../../../../assets/addpostset/textimg.png"
            alt
          />
          {{ item.type_name }}
        </p>
      </div>
      <template v-for="index in 6 - (searchdata.length % 6)">
        <div class="inpostraft-inbox-alternate" :key="index + 100"></div>
      </template>
    </div>
    <p class="inpostraft-toptitle" v-if="!searchdata.length && data.length">
      最近使用模板
    </p>
    <div class="flex-col bigbox" v-if="!searchdata.length && data.length">
      <div class="inpostraft-inbox hand" v-for="item in data" :key="item.id">
        <p class="inpostraft-inbox-title" :title="item.temp_name">
          {{ item.temp_name }}
        </p>
        <div class="inpostraft-inbox-title-box">
          <div
            class="inpostraft-inbox-title-xj hand"
            @click="onSelect(item.id)"
          >
            新建
          </div>
          <div
            class="inpostraft-inbox-title-xj hand"
            @click="onPreview(item.id)"
          >
            预览
          </div>
        </div>
        <p class="inpostraft-inbox-text flex-col">
          <img
            class="textimg"
            src="../../../../assets/addpostset/textimg.png"
            alt
          />
          {{ item.type_name }}
        </p>
      </div>
      <template v-if="data.length % 6 != 0">
        <div
          class="inpostraft-inbox-alternate"
          v-for="index in 6 - (data.length % 6)"
          :key="index + 100"
        ></div>
      </template>
    </div>
    <p class="inpostraft-toptitle" v-if="!searchdata.length">常用模板</p>
    <div class="flex-col bigbox" v-if="!searchdata.length">
      <div class="inpostraft-inbox hand" v-for="item in common" :key="item.id">
        <p class="inpostraft-inbox-title">{{ item.temp_name }}</p>
        <div class="inpostraft-inbox-title-box">
          <div
            class="inpostraft-inbox-title-xj hand"
            @click="onSelect(item.id)"
          >
            新建
          </div>
          <div
            class="inpostraft-inbox-title-xj hand"
            @click="onPreview(item.id)"
          >
            预览
          </div>
        </div>
        <p class="inpostraft-inbox-text flex-col">
          <img
            class="textimg"
            src="../../../../assets/addpostset/textimg.png"
            alt
          />
          {{ item.type_name }}
        </p>
      </div>
      <div class="inpostraft-inbox-end" @click="openFiles">
        <p class="inpostraft-inbox-end-title">全部模板</p>
      </div>
      <template v-if="common.length % 6 != 0">
        <div
          class="inpostraft-inbox-alternate"
          v-for="index in 6 - ((common.length % 6) + 1)"
          :key="index + 100"
        ></div>
      </template>
    </div>
    <!-- 全部文件夹 -->
    <NewDocument
      @delNewDoucument="delNewDoucument"
      :TemplatePopup="TemplatePopup"
      @getcollectDocument="getcollectDocument"
      @Tips="Tips"
    />
    <a-modal
      class="preview-modal"
      @ok="ViewDocument.vis2 = false"
      v-model="ViewDocument.vis2"
      footer
    >
      <div id="print" ref="print">
        <ViewDocument
          :ViewDocument="ViewDocument"
          :datas="datas"
          v-if="ViewDocument.vis2"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import { GetselectList } from "@/api/draft.js";
import NewDocument from "@/views/components/NewDocument.vue";
import ViewDocument from "@/views/components/viewDocument.vue";
import { Postinfo } from "@/api/applicationset.js";
export default {
  name: "InPostRaft",
  data() {
    return {
      data: [], //最近使用模板
      all: 1, //展示全部 默认1
      form: {
        name: "", //查询内容
      },
      common: [],
      // 模板弹窗数据
      TemplatePopup: {
        visibles: false,
        type: 2,
        title: "收文模板",
        type2: 2,
        templateNum: true,
      },
      confirmLoading: false,
      transferlist: null,
      transferlistcl: null,
      transferlist_index: 0,
      transferlistcl_index: 0,
      id: null,
      // 搜索的结果
      searchdata: [],
      ViewDocument: {
        // 预览
        vis2: false,
        condition: false, // 是否是打印，如果是的话就要打开分页
      },
      datas: "",
    };
  },
  created() {
    // 获取公文模板
    this.getselectlist();
  },
  mounted() {},
  components: {
    NewDocument,
    ViewDocument
  },
  methods: {
    // 预览
    onPreview(id) {
      Postinfo({ id: id }).then((res) => {
        this.datas = res.data;
        this.ViewDocument.vis2 = true;
      });
      // this.$router.push({
      //   path: `/getformworkset/getcompileformwork?id=${id}&edit=1 `
      // });
    },
    //选中模板添加公文
    onSelect(id) {
      this.$router.push({
        path: "draft/addDraft",
        query: {
          id,
          type: 2,
        },
      });
    },
    // 获取公文模板
    getselectlist() {
      GetselectList({ kwd: this.form.name, type: 2, page: 1 }).then((res) => {
        if (res.data.allways_use) {
          this.searchdata = [];
          this.data =
            res.data.allways_use.resource == undefined
              ? []
              : res.data.allways_use.resource;
        }
        if (res.data.collection) {
          this.searchdata = [];
          this.common =
            res.data.collection.resource == undefined
              ? []
              : res.data.collection.resource;
        }
        if (!res.data.collection && !res.data.allways_use) {
          this.searchdata = res.data;
        }
      });
    },
    // 监测模板是否为空
    Tips(num) {
      if (num == 0) {
        this.$message.warning("当前未设置模板，请先添加模板！");
      }
    },
    // 点击收藏之后刷新页面
    getcollectDocument(data) {
      if (data.data.collection) {
        this.common = data.data.collection.resource;
      }
    },
    // 查询
    Inquire() {
      this.getselectlist();
    },

    // 打开全部文件
    openFiles() {
      this.TemplatePopup.visibles = true;
    },
    // 关闭模态框
    delNewDoucument() {
      this.TemplatePopup.visibles = false;
    },
  },
};
</script>
<style lang="less" scoped>
.inpostraft {
  position: relative;
}
//  预览公文内容
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 800px;
    padding: 0;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}
@import url("../../../../css/newlyBuild.less");
</style>