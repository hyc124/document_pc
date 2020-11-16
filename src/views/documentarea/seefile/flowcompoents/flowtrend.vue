<template>
  <div class="flowtrend">
    <a-timeline>
      <template v-for="item in arry">
        <a-timeline-item :key="item.name">
          <a-icon slot="dot" type="check-circle" style="font-size:26px;" />
          <div class="trend-item">
            <div class="trend-item-top">
              <span>大包{{item.name}} · 已同意</span>
              <div class="trend-item-isshow hand" @click="isshow(item)">
                <a-icon :type="item.isshow? 'caret-down':'caret-up'" />
              </div>
            </div>
            <collapse-transition>
              <div class="collapse-wrap" v-show="item.isshow">
                <slot>
                  <div class="trend-item-bottom">
                    <div class="trend-item-bottom-cl">
                      <div class="trend-item-bottom-cl-lf">
                        <div class="trend-item-bottom-cl-lf-img">
                          <div class="trend-item-bottom-cl-lf-ac"></div>
                        </div>
                        <div class="trend-item-bottom-cl-lf-name">大胖</div>
                      </div>
                      <div class="trend-item-bottom-cl-rt">已同意 2015-09-10</div>
                    </div>
                    <div class="trend-item-bottom-cl">
                      <div class="trend-item-bottom-cl-lf">
                        <div class="trend-item-bottom-cl-lf-img">
                          <div class="trend-item-bottom-cl-lf-ac"></div>
                        </div>
                        <div class="trend-item-bottom-cl-lf-name">大胖</div>
                      </div>
                      <div class="trend-item-bottom-cl-rt">已同意 2015-09-10</div>
                    </div>
                  </div>
                </slot>
              </div>
            </collapse-transition>
          </div>
        </a-timeline-item>
      </template>
    </a-timeline>
  </div>
</template>
<script>
let arry = [
  {
    name: "1",
    isshow: true
  },
  {
    name: "2",
    isshow: true
  },
  {
    name: "3",
    isshow: true
  },
  {
    name: "4",
    isshow: true
  },
  {
    name: "5",
    isshow: true
  }
];
import collapseTransition from "./eltansition";
export default {
  name: "Flowtrend",
  data() {
    return {
      active_index: 0,
      arry
    };
  },
  components: { collapseTransition },
  created() {},
  methods: {
    isshow(e) {
      e.isshow = !e.isshow;
    }
  }
};
</script>
<style lang="less" scoped>
.flowtrend {
  border: 1px solid #ebeef5;
  padding: 20px 42px 0 20px;
  .trend-item {
    margin-left: 10px;
    .trend-item-top {
      line-height: 26px;
      display: flex;
      align-items: center;
      .trend-item-isshow {
        margin-left: 12px;
        font-size: 18px;
        color: #ebeef5;
      }
    }
    .trend-item-bottom {
      padding: 10px 0;
      .trend-item-bottom-cl {
        height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #ebeef5;
        padding: 0 20px 0 10px;
        .trend-item-bottom-cl-lf {
          display: flex;
          align-items: center;
          .trend-item-bottom-cl-lf-img {
            position: relative;
            width: 28px;
            height: 28px;
            background-color: #ebcdcd;
            border-radius: 2px;
            .trend-item-bottom-cl-lf-ac {
              background-color: #49cb15;
              position: absolute;
              top: -6px;
              right: -6px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
            }
          }
          .trend-item-bottom-cl-lf-name {
            margin: 0 15px;
          }
          .trend-item-bottom-cl-rt {
            color: #909399;
          }
        }
      }
    }
    .wave-enter,
    .wave-leave-to {
      //刚进去和离开最后一刻,消失
      transform: translateY(100%); //消失即向下位移自身高度
    }
    .x-enter-to,
    .x-leave {
      //进入的最后一刻和刚离开,高度最高
      transform: translateY(0); //即元素原本高度
    }
    .wave-enter-active,
    .wave-leave-active {
      transition: transform 2s;
    }
  }
}
</style>