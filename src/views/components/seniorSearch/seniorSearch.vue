<template>
  <div class="seniorSearch">
    <div class="seniorSearchinbox">
      <!-- 选中的分类导航 -->
      <div class="seniorSearch-classification-box flex-col"
           v-if="Object.keys(obj.one).length">
        <div class="seniorSearch-classification-box-left flex-col"
             v-for="(v,k) in obj.one"
             :key="k">
          {{k}}：
          <span style="color:#F56C6C;">{{v.intext}}</span>
          <img class="seniorSearch-classification-box-left-img"
               @click="onDelete(k)"
               src="../../../assets/adddraft/x.png" />
        </div>
      </div>
      <!-- 分类导航选项 -->
      <div class="seniorSearch-classification-centen flex-col"
           v-if="obj.dhOnoff!=1">
        <div class="seniorSearch-classification-centen-left">
          <a-dropdown>
            <a class="seniorSearch-classification-centen-left-text">
              模板分类
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay"
                    class="overlay">
              <template v-for="item in tow">
                <a-menu-item v-if="!item.list.length"
                             :key="item.type">{{item.type}}</a-menu-item>
                <a-sub-menu v-else
                            :key="item.type"
                            :title="item.type">
                  <a-menu-item v-for="info in item.list"
                               :key="info.id"
                               @click="onclicks(item.type+' > '+info.temp_name,info.id,'模板分类')">{{info.temp_name}}</a-menu-item>
                </a-sub-menu>
              </template>
            </a-menu>
          </a-dropdown>
        </div>
        <span :class="mbtext==''?'centen-cen hand':'centen-cens hand'"
              @click="onTemTed">不限</span>
        <div class="seniorSearch-classification-centen-right">{{mbtext}}</div>
      </div>
      <!-- 单位和字号 -->
      <div class="seniorSearch-classification-bott flex-col"
           v-for="(item,num) in obj.tree"
           :key="(num+1)*100">
        <div class="seniorSearch-classification-bott-left">{{item.title}}</div>
        <a-input v-model="item.intext"
                 @pressEnter="pressEnter(num)"
                 @blur="pressEnter(num)"
                 class="seniorSearch-classification-bott-input"
                 :placeholder="`请输入${item.title}名称`"
                 :maxLength="20" />
      </div>
      <!-- 选择人员 -->
      <div class="seniorSearch-classification-bott flex-col"
           v-for="(item,index) in obj.two"
           :key="item.title">
        <div class="seniorSearch-classification-bott-left">{{item.title}}</div>
        <div class="seniorSearch-classification-bott-input flex-col">
          <template v-if="item.info.length">
            <div class="input-box flex-col"
                 v-for="(info,num) in item.info"
                 :key="info.value">
              {{info.title}}
              <a-icon @click="onDeltname(info.value,index,num)"
                      class="box-icon"
                      type="close" />
            </div>
          </template>
          <div v-else
               class="input-text">请选择{{item.title}}</div>
          <img src="../../../assets/adddraft/member.png"
               @click="onPersonnelSwitch(index)" />
        </div>
      </div>
      <!-- 时间数据 -->
      <div class="seniorSearch-classification-bott flex-col"
           v-for="(info,numbers) in obj.condition"
           :key="numbers">
        <div class="seniorSearch-classification-bott-left">{{info.text}}</div>
        <div v-for="(itme,index) in info.chlid"
             :class="index==obj.timenum[numbers].num?'classification-bott-centen hand':'classification-bott-right hand'"
             :key="index"
             @click="onTime(index,numbers,info.text)">{{itme.text}}</div>
        <a-range-picker v-model="obj.timenum[numbers].time"
                        :default-value="[moment(obj.timenum[numbers].time[0], dateFormat),moment(obj.timenum[numbers].time[1], dateFormat)]"
                        class="seniorSearch-classification-bott-time"
                        @change="onChange(numbers,info.text)" />
      </div>
      <a-modal :visible="visible"
               :confirm-loading="confirmLoading"
               @ok="handleOk_ren"
               @cancel="visible = false"
               title="选择人员"
               class="circulation"
               cancelText="取消"
               okText="确定">
        <Framelist :show_data_flag="visible"
                   :range="visiblerange"
                   :tag="tag"
                   :restype="4" />
      </a-modal>
      <div class="flex-col seniorSearch-classification-box-btn-box">
        <div class="flex-col-bd"></div>
        <a-button class="seniorSearch-classification-box-btn"
                  type="primary"
                  @click="chonghzi">重置</a-button>
        <a-button class="seniorSearch-classification-box-btn"
                  type="primary"
                  @click="onSearch">搜索</a-button>
        <div class="flex-col-bd"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Framelist from '@/views/sendout/draft/addcompoents/components/organization/framelist.vue'
