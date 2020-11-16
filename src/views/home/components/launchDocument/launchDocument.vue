<template>
  <div class="launchDocument">
    <Maintitle @go_back="go_back" :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <a-tabs default-active-key="1" @change="tab_change">
        <a-tab-pane :key="1">
          <span class="flex-align-center" slot="tab">
            <i :class="{'tab-icon-active':tab===1}" class="tab-icon" />我拟稿的发文
          </span>
          <TextPost @get_list_repeat="get_list_repeat" :list="data" :type="1" :count="count" />
        </a-tab-pane>
        <a-tab-pane :key="2" force-render>
          <span class="flex-align-center" slot="tab">
            <i :class="{'tab-icon-active':tab===2}" class="tab-icon" />我拟稿的收文
          </span>
          <TextPost @get_list_repeat="get_list_repeat" :list="data" :type="2" :count="count" />
        </a-tab-pane>
        <a-tab-pane :key="3">
          <span class="flex-align-center" slot="tab">
            <i :class="{'tab-icon-active':tab===3}" class="tab-icon" />我拟稿的签报
          </span>
          <TextPost @get_list_repeat="get_list_repeat" :list="data" :type="3" :count="count" />
        </a-tab-pane>
      </a-tabs>
    </Maincontent>
  </div>
</template>

<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import TextPost from "@/views/home/components/launchDocument/components/textPost.vue";
import { get_document_list } from "@/api/home.js";
import { get_time } from "@/js/public";

export default {
  components: {
    Maintitle,
    Maincontent,
    TextPost
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: true // 返回开关
      },
      data: null,
      tab: 1,
      count: null
    };
  },
  methods: {
    //获取数据
    async get_list(
      keyword = "",
      status = 0,
      type = 1,
      page = 1,
      listRows = 10,
      dataa = {
        create_time: `${get_time(this.$route.query.type)[0] / 1000},${get_time(
          this.$route.query.type
        )[1] / 1000}`
      },
      table_data = { order_field: "", sort: "" }
    ) {
      let datas = {
        keyword,
        status,
        type,
        page,
        listRows,
        order_field: table_data.order_field, // 排序字段 按返回的字段名传值
        sort: table_data.sort // 排序方式 asc升序 desc倒序
      };

      Object.assign(datas, dataa);
      let { data } = await get_document_list(datas);
      if (data && data.list && data.list.length > 0) {
        data.list.forEach((el, index) => {
          el.key = index;
          switch (el.process_urgent_level) {
            case "普通":
              el.c_process_urgent_level2 = "normal";
              break;
            case "紧急":
              el.c_process_urgent_level2 = "urgent";
              break;
            case "加急":
              el.c_process_urgent_level2 = "so-urgent";
              break;
          }
        });
        this.data = data.list;
        this.count = data.count;
      } else {
        this.data = [];
        this.count = 0;
      }
    },

    //tab切换
    tab_change(v) {
      this.tab = v;
      this.get_list("", 0, this.tab);
      this.$bus.$emit('launchDocumentTabs')
    },

    //子传父
    get_list_repeat(keyword, status, type, page, listRows, dataa, table_data) {
      this.get_list(keyword, status, type, page, listRows, dataa, table_data);
    },
    go_back() {
      this.$router.go(-1);
    }
  },
  created() {
    this.get_list();
  }
};
</script>

<style lang="less" scoped>
.test {
  width: 800px;
}
.launchDocument {
  .maincontent {
    max-width: 1280px;
    padding: 20px;
    // overflow: hidden;
    box-sizing: border-box;
  }
  /deep/ .ant-tabs-nav-scroll {
    background: rgba(252, 252, 252, 1);
  }

  .tab-icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url("../../../../assets/home/tab.png");
    background-size: 15px 15px;
    margin-right: 5px;
  }
  .tab-icon-active {
    background: url("../../../../assets/home/tab_active.png");
    background-size: 15px 15px;
  }
}
</style>