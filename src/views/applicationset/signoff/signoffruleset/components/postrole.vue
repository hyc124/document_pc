<template>
  <div class="tabs_card">
    <a-tabs type="card" :hideAdd="true" @edit="onEdit" v-model="activeKey">
      <template v-for="pane in panes">
        <a-tab-pane :key="pane.key" :closable="pane.closable">
          <span slot="tab" class="img_cont" @click="onClose(pane.key)">
            <img class="img_type" :src=" pane.postimg==false ? pane.url : pane.imgurl" />
            <div class="bo" :data-index="pane.key" @click="removeImg(pane.key)">
              <span class="remove_img">—</span>
            </div>
          </span>
          <!-- <Add :num="pane.num" /> -->
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>
<script>
import Add from "./add";
export default {
  name:'Add',
  data() {
    return {
      newTabIndex: 0,
      activeKey: 0
    };
  },
  components: {
    Add
  },
  props: ["panes"],
  watch: {
    panes(i, v) {
      this.activeKey = i[i.length - 1].key;
    }
  },
  methods: {
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    // 删除
    removeImg(targetKey) {
      let _this = this;
      for (let i = 0; i < _this.panes.length; i++) {
        if (_this.panes[i].key == targetKey) {
          _this.panes.splice(i, 1);
        }
      }
    },
    onClose(key) {
      this.$bus.$emit("showbox", key);
    }
  }
};
</script>
<style lang="less" scoped>
.tabs_card {
  margin-left: 120px;
  .tab-icon {
    display: block;
    height: 100%;
    width: 100%;
  }
  .ant-tabs-bar {
    height: 80px;
    border: none;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
    height: 80px;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    margin-right: 20px;
    height: 80px;
    width: 80px;
    border: 1px solid #dcdfe6;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    margin-right: 20px;
    height: 80px;
    width: 80px;
    border: 1px solid #7dbff6;
  }
  .ant-form-item .ant-form .ant-col-14 {
    margin-left: 80px !important;
  }
  .img_cont {
    position: relative;
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    .img_type {
      width: 35px;
      margin-top: 24px;
    }
    .bo {
      width: 0;
      height: 0;
      border-left: 24px solid transparent;
      border-right: 9px solid #f5f5f5;
      border-bottom: 6px solid transparent;
      border-top: 18px solid #f5f5f5;
      position: absolute;
      top: 0px;
      right: 0px;
      .remove_img {
        position: absolute;
        top: -32px;
        left: -7px;
      }
    }
    /deep/
      .ant-tabs.ant-tabs-card
      .ant-tabs-card-bar
      .ant-tabs-tab
      .ant-tabs-close-x {
      display: none;
    }
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    padding: 0px;
  }
}
</style>