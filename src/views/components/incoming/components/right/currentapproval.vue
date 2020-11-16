<template>
  <div class="current-approval"
       v-if="datas!=''">
    <p class="approval-top-title">紧急程度</p>
    <div class="approval-top-urgent flex-col"
         v-if="manager.process_urgent_level!=''">
      <span class="content-active"
            :class="jj[manager.process_urgent_level].color">{{jj[manager.process_urgent_level].text}}</span>
    </div>
    <p class="approval-top-title">当前审核</p>
    <div class="approval-branchname">{{datas.current.name}}</div>
    <div class="approval-personnel-box">
      <!-- 部门上半部分，人员！ -->
      <template v-for="item in datas.current.username">
        <div class="approval-box-top flex-col border-solids"
             :key="item.userid">
          <img :src="item.avatar"
               alt
               class="approval-top-img" />
          <span :title="item.dname|convertString"
                class="approval-top-username flex-col">
            {{item.name}}
            <span :title="item.dname|convertString">({{item.dname|convertString}})</span>
          </span>
          <div class="flex-col-bd"></div>
          <span class="approval-top-dian"
                :style="`color:${objstatus[item.status].color}`">·</span>
          <span class="approval-top-stuts"
                :style="`color:${objstatus[item.status].color}`">{{objstatus[item.status].text}}</span>
          <div class="approval-top-box">
            <template v-if="item.file!=''">
              <div class="approval-box-bott flex-col"
                   style="color:#C0C4CC;"
                   v-for="file in item.file"
                   :key="file.id">
                <SvgIcon item="enclosure" />
                <span>{{file.old_name}}</span>
                <div class="flex-col-bd"></div>
                <a :href="file.path"
                   :download="file.old_name">
                  <SvgIcon item="dowannex" />
                </a>
              </div>
            </template>
            <div class="approval-box-bott hand"
                 v-if="item.status==2"
                 @click="onApprovalUrge(datas.current.where_id)">
              <SvgIcon item="thumbtack" />
              <span>一键催办</span>
            </div>
          </div>
          <!-- <template v-if="item.transfer!=''"> -->
          <div class="approval-top-box"
               v-for="info in item.transfer"
               :key="info.userid">
            <!-- 部门下半部分，催办 -->
            <div class="approval-box-top flex-col border-solid">
              <SvgIcon item="returns"
                       style="color:#839CCF;padding-right:10px;" />
              <img :src="info.avatar"
                   alt
                   class="approval-top-img" />
              <span class="approval-top-username flex-col">
                {{info.name}}
                <span>({{info.dname|convertString}})</span>
              </span>
              <div class="flex-col-bd"></div>
              <span class="approval-top-dian"
                    :style="`color:${objstatus[info.status].color}`">·</span>
              <span class="approval-top-stuts"
                    :style="`color:${objstatus[info.status].color}`">{{objstatus[info.status].text}}</span>
            </div>
            <!-- 部门下半部分，催办 -->
            <template v-if="info.file!=''">
              <div class="approval-box-bott flex-col"
                   style="color:#C0C4CC;padding-left:26px;"
                   v-for="files in info.file"
                   :key="files.id">
                <SvgIcon item="enclosure" />
                <span>{{files.old_name}}</span>
                <div class="flex-col-bd"></div>
                <a :href="files.path"
                   :download="files.old_name">
                  <SvgIcon item="dowannex" />
                </a>
              </div>
            </template>
            <div class="approval-box-bott hand"
                 style="padding-left:26px;"
                 v-if="info.status==2"
                 @click="onApprovalUrge(datas.current.where_id)">
              <SvgIcon item="thumbtack" />
              <span>一键催办</span>
            </div>
          </div>
          <!-- </template> -->
        </div>
      </template>
    </div>
    <p class="approval-top-title increase">提交人</p>
    <div class="approval-personnel-box">
      <!-- 提交人部门 -->
      <div class="approval-box-top flex-col">
        <img :src="datas.current.applicant.avatar"
             alt
             class="approval-top-img" />
        <span class="approval-top-username flex-col">
          {{datas.current.applicant.name}}
          <span :title="datas.current.applicant.dname|convertString">({{datas.current.applicant.dname|convertString}})</span>
        </span>
      </div>
    </div>
    <p class="approval-top-title"
       v-if="datas.next!=''||datas.prv!=''">上下级处理节点</p>
    <div class="approval-branchname text-color"
         v-if="datas.prv!=''">上一节点：</div>
    <div class="approval-personnel-box box-color"
         v-if="datas.prv!=''">
      <template v-for="item in datas.prv.username">
        <div :key="item.userid">
          <div class="approval-box-title">
            <span>{{datas.prv.name}}</span>
          </div>
          <!-- 部门上半部分，人员！ -->
          <div class="approval-box-top flex-col">
            <img :src="item.avatar"
                 alt
                 class="approval-top-img" />
            <span class="approval-top-username flex-col">
              {{item.name}}
              <span :title="item.dname|convertString">({{item.dname|convertString}})</span>
            </span>
          </div>
        </div>
      </template>
    </div>
    <div class="approval-branchname text-color"
         v-if="datas.next!=''">即将流向：</div>
    <div class="approval-personnel-box box-color"
         v-if="datas.next!=''">
      <div class="approval-box-title flex-col">
        <span>{{datas.next.name}}</span>
        <div>{{datas.next.approver_type==2?'或签':'会签'}}</div>
      </div>
      <!-- 部门上半部分，人员！ -->
      <template v-for="item in datas.next.username">
        <div class="approval-box-top flex-col"
             :key="item.userid">
          <img :src="item.avatar"
               alt
               class="approval-top-img" />
          <span class="approval-top-username flex-col">
            {{item.name}}
            <span :title="item.dname|convertString">({{item.dname|convertString}})</span>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import SvgIcon from '@/views/components/svgicon.vue'