import { GetselectList } from '@/api/public.js'
import { getDates } from '@/js/public.js'
import moment from 'moment'
export default {
  name: 'seniorSearch',
  data() {
    this.dateFormat = 'YYYY-MM-DD'
    return {
      // obj: {
      //   // 最上层搜索条件
      //   one: {},
      //   tree: [
      //     {
      //       title: "发文单位",
      //       intext: ""
      //     },
      //     {
      //       title: "拟稿人",
      //       intext: ""
      //     }
      //   ],
      //   // 日期选择
      //   condition: [
      //     {
      //       text: "拟稿时间",
      //       chlid: [
      //         { text: "不限" },
      //         { text: "近一周" },
      //         { text: "近一月" },
      //         { text: "近三月" }
      //       ]
      //     },
      //     {
      //       text: "创建时间",
      //       chlid: [
      //         { text: "不限" },
      //         { text: "近一周" },
      //         { text: "近一月" },
      //         { text: "近三月" }
      //       ]
      //     }
      //   ],
      //   // 日期选择后结果
      //   timenum: [
      //     { num: 0, text: "拟稿日期", time: [] },
      //     { num: 0, text: "创建时间", time: [] }
      //   ],
      //   // 模板type
      //   num: 1
      // },
      // 选择人员弹窗开关
      visible: false,
      // 模板数据
      tow: [],
      // 模板分类右边显示
      mbtext: '',
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      // 数据加载中
      confirmLoading: false,
      tag: {
        tab: true,
        pe: true,
        bm: true,
      },
      // 打开弹窗的元素下标
      selectPeople: '',
    }
  },
  props: ['obj'],
  created() {},
  mounted() {
    this.addGetselectList()
  },
  methods: {
    moment,
    // 用户触发事件函数
    // ------------------------------------------------------------------------------
    // 时间点击下标配置
    onTime(v, s, text) {
      this.obj.timenum[s].num = v
      if (v == 0) {
        this.obj.timenum[s].time = []
        this.$delete(this.obj.one, text)
      } else {
        let result = []
        let index
        if (v == 1) {
          index = 7
        } else if (v == 2) {
          index = 30
        } else {
          index = 90
        }
        let num = Date.parse(new Date()) - this.time(index)
        result[1] = getDates()
        result[0] = getDates(num)
        this.$set(this.obj.one, text, {
          intext: `${result[0]} ~ ${result[1]}`,
          arry: [
            Date.parse(result[0]) / 1000,
            Date.parse(result[1]) / 1000 + 86399,
          ],
        })
        this.obj.timenum[s].time[0] = result[0]
        this.obj.timenum[s].time[1] = result[1]
      }
    },
    // 点击选中人员的x，删除选中人员名称
    onDeltname(id, index, num) {
      this.obj.two[index].info.splice(num, 1)
      let _title = ''
      let _id = ''
      this.obj.two[index].info.forEach((el) => {
        if (_title == '') {
          _title += el.title
          _id += el.value
        } else {
          _title += `,${el.title}`
          _id += `,${el.value}`
        }
      })
      if (_id == '') {
        this.$delete(this.obj.one, this.obj.two[index].title)
      } else {
        // 加入到one对象里在最上面显示出来
        this.$set(this.obj.one, this.obj.two[index].title, {
          intext: _title,
          id: _id,
        })
      }
    },
    // 点击图标，打开选择人员弹窗
    onPersonnelSwitch(index) {
      // 下标赋值给data元素，全局可以使用
      this.selectPeople = index
      // 重置弹窗里的数据
      this.visiblerange.visual = []
      // 把外面的数据添加到弹窗里显示
      this.obj.two[index].info.forEach((info) => {
        this.visiblerange.visual.push(info)
      })
      // 打开弹窗
      this.visible = true
    },
    // 选择人员确定按钮
    handleOk_ren() {
      if (this.visiblerange.visual.length > 10) {
        this.$message.warning('最多支持选择10人')
        return
      }
      this.obj.two[this.selectPeople].info = []
      this.visiblerange.visual.forEach((info) => {
        this.obj.two[this.selectPeople].info.push(info)
      })
      let _title = ''
      let _id = ''
      this.obj.two[this.selectPeople].info.forEach((el) => {
        if (_title == '') {
          _title += el.title
          _id += el.value
        } else {
          _title += `,${el.title}`
          _id += `,${el.value}`
        }
      })
      // 加入到one对象里在最上面显示出来
      this.$set(this.obj.one, this.obj.two[this.selectPeople].title, {
        intext: _title,
        id: _id,
      })
      // 关闭选人弹窗
      this.visible = false
    },
    // 重置按钮
    chonghzi() {
      // 清空头部数据表
      this.obj.one = {}
      // 输入框重置
      this.obj.tree.forEach((e) => {
        e.intext = ''
      })
      // 模板文字重置
      this.mbtext = ''
      // 日期重置
      this.obj.timenum.forEach((e) => {
        e.time = []
        e.num = 0
      })
      this.obj.two.forEach((e) => {
        e.info = []
      })
    },
    // 计算时间函数
    time(num) {
      return num * 60 * 60 * 24 * 1000
    },
    // 搜索按钮
    onSearch() {
      this.$emit('oninSearch')
    },
    // 点击头部里面的差去掉内容
    onDelete(text) {
      let _onOff = true
      this.obj.tree.forEach((item) => {
        if (item.title == text) {
          item.intext = ''
          _onOff = false
        }
      })
      if (_onOff) {
        this.obj.two.forEach((item) => {
          if (item.title == text) {
            item.info = []
            _onOff = false
          }
        })
      }
      if (_onOff) {
        this.obj.timenum.forEach((item) => {
          if (item.text == text) {
            item.time = []
            item.num = 0
          }
        })
      }

      this.$delete(this.obj.one, text)
    },
    // 选择模板分类e
    onclicks(text, id, title) {
      this.$set(this.obj.one, title, { intext: text, id: id })
      this.mbtext = text
    },
    // 点击模板不限
    onTemTed() {
      this.mbtext = ''
      this.$delete(this.obj.one, '模板分类')
    },
    // 事件变化
    onChange(index, keys) {
      if (this.obj.timenum[index].time != '') {
        let result = []
        this.obj.timenum[index].num = 1000
        result[0] = getDates(this.obj.timenum[index].time[0]._d)
        result[1] = getDates(this.obj.timenum[index].time[1]._d)
        this.$set(this.obj.one, keys, {
          intext: `${result[0]} ~ ${result[1]}`,
          arry: [
            Date.parse(result[0]) / 1000,
            Date.parse(result[1]) / 1000 + 86399,
          ],
        })
      }
    },
    // 输入框添加到顶层数据
    pressEnter(v) {
      if (this.obj.tree[v].intext.trim() == '') {
        this.$delete(this.obj.one, this.obj.tree[v].title)
      } else {
        this.$set(this.obj.one, this.obj.tree[v].title, {
          intext: this.obj.tree[v].intext,
        })
      }
    },
    // 获取模板分类数据
    addGetselectList() {
      GetselectList({ all: 1, type: this.obj.num }).then((data) => {
        this.tow = data.data
      })
    },
  },
  computed: {
    numbers() {
      return this.obj.num
    },
  },
  watch: {
    numbers(v) {
      this.addGetselectList()
    },
  },
  components: {
    Framelist,
  },
}
</script>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 793px !important;
}
.seniorSearch {
  position: absolute;
  width: 1030px;
  z-index: 2;
  .seniorSearchinbox {
    padding: 24px 24px 10px;
    border: 1px solid #e6e6e6;
    background: #ffffff;
  }
  // 选中的分类导航
  .seniorSearch-classification-box {
    position: relative;
    flex-wrap: wrap;
    margin-bottom: 8px;
    .seniorSearch-classification-box-left {
      padding: 0 15px;
      line-height: 28px;
      background: #f0f2f5;
      border-radius: 14px;
      margin: 0 20px 10px 0px;
      color: #303133;
      .seniorSearch-classification-box-left-img {
        width: 12px;
        height: 12px;
        margin-left: 10px;
      }
    }
  }
  // 分类导航选项
  .seniorSearch-classification-centen {
    margin-bottom: 13px;
    flex-wrap: wrap;
    padding-left: 138px;
    position: relative;
    height: 26px;
    .seniorSearch-classification-centen-left {
      color: #303133;
      position: absolute;
      left: 0px;
      top: 5px;
      line-height: 26px;
      .seniorSearch-classification-centen-left-text {
        color: #303133;
      }
    }
    .centen-cen {
      color: #0082ef;
      position: absolute;
      left: 90px;
      top: 5px;
      line-height: 26px;
    }
    .centen-cens {
      position: absolute;
      left: 90px;
      top: 5px;
      line-height: 26px;
      color: #303133;
    }
    .seniorSearch-classification-centen-right {
      padding: 0 8px;
      color: #303133;
      background: #f0f2f5;
      line-height: 26px;
      margin: 5px 20px 5px 0px;
    }
  }
  // 单位和字号
  .seniorSearch-classification-bott {
    min-height: 51px;
    padding: 10px 0px;
    border-top: 1px dashed #e8e8e8;
    position: relative;
    .seniorSearch-classification-bott-left {
      color: #303133;
      margin-right: 30px;
      width: 60px;
    }
    .seniorSearch-classification-bott-input {
      display: flex;
      flex-wrap: wrap;
      width: 432px;
      min-height: 36px;
      border-radius: 0px;
      border: 1px solid #d9d9d9;
      position: relative;
      img {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 10px;
      }
    }
    // 选择人员的人员样式
    .input-box {
      margin-top: 5px;
      margin-bottom: 5px;
      padding: 0 10px;
      border: 1px solid #d9d9d9;
      line-height: 20px;
      margin-left: 8px;
      border-radius: 3px;
      background: #fafafa;
      .box-icon {
        font-size: 10px;
        margin-left: 3px;
      }
    }
    // 选择人员没有人员时候的样式
    .input-text {
      margin-left: 8px;
      color: #cecece;
    }
    .classification-bott-centen {
      color: #0082ef;
      margin-right: 22px;
    }
    .classification-bott-right {
      margin-right: 22px;
      color: #303133;
    }
    .seniorSearch-classification-bott-time {
      height: 28px;
    }
  }
  .seniorSearch-classification-box-btn-box {
    height: 50px;
    .seniorSearch-classification-box-btn {
      height: 28px;
      padding: 0 10px;
      margin-right: 16px;
    }
  }
}
.overlay {
  min-width: 150px;
  position: relative;
  right: 20px;
  top: 10px;
}
</style>