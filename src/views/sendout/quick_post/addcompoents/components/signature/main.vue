<template>
  <div class="signature" v-if="list">
    <div v-show="list.length > 0">
      <div class="head">
        <a-select
          v-model="all_val.type"
          style="width: 130px"
          @change="handleChange"
        >
          <a-select-option :value="1">公司</a-select-option>
          <a-select-option :value="2">单位</a-select-option>
          <a-select-option :value="3">个人</a-select-option>
        </a-select>
        <a-input-search
          v-model="all_val.name"
          placeholder="搜索签章"
          style="width: 240px; margin-left: 10px"
          @search="onSearch"
        />
      </div>

      <div class="body">
        <div
          class="item"
          :class="{ active: select_index == index }"
          @click="selecting(item, index)"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <div class="img">
            <img :src="HttpUrl + item.img" alt />
          </div>
          <div class="title">{{ item.name }}</div>
          <div class="gou" v-show="select_index == index"></div>
        </div>
      </div>
    </div>

    <div v-show="list.length <= 0" class="not-found">
      <div class="n-left">
        <img src="../../../../../../assets/home/not-found.png" alt />
      </div>
      <div class="n-right">
        <h2>很抱歉，没有找到相关内容~</h2>
        <p class="tips">请尝试其他查询条件</p>
        <p class="reason">可能原因： 没有查看权限/ 记录为空</p>
      </div>
    </div>
  </div>
</template>

<script>
import { HttpUrl } from "@/js/public.js";
export default {
  name: "signaturem_name",
  props: ["list", "all_val"],
  data() {
    return {
      HttpUrl,
      //搜索，选择
      select_value: 3,
      search_value: "",

      //选择
      select_signature: null,
      select_index: null,
    };
  },
  created() {
  },
  methods: {
    handleChange() {
      this.$emit("update_data");
    },
    onSearch() {
      this.$emit("update_data");
    },
    selecting(item, inx) {
      this.select_signature = item;
      this.select_index = inx;
      this.$emit("select_signature", this.select_signature);
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.signature {
  position: relative;
  min-height: 250px;
}
.head {
  display: flex;
  align-items: center;
}
.body {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  margin-top: 20px;
  height: 320px;
  overflow-y: scroll;
  padding-left: 10px;
  .item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px rgba(220, 223, 230, 1);
    border-radius: 2px 2px 0px 0px;
    border: 1px solid transparent;
    margin: 0 10px 20px 10px;
    &:hover {
      border: 1px solid rgba(65, 170, 255, 1);
    }
    .gou {
      width: 44px;
      height: 44px;
      position: absolute;
      right: 0;
      top: 0;
      background: url("../../../../../../assets/adddraft/gou.png");
      background-size: 44px 44px;
    }
    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 150px;
      img {
        width: 118px;
        height: 118px;
      }
    }
    .title {
      margin: 10px 0;
      text-align: center;
      font-size: 16px;
      color: #303133;
    }
  }
  .active {
    border: 1px solid rgba(65, 170, 255, 1);
  }
}

.not-found {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 334px;
  height: 100px;
  border-radius: 4px;
  text-align: center;
  .n-left {
    width: 72px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .n-right {
    color: #909399;
    font-size: 12px;
    text-align: left;
    h2 {
      color: #303133;
      font-size: 16px;
      margin: 0;
    }
    p {
      margin: 0;
    }
    .tips {
      margin-top: 5px;
    }
    .reason {
      margin-top: 16px;
      font-size: 14px;
    }
  }
}
</style>