import {
  approval_opinion,
  approval_urge,
  get_approval_around_info,
} from '@/api/incoming.js'
export default {
  name: 'currentApproval',
  data() {
    return {
      datas: '',
      objstatus: {
        1: {
          text: '等待中',
        },
        2: {
          text: '审核进行中',
          color: '#0082EF',
        },
        3: {
          text: '审核通过',
          color: '#0082EF',
        },
        4: {
          text: '审核拒绝',
          color: '#F56C6C',
        },
        5: {
          text: '已撤销',
        },
        6: {
          text: '暂放',
          color: '#f5ac40',
        },
        7: {
          text: '报废',
          color: '#F56C6C',
        },
        8: {
          text: '转审',
          color: '#909399',
        },
      },
      // 审批紧急程度
      jj: {
        1: {
          color: 'normal',
          text: '普通',
        },
        2: {
          color: 'urgent',
          text: '紧急',
        },
        3: {
          color: 'so-urgent',
          text: '加急',
        },
      },
    }
  },
  created() {
    this.AddList()
  },
  props: {
    manager: {
      default: () => {
        return {
          process_urgent_level: '',
        }
      },
    },
  },
  computed: {},
  components: {
    SvgIcon,
  },
  watch: {},
  methods: {
    async AddList() {
      let { data } = await get_approval_around_info({
        data_id: this.$route.query.id,
        details: 2,
      })
      this.datas = data
    },
    async onApprovalUrge(id) {
      let { data } = await approval_urge({
        id: id,
      })
    },
  },
  filters: {
    convertString(text) {
      if (text != undefined && text != '') return text.join(',')
    },
  },
}
</script>

<style lang="less" scoped>
.current-approval {
  padding-bottom: 17px;
  .approval-top-title {
    margin: 24px 0px 0px;
    border-left: 2px solid #0082ef;
    padding-left: 9px;
    color: #303133;
    line-height: 16px;
    font-size: 16px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .increase {
    margin-bottom: 6px;
  }
  // 紧急程度
  .approval-top-urgent {
    padding: 15px 0px 20px;
    border-bottom: 1px solid #e4e7ed;
    .approval-urgent-box {
      line-height: 28px;
      width: 60px;
      text-align: center;
    }
  }
  .approval-branchname {
    color: #303133;
    font-size: 15px;
    margin: 16px 0px 0px;
    padding-left: 11px;
  }
  .text-color {
    color: #606266;
  }
  .approval-personnel-box {
    padding: 1px 1px 16px 11px;
    border-bottom: 1px solid #e4e7ed;
    .approval-box-title {
      padding-top: 10px;
      color: #303133;
      div {
        color: #42a2f3;
        border: 1px solid #42a2f3;
        width: 38px;
        line-height: 20px;
        text-align: center;
        margin-left: 10px;
      }
    }
    .border-solid {
      padding-top: 16px;
      border-top: 1px dashed #dcdfe6;
    }
    .border-solids {
      margin-bottom: 20px;
    }
    .approval-box-top {
      margin-top: 10px;
      flex-wrap: wrap;
      .approval-top-box {
        width: 100%;
      }
      .approval-top-img {
        width: 32px;
        height: 32px;
        margin-right: 5px;
      }
      .approval-top-username {
        color: #303133;
        margin-right: 5px;
        span {
          display: inline-block;
          width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #909399;
        }
      }
      .approval-top-dian {
        height: 20px;
        transform: scale(2.5);
        margin-right: 5px;
        position: relative;
        bottom: 3px;
      }
      .approval-top-stuts {
        font-size: 12px;
      }
    }
    .approval-box-bott {
      color: #0082ef;
      padding: 10px 0px 0px;
      span {
        margin-left: 3px;
        letter-spacing: 1px;
      }
    }
  }
  .box-color {
    background-color: #f8f8f8;
    border: none;
    margin-top: 10px;
    padding-left: 18px;
  }
}
.content-active {
  font-weight: 500;
  padding: 5px 20px;
  font-size: 16px;
}
</style>