<template>
  <div class="addInpostrafts-footer">
    <div class="title">
      <span class="text">流程处理</span>
    </div>
    <div class="addInpostrafts-footer-tabs flex-col">
      <span :class="num==1?'hand bules':'hand'"
            @click="nums(1)">流程处理</span>
      <span :class="num==2?'hand bules':'hand'"
            @click="nums(2)">流程状态</span>
      <span :class="num==3?'hand bules':'hand'"
            @click="nums(3)">流程走向</span>
      <span :class="num==4?'hand bules':'hand'"
            @click="nums(4)">流程日志</span>
    </div>

    <FooterHandle @update_data="update_data"
                  :next_process_father="next_process_father"
                  :dept="all_data.dept"
                  :list="data"
                  v-show="num==1" />
    <FooterState :datas="data"
                 v-show="num==2" />
    <FooterTrend :trend_list="data.data"
                 v-show="num==3" />
    <div id="show_setting"></div>
    <FooterJournal v-show="num==4" />
  </div>
</template>
<script>
import FooterHandle from './footercompoent/footerhandle.vue'
import FooterState from './footercompoent/footerstate.vue'
import FooterTrend from './footercompoent/footertrend.vue'
import FooterJournal from './footercompoent/footerjournal.vue'

import { approval_before_process } from '@/api/draft'
export default {
  name: 'Footer',
  props: {
    all_data: {
      default: null,
    },
  },
  data() {
    return {
      num: 1,
      data: [],
      next_process_father: null,
    }
  },
  components: {
    FooterHandle,
    FooterState,
    FooterTrend,
    FooterJournal,
  },
  created() {
    //   update=>判断是第一次进来拿的全部流程数据，还是只是手动修改了流程节点的数据
    this.$bus.$off('updata_footer_process')
    this.$bus.$on('updata_footer_process', (data, update) => {
      if (update) {
        this.data.data = data
      } else {
        this.data = data
      }
    })
  },
  methods: {
    update_data(dep_id) {
      this.get_approval_before_process(dep_id)
    },
    nums(nums) {
      this.num = nums
    },
  },
  watch: {},
}
</script>
<style lang="less" scoped>
#show_setting {
  position: absolute;
  bottom: 0;
  height: 150px;
}
.addInpostrafts-footer {
  position: relative;
  padding-bottom: 30px;
  background: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.04);
  .addInpostrafts-footer-title {
    font-size: 18px;
    color: #303133;
    padding-bottom: 10px;
    margin: 0px;
    border-bottom: 1px solid #ebeef5;
  }
  .addInpostrafts-footer-tabs {
    height: 44px;
    margin-bottom: 10px;
    padding-left: 10px;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 68px;
      height: 24px;
      border-radius: 2px;
      background: rgba(242, 242, 242, 1);
      margin-right: 5px;
    }
    .bules {
      color: #0082ef;
      background: rgba(0, 130, 239, 1);
      color: #ffffff;
    }
  }
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 10px;
  border-left: 4px solid rgba(0, 130, 239, 1);
  height: 20px;
  .text {
    color: #000000;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>