<template>
  <div>
    <Maintitle :titleObj="titleObj" @go_back="reverts">
      <div>
        <!-- <a-button @click="reverts">返回</a-button> -->
        <a-button class="bcbtn" @click="reverts">传阅</a-button>
        <a-button class="bcbtn" @click="reverts">转发文</a-button>
        <a-button class="bcbtn" @click="reverts">打印</a-button>
        <a-button type="primary" class="bcbtn">发布</a-button>
      </div>
    </Maintitle>
    <Maincontent>
      <div class="maincontent-box maincontent-left">
        <div class="maincontent-left-top">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="发文信息">
              <Sendinginfo />
            </a-tab-pane>
            <a-tab-pane key="2" tab="正文内容">
              <Bodycontent />
            </a-tab-pane>
            <a-tab-pane key="3" tab="发文附件">
              <Attachment />
            </a-tab-pane>
            <a-tab-pane key="4" tab="流程信息">
              <Processcontent />
            </a-tab-pane>
          </a-tabs>
          <a-button class="seefile-link" type="link">预览公文内容</a-button>
        </div>
      </div>
      <div class="maincontent-box maincontent-right">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="接受审批">
            <Accept />
          </a-tab-pane>
          <a-tab-pane key="2" tab="意见汇总">
            <Summary />
          </a-tab-pane>
          <a-tab-pane key="3" tab="附件列表">
            <EnclosureList />
          </a-tab-pane>
        </a-tabs>
      </div>
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import Sendinginfo from "@/views/documentarea/seefile/components/sendinginfo.vue";
import Bodycontent from "@/views/documentarea/seefile/components/bodycontent.vue";
import Attachment from "@/views/documentarea/seefile/components/attachment.vue";
import Processcontent from "@/views/documentarea/seefile/components/processcontent.vue";
import Accept from "@/views/components/incoming/components/right/accept.vue";
import Summary from "@/views/components/incoming/components/right/summary.vue";
import EnclosureList from "@/views/components/incoming/components/right/enclosureList.vue";
export default {
  name: "Seefile",
  data() {
    return {
            // 头部需要的开关集合
      titleObj: {
        retu: true // 返回开关
      },
    };
  },
  components: {
    Maintitle,
    Maincontent,
    Sendinginfo,
    Bodycontent,
    Attachment,
    Processcontent,
    Accept,
    Summary,
    EnclosureList
  },
  created() {},
  methods: {
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.maincontent {
  background-color: transparent;
  padding: 0;
  display: flex;
  justify-content: space-between;
  overflow: visible;
  .maincontent-box {
    background: white;
  }
  .maincontent-left {
    background: white;
    // flex: 1;
    width: 894px;
    padding: 10px 20px;
    .maincontent-left-top {
      position: relative;
      .seefile-link {
        position: absolute;
        top: 8px;
        right: -16px;
      }
    }
  }
  .maincontent-right {
    width: 376px;
    // margin-left: 10px;
    background: white;
    /deep/.ant-tabs-tab {
      font-size: 16px;
      width: 125px;
      height: 60px;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 60px;
    }
    /deep/.ant-tabs-ink-bar {
      height: 0;
    }
  }
}
.bcbtn {
  margin-left: 20px;
}
</style>