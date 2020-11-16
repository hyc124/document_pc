<template>
  <div class="main">
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div class="header flex-col">
        <div class="searchBox flex-col flex-col-bd">
          <a-input-search placeholder="请输入关键字"
                          v-model="Searchterms"
                          enter-button
                          style="width: 260px"
                          @search="onSearch"
                          :maxLength="20" />
          <span class="open-search"
                @click="change_search">
            {{SearchTriangle?"高级搜索":"收起搜索"}}
            <i class="triangle"
               v-if="SearchTriangle"></i>
            <i class="triangle-top"
               v-else></i>
          </span>
        </div>
        <div class="flex-col">
          <a-button @click="showModal"
                    type="primary">新建</a-button>
        </div>
      </div>
      <SeniorSearch class="SeniorSearch"
                    :obj="obj"
                    @oninSearch="oninSearch"
                    ref="searchDetail" />
      <!-- 用章 -->
      <div class="contentBox"
           :style="{height:`${height + 65 + 12}px`}"
           :scroll="{ y: height }">

        <!-- <div class="allChoise"> -->
        <!-- <a-checkbox @change="allChoise" :checked="quanChoise">全选</a-checkbox> -->
        <!-- <span v-if="sealNum.length!=0">已选:{{sealNum.length}}个签章</span> -->
        <!-- </div> -->
        <NotFound v-show="sealList.length==0" />
        <div class="seal">
          <div class="sealList"
               v-for="(item,index) in sealList"
               :key="index"
               :class="item.show?'': 'addBorderStyle'">
            <div class="sealShow">
              <img :src="`data:image/jpeg;base64,${item.img_data}`"
                   alt />
              <!-- 选中项 -->
              <div class="choiseCheck"
                   v-show="!item.show">
                <a-icon type="check"
                        class="choiseIcon" />
              </div>
            </div>
            <div class="sealType">
              <div class="sealUser">
                <span>{{item.name}}</span>
                <div class="showFun"
                     v-if="[1,2].includes(item.auth)">
                  <a-icon type="ellipsis" />
                  <!-- 展示框 -->
                  <div class="funBox">
                    <div @click="editSeal(item.id)"
                         v-if="[1,2].includes(item.auth)">编辑</div>
                    <div @click="deleteSeal(item.id)"
                         v-if="[1].includes(item.auth)">删除</div>
                  </div>
                </div>
              </div>
              <div class="creName">
                {{item.create_user_name}}
                <span class="division">|</span>
                {{item.time}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择用户 -->
      <a-modal ref="used"
               class="transfer-modal"
               title="选择创建人"
               :visible="choiseCreat"
               :confirm-loading="confirmLoading"
               @ok="choiseOk"
               @cancel="choiseCancel"
               cancelText="取消"
               okText="确认">
        <Framelist :range="CCpersonradio.tagsrange"
                   :tag="{tags:false,tab:true,pe:true,bm:false}"
                   :restype="4"></Framelist>
      </a-modal>
      <div class="footer">
        <Pagetion @pageChange="pagechangepathget"
                  @currentchange="currentchangepathget"
                  :paging="paging"
                  class="Page" />
      </div>
    </Maincontent>
  </div>
</template>
<script>
import SeniorSearch from '@/views/components/seniorSearch/seniorSearch.vue'
import Maintitle from '@/views/components/maintitle.vue'
import Maincontent from '@/views/components/maincontent.vue'
import Pagetion from '@/views/components/Pagination.vue'
import { getEle, deleteEle, myEleList } from '@/api/allsignatrue.js'
import { Calculatedaltitude, HttpUrl } from '@/js/public.js'
import Framelist from '@/views/applicationset/postset/postflowpathset/components/framelist.vue' //选择人员
import NotFound from '@/views/components/notFound.vue'
export default {
  name: 'main',
  components: {
    Maintitle,
    Maincontent,
    Pagetion,
    Framelist,
    SeniorSearch,
    NotFound,
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false, // 返回开关
      },
      timevalue: [],
      CCpersonradio: {
        tagsrange: {
          visual: [], //打开了获取到的数组
        },
      },
      choiseCreat: false,
      confirmLoading: false, // 弹窗确认按钮加载动画
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      hightSeach: false,
      choiseName: '',
      // 搜索
      name: '',
      SearchTriangle: true, // 高级搜索开关
      type: '', //1公司2单位3个人
      create_start_time: '',
      create_end_time: '',
      value: '',
      create_user_id: '', //创建人的id
      //end
      height: 0,
      Searchterms: '', //搜索
      sealList: [],
      paging: {
        total: null,
        current: 1,
        pageSize: 10,
      },
      // sealNum: [], //选中的章的数量
      // quanChoise: false, //全选按钮
      //展开/收起搜索
      search_flag: false,
      //搜索分类导航
      search_class_nav: 1,
      obj: {
        // 最上层搜索条件
        one: {},
        two: [
          {
            title: '创建人',
            info: [],
          },
        ],
        tree: [
          {
            title: '签章类型',
            intext: '',
          },
        ],
        // 日期选择
        condition: [
          {
            text: '创建时间',
            chlid: [
              { text: '不限' },
              { text: '近一周' },
              { text: '近一月' },
              { text: '近三月' },
            ],
          },
        ],
        // 日期选择后结果
        timenum: [{ num: 0, text: '创建时间', time: [] }],
        // 模板type
        num: 1,
        // 关闭模板分类
        dhOnoff: 1,
      },
      HttpUrl, // 服务器地址
    }
  },
  props: ['status'],
  mounted() {
    this.height = Calculatedaltitude(10, 60, 54, 59)
    this.getEleList()
  },
  methods: {
    choiseOk() {
      if (this.CCpersonradio.tagsrange.visual.length > 1) {
        this.$message.error(`只能选择一个人`)
        return
      }
      this.choiseName = this.CCpersonradio.tagsrange.visual[0].title
      this.create_user_id = this.CCpersonradio.tagsrange.visual[0].value
      this.choiseCreat = false
      this.visiblerange.visible = false
      this.visiblerange.visuals = JSON.parse(
        JSON.stringify(this.visiblerange.visual)
      )
    },
    // 高级搜索
    oninSearch() {
      this.getEleList()
      this.SearchTriangle = true
      this.$refs.searchDetail.$el.style.height = '0px'
    },
    choiseCancel() {
      this.choiseCreat = false
      this.visiblerange.visible = false
      this.visiblerange.visual = JSON.parse(
        JSON.stringify(this.visiblerange.visuals)
      )
    },
    choiseType(e) {
      if (e.target.value == 0) {
        this.value = ''
      } else {
        this.value = e.target.value
      }
    },
    //重置
    reset() {
      this.value = ''
      this.name = ''
      this.type = ''
      this.choiseName = ''
      this.create_start_time = ''
      this.create_end_time = ''
      this.timevalue = []
    },
    //查询
    query() {
      this.$refs.searchDetail.style.height = '0px'
      this.search_flag = false
      this.getEleList()
    },
    //编辑
    editSeal(id) {
      this.$router.push({
        path: '/allsignature/allsignatureEdit',
        query: { ids: id },
      })
    },
    //删除
    deleteSeal(id) {
      let _this = this
      this.$confirm({
        title: '提示',
        okText: '确定',
        cancelText: '取消',
        class: 'test',
        content: (h) => (
          <div style="color:red;">删除后数据不可恢复，是否继续？</div>
        ),
        onOk() {
          let data = new URLSearchParams()
          data.append('ids', id)
          deleteEle(data).then((res) => {
            if (res.code == 1) {
              _this.getEleList()
            }
          })
        },
      })
    },
    // //全选
    // allChoise(e) {
    //   if (e.target.checked) {
    //     this.quanChoise = true;
    //     this.sealList.forEach(item => {
    //       item.show = !true;
    //     });
    //     this.sealNum = this.sealList;
    //   } else {
    //     this.quanChoise = false;
    //     this.sealList.forEach(item => {
    //       item.show = !false;
    //     });
    //     this.sealNum = [];
    //   }
    // },
    //点击选择章
    // choiseSeal(val) {
    //   val.show = !val.show;
    //   //复选框的状态
    //   if (this.sealNum.indexOf(val) == -1) {
    //     this.sealNum.push(val);
    //   } else {
    //     if (this.sealNum !== "") {
    //       for (let i = 0; i < this.sealNum.length; i++) {
    //         if (this.sealNum[i] == val) {
    //           this.sealNum.splice(i, 1);
    //         }
    //       }
    //     }
    //   }
    //   if (this.sealNum.length == this.paging.pageSize) {
    //     this.quanChoise = true;
    //   } else {
    //     this.quanChoise = false;
    //   }
    // },
    //获取列表
    getEleList() {
      let obj = this.obj
      let type = ''
      if (obj.one['签章类型']?.intext.includes('公司')) {
        type = 1
      } else if (obj.one['签章类型']?.intext.includes('单位')) {
        type = 2
      } else if (obj.one['签章类型']?.intext.includes('个人')) {
        type = 3
      }
      if (this.status != 3) {
        getEle({
          name: this.Searchterms, // 名称，模糊匹配
          type: this.type, // 1公司2单位3个人
          status: this.status, // 1全部 2我创建的 3我常用的
          create_start_time: obj.one['创建时间']?.arry[0], // 创建时间开始
          create_end_time: obj.one['创建时间']?.arry[1], // 创建时间结束
          page: this.paging.current, // 当前页
          limit: this.paging.pageSize, // 一页多少条数据
          create_user: obj.one['创建人']?.id, // 高级搜索创建人
        }).then((res) => {
          if (res.code == 1) {
            this.paging.total = res.data.count
            this.sealList = res.data.datas
            this.sealList.forEach((item) => {
              item['show'] = true
              item.time = item.time.slice(0, 10)
            })
          }
        })
      } else {
        myEleList({
          name: this.Searchterms, // 名称，模糊匹配
          type: this.type, // 1公司2单位3个人
          create_start_time: obj.one['创建时间']?.arry[0], // 创建时间开始
          create_end_time: obj.one['创建时间']?.arry[1], // 创建时间结束
          page: this.paging.current, // 当前页
          limit: this.paging.pageSize, // 一页多少条数据
          create_user: obj.one['创建人']?.id, // 高级搜索创建人
        }).then((res) => {
          if (res.code == 1) {
            this.paging.total = res.data.count
            this.sealList = res.data.datas
            this.sealList.forEach((item) => {
              item['show'] = true
              item.time = item.time.slice(0, 10)
            })
          }
        })
      }
    },
    //新建
    showModal() {
      this.$router.push({ path: '/allsignature/allsignatureadd' })
    },
    onChange(value, dateString) {
      this.timevalue = value
      this.create_start_time = dateString[0]
      this.create_end_time = dateString[1]
    },
    // 重置高级搜索数据
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
    },
    //搜索
    onSearch() {
      this.chonghzi()
      this.getEleList()
    },
    //显示/收起搜索
    change_search() {
      if (this.SearchTriangle) {
        this.$refs.searchDetail.$el.style.height = 'auto'
      } else {
        this.$refs.searchDetail.$el.style.height = '0px'
        this.getEleList()
      }
      this.SearchTriangle = !this.SearchTriangle
    },
    // 页码发生变化
    pagechangepathget(val) {
      this.paging.current = val
      // this.quanChoise = false;
      // this.sealNum = [];
      this.getEleList()
    },
    // 每页条数发生变化
    currentchangepathget(val) {
      this.paging.current = 1
      this.paging.pageSize = val
      // this.quanChoise = false;
      // this.sealNum = [];
      this.getEleList()
    },
  },
}
</script>
<style lang="less" scoped>
.main {
  height: 100%;
}
.header {
  position: relative;
  background-color: #fff;
  width: 100%;
  padding: 0 20px;
  justify-content: space-between;
  height: 60px;
  .headerbtn {
    border-radius: 0px 4px 4px 0px;
    margin-left: -2px;
    height: 32px;
  }
  /deep/.ant-input-wrapper.ant-input-group .ant-btn-primary {
    color: #dadadb;
    background-color: #fff;
    border-color: #dadadb;
  }
}
.SeniorSearch {
  height: 0px;
  transition: all 0.1s linear;
  overflow: hidden;
  top: 60px;
  width: 100%;
}
/deep/ .ant-input {
  border-radius: 4px 0px 0px 4px;
}
.searchBox {
  line-height: 32px;
}
.open-search {
  margin-left: 10px;
  cursor: pointer;
  color: #0082ef;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  .triangle {
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-top: 4px solid #b4bccc;
    border-bottom: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    top: 14px;
    left: 54px;
  }
  .triangle-top {
    width: 0;
    height: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-bottom: 4px solid #b4bccc;
    border-top: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    top: 9px;
    left: 54px;
  }
}

