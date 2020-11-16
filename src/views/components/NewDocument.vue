<template>
  <div>
    <!-- :title="TemplatePopup.title" 模板title可以改变的变量，放在这儿，防止后面需要改-->
    <a-modal class="transfer-modal"
             title="全部模板"
             :confirm-loading="confirmLoading"
             @ok="handleOkNew"
             @cancel="handleCancelNew"
             cancelText="取消"
             okText="确认"
             :visible="TemplatePopup.visibles">
      <div class="center">
        <div class="search-box">
          <div style="font-weight:900;">选择模板</div>
          <div>
            <a-input-search v-model="form.name"
                            placeholder="请输入关键字"
                            style="width: 173px"
                            @search="onSearch" />
          </div>
        </div>

        <NotFound v-show="transferlist.length<=0" />
        <div class="list-box"
             v-show="transferlist.length>0">
          <div class="list-box-cl list-box-left"
               v-show="!is_search">
            <template v-for="(item,index) in transferlist">
              <div :class="['list-box-cl-cell hand',index==transferlist_index?'list-box-cl-cell-activ':'']"
                   :key="index"
                   @click="leftclick(index)">
                <div class="flex-col">
                  <img class="list-box-cl-img"
                       src="../../assets/folder.png" />
                  <!-- <a-icon
                    :type="index==transferlist_index?'folder-open':'folder'"
                    class="transfer-icon transferlist-icon"
                    theme="filled"
                  />-->
                  {{item.type}}
                </div>
              </div>
            </template>
          </div>
          <div class="list-box-cl list-box-right">
            <template v-for="(item,index) in transferlistcl">
              <div :class="['list-box-cl-cell hand','flex-col-db',item.id==id?'list-box-cl-cell-activ':'']"
                   :key="index"
                   @click="rightcilck(index,item)">
                <div>
                  <img class="list-box-cl-imgs"
                       src="../../assets/file.png"
                       alt="folder" />
                  <!-- <a-icon
                    :type="index==transferlistcl_index?'file-text':'file'"
                    class="transfer-icon transferlistcl-icon"
                    theme="filled"
                  />-->
                  {{item.temp_name}}
                </div>

                <i @click.stop="colling(item)"
                   :class="['collection',item.is_collect==1?'colled':'']"></i>
              </div>
            </template>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { GetselectList } from '@/api/public.js'
