<template>
  <div class="addInpostrafts-footer-trend">
    <a-timeline>
      <template v-for="(item,index) in data_list">
        <a-timeline-item :key="index">
          <div class="liuc-dian">
            <img src="../../../../../assets/addpostset/liiucheng-dian.png"
                 alt />
          </div>
          <div class="trend-item">
            <div class="trend-item-top">
              <span>{{item.title}}</span>
              <span class="sign"> {{item.approver_type==1?"会签":"或签"}}</span>

              <div class="trend-item-isshow hand"
                   @click="isshow(index)">
                <a-icon :type="item.isshow? 'caret-down':'caret-up'" />
              </div>
            </div>
            <collapse-transition>
              <div class="collapse-wrap"
                   v-show="item.isshow">
                <slot>
                  <div class="trend-item-bottom"
                       v-if="item.info">
                    <div class="trend-item-bottom-cl"
                         v-for="(item2,index2) in  item.info"
                         :key="index2">
                      <div class="trend-item-bottom-cl-lf">
                        <div class="trend-item-bottom-cl-lf-img">
                          <img :src="item2.avatar"
                               alt />
                        </div>
                        <div class="trend-item-bottom-cl-lf-name">{{item2.name}}</div>
                      </div>
                      <div class="trend-item-bottom-cl-rt">{{item2.explain}} {{item2.rtime}}</div>
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
    name: '1',
    isshow: true,
  },
  {
    name: '2',
    isshow: true,
  },
  {
    name: '3',
    isshow: true,
  },
  {
    name: '4',
    isshow: true,
  },
  {
    name: '5',
    isshow: true,
  },
]
import collapseTransition from './eltansition'
export default {
  props: {
    trend_list: {
      default: null,
    },
  },
  name: 'Trend',
  data() {
    return {
      active_index: 0,
      arry,
      data_list: null,
    }
  },
  components: { collapseTransition },
  created() {
    this.get_data_list()
  },
  methods: {
    //获取父级数据
    get_data_list() {
      if (this.trend_list) {
        this.trend_list.forEach((el) => {
          this.$set(el, 'isshow', true)
        })
        this.data_list = this.trend_list
      }
    },
    isshow(index) {
      this.data_list[index].isshow = !this.data_list[index].isshow
    },
  },
  watch: {
    trend_list() {
      this.get_data_list()
    },
  },
}
</script>
<style lang="less" scoped>
.addInpostrafts-footer-trend {
  min-height: 789px;
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
        background-color: #f9f9f9;
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

            img {
              width: 100%;
              height: 100%;
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
  .liuc-dian {
    position: absolute;
    left: -20px;
    top: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.sign {
  display: inline-block;
  width: 38px;
  height: 20px;
  border: 1px solid rgba(66, 162, 243, 1);
  opacity: 1;
  border-radius: 2px;
  text-align: center;
  line-height: 20px;
  margin-left: 10px;
  color: #0082ef;
}
</style>