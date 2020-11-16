<template>
  <div class="flowtrend">
    <a-timeline>
      <template v-for="(item,index) in arry">
        <a-timeline-item :key="index">
          <div slot="dot"
               v-if="item.rstatus==2||item.rstatus==1"
               class="icons"></div>
          <div slot="dot"
               v-else
               class="icon">
            <SvgIcon item="username"
                     style="color:#ffffff;font-size:10px;" />
          </div>
          <div class="trend-item">
            <div class="trend-item-top">
              <span>{{item.title}} · {{item.c_status}}</span>
              <span class="status"
                    v-if="item.c_approver">{{item.c_approver}}</span>
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
                       v-for="(item2,index2) in item.handle"
                       :key="index2">
                    <div class="trend-item-bottom-cl flex-col">
                      <div class="trend-item-bottom-cl-lf flex-col">

                        <a-icon v-if="item2.rstatus"
                                class="icon-head"
                                :class="color[item2.rstatus].type" />

                        <div class="trend-item-bottom-cl-lf-img">
                          <img :src="item2.avatar"
                               alt />
                        </div>
                        <div class="trend-item-bottom-cl-lf-name">{{item2.name}}</div>
                        <div class="trend-item-bottom-cl-lf-explain">{{item2.explain}}</div>
                      </div>
                      <div class="flex-col-bd"></div>
                      <div v-if="item2.rstatus"
                           class="flex-col"
                           :style="`color:${textcolor[item2.rstatus].colors};`">
                        <span class="span">·</span>
                        <span>{{item2.c_status}}</span>
                      </div>
                      <div class="trend-item-bottom-cl-rt"
                           style="margin-left:10px">{{item2.rtime}}</div>
                    </div>

                    <template v-for="item3 in item2.transfer">
                      <div :key="item3.userid"
                           class="flex-col trend-item-bottom-cl">
                        <SvgIcon item="returns"
                                 style="margin-right:8px;background:none;color:#839CCF;" />
                        <div class="trend-item-bottom-cl-lf flex-col">

                          <a-icon v-if="item3.rstatus"
                                  class="icon-head"
                                  :class="color[item3.rstatus].type" />

                          <div class="trend-item-bottom-cl-lf-img">
                            <img :src="item3.avatar"
                                 alt />
                          </div>
                          <div class="trend-item-bottom-cl-lf-name">{{item3.name}}</div>
                          <div class="trend-item-bottom-cl-lf-explain">{{item3.explain}}</div>
                        </div>
                        <div class="flex-col-bd"></div>

                        <div v-if="item3.rstatus"
                             class="flex-col"
                             :style="`color:${textcolor[item3.rstatus].colors};`">
                          <span class="span">·</span>
                          <span>{{break_state(item3)}}</span>
                        </div>
                        <div class="trend-item-bottom-cl-rt"
                             style="margin-left:10px">{{item3.rtime}}</div>
                      </div>
                    </template>
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
import SvgIcon from '@/views/components/svgicon.vue'
import collapseTransition from './eltansition'
import { recordList } from '@/api/incoming.js'
export default {
  name: 'Flowtrend',
  data() {
    return {
      active_index: 0,
      arry: null,
      color: {
        1: {
          type: 'close-circle',
          colors: '#F56C6C',
        },
        2: {
          type: '',
          colors: '#F56C6C',
        },
        3: {
          type: 'agree',
          colors: '#41AAFF',
        },
        4: {
          type: 'refuse',
          colors: '#F56C6C',
        },
        5: {
          type: 'close-circle',
          colors: '#F56C6C',
        },
        6: {
          type: 'release',
          colors: '#F5AC40',
        },
        7: {
          type: 'close-circle',
          colors: '#F56C6C',
        },
        8: {
          type: 'stop',
          colors: '#8c9e00',
        },
      },
      textcolor: {
        1: {
          colors: '#909399',
        },
        2: {
          colors: '#0082EF',
        },
        3: {
          colors: '#909399',
        },
        4: {
          colors: '#F56C6C',
        },
        5: {
          colors: '#909399',
        },
        6: {
          colors: '#F5AC40',
        },
        7: {
          colors: '#F5AC40',
        },
        8: {
          colors: '#8c9e00',
        },
      },
    }
  },
  components: {
    SvgIcon,
    collapseTransition,
  },
  created() {
    this.get_recordList()
  },
  methods: {
    //获取数据
    async get_recordList() {
      let { data } = await recordList({
        data_id: this.$route.query.id,
      })
      data.forEach((el) => {
        el.isshow = true
        el.c_status = this.break_state(el)

        if (el.approver_type == 1) {
          el.c_approver = '会签'
        } else if (el.approver_type == 2) {
          el.c_approver = '或签'
        } else {
          el.c_approver = null
        }

        if (el.handle.length > 0) {
          el.handle.forEach((el) => {
            el.c_status = this.break_state(el)
          })
        }
      })
      this.arry = data
    },
    //状态配置
    break_state(obj) {
      switch (obj.rstatus) {
        case 1:
          return '等待中'
        case 2:
          return '审核进行中'
        case 3:
          return '审核通过'
        case 4:
          return '审核拒绝'
        case 5:
          return '已撤销'
        case 6:
          return '暂放'
        case 7:
          return '报废'
        case 8:
          return '已转审'
        default:
          ''
      }
    },
    isshow(index) {
      this.arry[index].isshow = !this.arry[index].isshow
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-timeline-item-tail {
  height: calc(100% - 30px);
  top: 20px;
}
.flowtrend {
  border: 1px solid #ebeef5;
  padding: 20px 42px 0 20px;
  max-height: 560px;
  overflow-y: scroll;
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
      .trend-item-bottom-cl {
        height: 46px;
        background-color: #f9f9f9;
        padding: 0 20px 0 10px;
        .trend-item-bottom-cl-lf {
          position: relative;
          .trend-item-bottom-cl-lf-icon {
            width: 14px;
            height: 14px;
            text-align: center;
            border-radius: 7px;
            position: absolute;
            left: 21px;
            bottom: 20px;
            z-index: 1;
            background: #f57474;
          }
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
          .trend-item-bottom-cl-lf-explain {
            width: 300px;
            overflow: hidden;
            /* 显示省略符号来代表被修剪的文本。 */
            text-overflow: ellipsis;
            /* 文本不换行 */
            white-space: nowrap;
          }
          .trend-item-bottom-cl-rt {
            color: #909399;
          }
        }
      }
    }
  }
  .span {
    font-size: 40px;
    line-height: 0px;
    position: relative;
    bottom: 2px;
    margin-right: 3px;
  }
  /deep/.ant-timeline-item-head {
    padding: 0 !important;
  }
  .icon {
    width: 18px;
    height: 18px;
    background: #41aaff;
    border-radius: 50%;
    text-align: center;
    line-height: 15px;
  }
  .icons {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #bbbbbb;
  }
  .ok {
    background: url('../../../../../assets/approval_icon/ok.png');
    background-size: 26px 26px;
  }
  .approval {
    background: url('../../../../../assets/approval_icon/approval.png');
    background-size: 26px 26px;
  }
  .back {
    background: url('../../../../../assets/approval_icon/back.png');
    background-size: 26px 26px;
  }
  .release {
    background: url('../../../../../assets/approval_icon/release.png');
    background-size: 26px 26px;
  }
  .scrap {
    background: url('../../../../../assets/approval_icon/scrap.png');
    background-size: 26px 26px;
  }
  .wait {
    background: url('../../../../../assets/approval_icon/wait.png');
    background-size: 26px 26px;
  }
  .x {
    background: url('../../../../../assets/approval_icon/x.png');
    background-size: 26px 26px;
  }
  .clock-circle {
    color: #49cb15ff;
  }
  .status {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    width: 38px;
    height: 20px;
    border: 1px solid rgba(66, 162, 243, 1);
    border-radius: 2px;
    color: #42a2f3ff;
    font-size: 12px;
  }
}

.icon-head {
  width: 15px;
  height: 15px;
  text-align: center;
  border-radius: 7px;
  position: absolute;
  left: 21px;
  bottom: 20px;
  z-index: 1;
}
//审核图片（头像右上角）
.reviewing {
  background: url('../../../../../assets/adddraft/reviewing.png');
  background-size: 15px 15px;
}
.agree {
  background: url('../../../../../assets/adddraft/agree.png');
  background-size: 15px 15px;
}
.release {
  background: url('../../../../../assets/adddraft/release.png') !important;
  background-size: 15px 15px !important;
}
.refuse {
  background: url('../../../../../assets/adddraft/refuse.png') !important;
  background-size: 15px 15px !important;
}
</style>