import { templete_cancel_collect } from '@/api/draft.js'
import NotFound from '@/views/components/notFound.vue'
export default {
  data() {
    return {
      confirmLoading: false,
      transferlist: [],
      transferlistcl: [],
      transferlist_index: 0,
      transferlistcl_index: 0,
      is_collect: null,
      id: '',
      form: {
        name: '',
      },

      is_search: false,
    }
  },
  components: { NotFound },
  props: ['TemplatePopup'],
  computed: {
    text() {
      return this.TemplatePopup.type
    },
  },
  watch: {
    text(v) {
      this.getselectList()
    },
  },
  created() {
    this.getselectList()
  },
  methods: {
    // 获取列表内容
    getselectList() {
      GetselectList({
        type: this.TemplatePopup.type,
        all: 1,
        kwd: this.form.name,
      }).then((res) => {
        if (res.is_select == 0) {
          this.is_search = false
          if (this.TemplatePopup.templateNum) {
            let _num = 0
            res.data.forEach((item) => {
              if (item.list) {
                _num += item.list.length
              }
            })
            this.$emit('Tips', _num)
          }
          this.transferlist = res.data
          if (
            this.transferlist.length > 0 &&
            this.transferlist[this.transferlist_index].list
          ) {
            this.transferlistcl = this.transferlist[
              this.transferlist_index
            ].list
            //根据获取到的数据中收藏选项添加flag
            this.transferlist.map((v) => {
              v.list.map((v) => {
                if (v.is_collect == 0) {
                  v.flag = false
                } else {
                  v.flag = true
                }
              })
            })
          } else {
            this.transferlist.map((v) => {
              if (v.is_collect == 0) {
                v.flag = false
              } else {
                v.flag = true
              }
            })
          }
        } else {
          this.is_search = true
          this.transferlistcl = JSON.parse(JSON.stringify(res.data))
        }
      })
    },
    // 点击收藏之后刷新页面
    getallSelect() {
      GetselectList({
        type: this.TemplatePopup.type,
        kwd: this.form.name,
      }).then((res) => {
        this.$emit('getcollectDocument', { data: res.data })
        this.getselectList()
      })
    },
    //   确定
    handleOkNew(e) {
      this.confirmLoading = true
      this.visible = false
      this.confirmLoading = false
      if (this.id == '') {
        this.$warning({
          title: '提示',
          content: (
            <div>
              <p>请选择模板!</p>
            </div>
          ),
        })
      } else {
        let query = {
          id: this.id,
          file_id: this.TemplatePopup.file_id,
          type: this.TemplatePopup.type2,
        }
      
        //公文接收用到的
        if (this.TemplatePopup.distribute_id) {
          query = {
            id: this.id,
            file_id: this.TemplatePopup.file_id,
            type: this.TemplatePopup.type2,
            distribute_id: this.TemplatePopup.distribute_id,
          }
        }

        this.$router.push({
          path: '/draft/addDraft',
          query,
        })
      }
    },
    // 取消
    handleCancelNew(e) {
      this.$emit('delNewDoucument')
    },
    //模板收藏
    async colling(item) {
      let new_is_collect = ''
      if (item.is_collect == 0) {
        new_is_collect = 1
      } else {
        new_is_collect = 0
      }
      let data = await templete_cancel_collect({
        id: item.id,
        lab: new_is_collect,
        type: this.TemplatePopup.type,
      })
      this.getallSelect()
    },
    // 点左边选项
    leftclick(e) {
      this.transferlist_index = e
      this.transferlistcl = this.transferlist[e].list
      this.transferlistcl_index = 0
    },
    // 点右边内容
    rightcilck(e, val) {
      this.transferlistcl_index = e
      this.id = val.id
    },
    onSearch() {
      this.getselectList()
    },
  },
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-title {
  font-weight: 900;
}
.intext {
  color: #909399;
  font-size: 12px;
}
.transfer-modal {
  /deep/ .ant-modal {
    width: 800px !important;
    z-index: 100;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
  }
  .list-box {
    margin-top: 15px;
    height: 257px;
    border: 1px solid #ebeef5;
    display: flex;
    .list-box-cl {
      width: 50%;
      height: 100%;
      overflow: auto;
      padding: 0 2px;
      .list-box-cl-img {
        width: 24.3px;
        height: 21.5px;
        margin: 0 11px;
      }
      .list-box-cl-imgs {
        width: 21px;
        height: 22.7px;
        margin: 0 11px 0 3px;
      }
      .list-box-cl-cell {
        height: 40px;
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .transfer-icon {
          font-size: 24px;
          margin: 0 10px;
        }
        .transferlist-icon {
          color: #e6b821;
        }
        .transferlistcl-icon {
          color: #6fb9f6;
        }
      }
      .list-box-cl-cell-activ {
        background-color: #f2f7ff;
      }
    }
    .list-box-left {
      flex: 1;
    }
    .list-box-right {
      border-left: 1px solid #ebeef5;
      flex: 1;
    }
  }
}
.flex-col-db {
  padding: 0 20px 0 10px;
  .collection {
    width: 14px;
    height: 14px;
    background: url('../../assets/adddraft/collection-no.png');
    background-size: 14px 14px;
  }
  .colled {
    width: 14px;
    height: 14px;
    background: url('../../assets/adddraft/collection.png');
    background-size: 14px 14px;
  }
}

.center {
  min-height: 400px;
}
</style>