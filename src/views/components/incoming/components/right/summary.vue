<template>
  <div class="summary">
    <ul class="sec-tab">
      <li :class="{active:summary_tab===0}"
          @click="summary_tab=0">审批意见</li>
      <li :class="{active:summary_tab===1}"
          @click="summary_tab=1">传阅意见 <span v-if="crculation.remark">({{crculation.remark.length}})</span> </li>
    </ul>
    <ul class="sec-content">
      <li class="approval"
          v-show="summary_tab===0">
        <div class="r-content">
          <div class="opinion-item"
               v-for="(item,index) in approval"
               :key="index">

            <div class="left-index">
              <span class="forefront"></span>
              <div class="border"></div>
            </div>
            <div class="date mb flex-col-db">
              <div class="flex-align-center">
                <span class="jiedian"
                      v-if="index<=0">{{item.name}}</span>
                <span class="submitter"
                      v-if="index>0"
                      :title="item.name">{{item.name}}</span>
                <span v-if="item.status==2"
                      class="approver_type">{{item.approver_type==1?'会签':'或签'}}</span>
                <span class="sanjiao"
                      :class="item.is_show?'xia':'shang'"
                      @click="item.is_show=!item.is_show"></span>
              </div>
              <div>
                <span>
                  <span style="margin-right:5px"
                        :style="{color:styleColor[item.status].color}">
                    <span class="dian">·</span>
                    {{item.status | statusfun}}
                  </span>
                </span>
                <span v-if="item.status!=2">{{item.create_time }}</span>
              </div>
            </div>
            <div class="peoples"
                 :style="item.is_show?'height:0px;':''">
              <div class="people"
                   v-for="(item2,index2) in item.userinfo"
                   :key="index2">
                <!-- <div class="date mb flex-db">
                  <span>{{item2.create_time}}</span>
                </div> -->
                <div class="user-msg mb">
                  <div class="head-img">
                    <img :src="item2.avatar"
                         alt />
                  </div>
                  <div class="name">{{item2.name}} {{item2.position}}</div>
                </div>

                <div class="opinion mb"
                     v-if="item2.c_status || item2.explain">
                  <!-- <span class="opinion-agree">{{item2.c_status}}</span> -->
                  <span class="flex-align-center">{{item2.explain}}</span>
                </div>

                <div class="enclosure"
                     v-if="filelength(item2)">
                  <span style="color:#909399">
                    <SvgIcon :item="'enclosure'"
                             style="color:#C0C4CC;margin-right:5px" />附件
                  </span>
                  <div>
                    <a class="download"
                       :href="`${HttpUrl}/enclosure_download?user_id=${item2.userid}&document_id=${$route.query.id}&type=4&token=${$store.state.token}`"
                       download>
                      <SvgIcon :item="'dowannex'" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <NotFound v-show="!approval||approval.length<=0" />
      </li>
      <li class="crculation"
          v-show="summary_tab===1">
        <div class="title"
             v-if="crculationremark(crculation)">传阅意见</div>
        <div class="r-content">
          <div class="opinion-list">
            <div class="opinion-item"
                 v-for="(item,index) in crculation.remark"
                 :key="index">
              <div class="left-index">
                <span class="forefront"></span>
                <div class="border"></div>
              </div>
              <div class="date mb">{{item.comment_time}}</div>
              <div class="user-msg mb">
                <div class="head-img">
                  <img :src="item.avatar"
                       alt />
                </div>
                <div class="name">{{item.name}} {{item.position}}</div>
              </div>
              <div class="opinion mb"
                   v-if="item.remark">
                <span class="opinion-agree">{{item.remark}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="title record"
             v-if="get_leftdata.button.yijian">我的意见</div>
        <div v-if="get_leftdata.button.yijian"
             class="content">
          <div class="r-textarea">
            <a-textarea :maxLength="200"
                        v-model="remark_data"
                        placeholder="请输入传阅意见" />
            <div class="textarea-num">{{remark_data.length}}/200</div>
          </div>
          <div class="content-btn">
            <a-button type="primary"
                      @click="clickprimary">确定</a-button>
          </div>
        </div>

        <NotFound v-show="crculation.remark.length<=0&&!get_leftdata.button.yijian" />
      </li>
    </ul>
  </div>
</template>

<script>
import {
  approval_opinion,
  circulation_remark_list,
  circulation_comment,
} from '@/api/incoming.js'
import { batchDownload } from '@/api/public.js'
import { HttpUrl } from '@/js/public.js'
import SvgIcon from '@/views/components/svgicon.vue'
import NotFound from '@/views/components/notFound.vue'
let styleColor = {
  2: {
    color: '#0082EF',
    text: '审批中',
  },
  3: {
    color: '#909399',
    text: '已同意',
  },
  4: {
    color: '#F56C6C',
    text: '已驳回',
  },
  5: {
    color: '#F56C6C',
    text: '已撤销',
  },
  6: {
    color: '#F5AC40',
    text: '暂放',
  },
  7: {
    color: '#F56C6C',
    text: '已报废',
  },
  8: {
    color: '#F56C6C',
    text: '已转审',
  },
}
export default {
  methods: {},
  data() {
    return {
      styleColor,
      //意见汇总的二级导航
      summary_tab: 0,
      //意见汇总>传阅记录表格
      //两个tab的数据
      approval: null,
      crculation: {
        record: null,
        remark: [],
      },
      remark_data: '',
      columns: [
        {
          title: '时间',
          dataIndex: 'create_time',
        },
        {
          title: '发起人',
          dataIndex: 'send',
        },
        {
          title: '传阅对象',
          dataIndex: 'receive',
        },
      ],
      HttpUrl,
    }
  },
  created() {
    this.get_approval_opinion()
  },
  computed: {
    get_leftdata() {
      return this.$store.state.leftdata
    },
    filelength() {
      return (item) => {
        return item?.file?.length
      }
    },
    crculationremark() {
      return (item) => {
        return item?.remark?.length
      }
    },
  },
  components: {
    SvgIcon,
    NotFound,
  },
  methods: {
    async get_approval_opinion() {
      let data = await approval_opinion({
        data_id: this.$route.query.id,
      })
      let data2 = await circulation_remark_list({
        id: this.$route.query.id,
      })
      //空数据处理
      if (data.data) {
        data.data.forEach((el) => {
          if (el.userinfo.length > 0) {
            el.userinfo.forEach((el2) => {
              switch (el2.rstatus) {
                case 3:
                  el2.c_status = '同意'
                  break
                case 4:
                  el2.c_status = '驳回'
                  break
                case 5:
                  el2.c_status = '撤销'
                  break
                case 6:
                  el2.c_status = '暂放'
                  break
                case 7:
                  el2.c_status = '报废'
                  break
                case 8:
                  el2.c_status = '转审'
                  break
              }
            })
          }
          //设置是否展开
          el.is_show = false
        })

        this.approval = data.data
      }

      if (data2.data) {
        data2.data.record.forEach((el, index) => {
          el.key = index
        })
        this.crculation = data2.data
      }
    },
    // 提交传阅意见
    async clickprimary() {
      let a = await circulation_comment({
        id: this.$route.query.id,
        remark: this.remark_data,
      })
      if (a.code == 1) {
        this.$message.success('提交成功')
        setTimeout(() => {
          this.$router.go(0)
        }, 1000)
      }
    },
  },
  filters: {
    add_url(val) {
      return HttpUrl + val
    },
    statusfun(v, a) {
      return styleColor[v].text
    },
  },
}
</script>

<style lang="less" scoped>
//意见汇总
.summary {
  padding: 18px 0;
  .sec-tab {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 130px;
      height: 32px;
      background: rgba(239, 248, 255, 1);
      border: 1px solid rgba(130, 199, 255, 1);
      color: #82c7ffff;
      cursor: pointer;
      transition: all 0.3s;
      &:first-child {
        border-radius: 4px 0 0 4px;
        border-right: none;
      }
      &:last-child {
        border-radius: 0px 4px 4px 0px;
        border-left: none;
      }
    }

    .active {
      background: #41aaff;
      color: white;
    }
  }
  .sec-content {
    padding: 0 10px;
    li {
      .opinion-item {
        height: auto;
        transition: all 0.4s;
        position: relative;
        padding-left: 30px;
        .peoples {
          overflow: hidden;
        }

        .mb {
          margin-bottom: 12px;
        }
        .left-index {
          position: absolute;
          left: 5px;
          height: 100%;
          span {
            position: absolute;
            top: 7px;
            left: -4px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            text-align: center;
            z-index: 1;
          }
          .index {
            background: rgba(238, 238, 238, 1);
            color: #606266ff;
          }
          .forefront {
            background: #41aaff;
            color: white;
          }
          .border {
            position: relative;
            top: 7px;
            width: 1px;
            background: rgba(238, 238, 238, 1);
            height: 100%;
          }
        }
        &:last-child {
          .left-index {
            .border {
              width: 0;
            }
          }
        }

        .date {
          font-size: 12px;
          color: #909399ff;
          .dian {
            font-size: 30px;
            line-height: 0px;
            vertical-align: -5px;
            margin-right: 3px;
          }
        }
        .user-msg {
          display: flex;
          align-items: center;
          .head-img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .opinions {
          margin-bottom: 15px;
        }
        .ant-input {
          min-height: 40px;
          resize: none;
          color: #303133ff;
          background: rgba(245, 247, 250, 1);
          border: none;
        }
        .enclosure {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          .noHas {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 20px;
            width: 44px;
            height: 24px;
            background: rgba(96, 98, 102, 0.2);
            color: rgba(96, 98, 102, 1);
            border-radius: 12px;
          }
          .Has {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 20px;
            width: 44px;
            height: 24px;
            color: rgba(98, 194, 50, 1);
            border-radius: 12px;
            background: rgba(98, 194, 50, 0.2);
          }
        }
      }
    }
    .approval,
    .crculation {
      position: relative;
      min-height: 300px;
      padding: 0 10px;
    }
    .approval {
      .opinion-list {
        padding: 0 10px;
      }
    }
    .approval {
      .r-content {
        max-height: 560px;
        overflow-y: auto;
      }
    }
    .crculation {
      position: relative;
      .title {
        padding-left: 9px;
        border-left: 3px solid #0082ef;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        font-size: 16px;
        color: #303133;
        height: 22px;
        margin-left: -20px;
        margin-bottom: 20px;
      }
      .r-content {
        padding: 0 10px 0 15px;
        max-height: 560px;
        overflow-y: auto;
      }
      .content {
        .r-textarea {
          position: relative;
          border: 1px solid #dcdfe6;
          .textarea-num {
            color: #c0c6cc;
            position: absolute;
            bottom: 4px;
            right: 4px;
          }
          textarea {
            width: 100%;
            height: 140px;
            resize: none;
            border: none;
            box-shadow: none;
          }
        }
        .content-btn {
          text-align: right;
          margin-top: 16px;
        }
      }
      .record {
        margin-top: 50px;
      }
    }
  }
}
.jiedian {
  color: #303133ff;
  font-size: 16px;
}

.submitter {
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #303133ff;
  font-size: 14px;
}
.opinion {
  display: flex;
  width: 100%;
  min-height: 40px;
  background: rgba(245, 247, 250, 1);
  padding-left: 10px;
}
.opinion-agree {
  min-width: 40px;
  margin-right: 10px;
  line-height: 40px;
}

.flex-align-center {
  flex: 1;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.approver_type {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 20px;
  border: 1px solid #42a2f3;
  color: #0082ef;
  border-radius: 2px;
  margin-left: 11px;
}
</style>