.input {
  width: 332px;
  margin-left: 10px;
}
.Dottedline {
  height: 20px;
  border-right: 1px dashed #ababab;
  margin: 0px 14px 0px 16px;
}
.Printing {
  margin-right: 8px;
}
//用章
.contentBox {
  position: relative;
  // background-color: #faf7fa;
  overflow-y: scroll;
  .choiseCheck {
    position: absolute;
    right: 0;
    top: -1px;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-top: 20px solid #41aaff;
    border-right: 20px solid #41aaff;
    .choiseIcon {
      position: absolute;
      bottom: -2px;
      right: -18px;
      color: #fff;
      font-size: 15px;
    }
  }
  // .allChoise {
  //   padding-left: 45px;
  //   padding-top: 10px;
  //   span {
  //     color: #909399;
  //   }
  // }
}
.seal {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 43px 0;
  div:nth-child(4n + 1) {
    margin-left: 0;
  }
  cursor: pointer;
  .sealList {
    border: 1px solid #fff;
    margin-left: 57px;
    margin-bottom: 56px;
    position: relative;
    width: 200px;
    .sealShow {
      position: relative;
      width: 198px;
      height: 147px;
      background-color: #fff;
      border-radius: 2px 2px 0px 0px;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 118px;
        height: 118px;
      }
    }
    .sealType {
      width: 100%;
      height: 63px;
      background-color: #fff;
      padding-left: 12px;
      padding-right: 5px;
      box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.06);
      position: relative;
      z-index: 1;
      .sealUser {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 600;
        height: 35px;
        line-height: 37px;
        span {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .creName {
        font-size: 11px;
        color: #909399;
      }
      .division {
        padding: 0 10px;
      }
    }
    .showFun {
      width: 24px;
      height: 14px;
      line-height: 14px;
      margin-top: 13px;
      text-align: center;
      background-color: #f2f2f2;
      &:hover > .funBox {
        display: inline-block;
      }
      .funBox {
        position: absolute;
        right: 0;
        top: 28px;
        padding: 0 10px;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        font-size: 12px;
        display: none;
        div {
          text-align: center;
          width: 30px;
          line-height: 30px;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
}
/deep/ .maincontent {
  position: relative;
  background-color: #f8f8f8;
  padding: 0;
  overflow-y: auto;

  /deep/.Page {
    position: absolute;
    left: 0;
    bottom: 0px;
    background-color: #fff;
  }
}
.addBorderStyle {
  border: 1px solid #41aaff !important;
}
.search-detail {
  position: absolute;
  left: 0;
  top: 60px;
  height: 0px;
  width: 100%;
  z-index: 100;
  background: white;
  transition: all 0.3s;
  overflow: hidden;
  box-sizing: border-box;
  overflow-y: scroll;

  .s-row {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    border-bottom: 1px dashed rgba(220, 223, 230, 1);
    padding: 10px;
    color: #c0c4ccff;
    font-size: 14px;
    box-sizing: border-box;
    &:last-child {
      margin-bottom: 20px;
    }
    .s-content {
      display: flex;
      align-items: center;
      .item {
        margin-right: 20px;
        display: flex;
        .btns {
          margin: 0 20px;
        }
        &:first-child {
          span {
            &:first-child {
              color: #73cf6cff;
            }
          }
        }
        /deep/.ant-calendar-picker-input {
          width: 280px;
        }
      }
      .draft-date {
        span {
          margin-right: 20px;
        }
      }
    }
    /deep/ .ant-input {
      width: 360px;
    }
    .label {
      width: 100px;
    }
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 246px;
    height: 32px;
    background: rgba(251, 251, 251, 1);
    border: 1px solid rgba(222, 224, 231, 1);
    border-radius: 100px;
    padding: 0 10px;
    span {
      margin-right: 10px;
    }
    .arrow {
      color: #1890ff;
      margin: 0;
    }
    .item {
      margin: 0 5px;
    }
    .nav-delete {
      width: 12px;
      height: 12px;
      // background: url("../../../../assets/addpostset/nav-delete.png") no-repeat;
      background-size: 12px 12px;
    }
  }
  .nav-class {
    .s-content {
      span {
        cursor: pointer;
        margin-right: 20px;
        transition: all 0.3s;
      }
      .active {
        color: #0082efff;
      }
    }
  }
  .drafter {
    .item {
      .person {
        margin-right: 30px;
      }
    }
    .s-content {
      /deep/ .ant-input-search {
        width: 160px;
        .ant-input {
          width: 100%;
          border-radius: 100px;
        }
      }
    }
  }
}
</style>