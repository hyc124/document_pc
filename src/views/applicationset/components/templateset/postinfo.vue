
<template>
  <div class="postinfo">
    <p class="postinfo-title">鼠标选中按住不放可拖动调整顺序</p>
    <div class="ant-checkbox-group">
      <template v-for="(item, index) in list">
        <div class="flex-col" :key="index">
          <div
            class="left hand flex-col"
            :class="{ flag: item.okstyle }"
            :key="item.e_name"
            @mouseover="writeFlag(item)"
            @mouseleave="writeFlagNo1(item)"
          >
            <span class="inleft" v-show="item.titleflag">{{
              item.c_name
            }}</span>
            <div class="left-tishi" v-if="item.e_name == 'word_no'">
              {{ typeText[PostInfo.type] }}后自动生成
            </div>
            <div class="flex-col-bd"></div>
            <a-checkbox
              class="checkboxtext"
              @change="onxuan(item, index, $event)"
              v-show="item.titleflag"
              :defaultChecked="item.is_must == 1"
              >必填</a-checkbox
            >
          </div>
        </div>
      </template>
      <!-- 新增 -->
      <div>
        <draggable
          v-model="custem_arrList"
          v-bind="dragOptions"
          tag="span"
          class="span1"
        >
          <transition-group class="span2">
            <template v-for="(item, index) in custem_arrList">
              <div class="flex-col" :key="index">
                <div
                  class="left hand flex-col"
                  :class="{ flag: item.okstyle }"
                  :key="item.e_name"
                  @mouseover="writeFlag(item)"
                  @mouseleave="writeFlagNo1(item)"
                >
                  <span class="inleft" v-show="item.titleflag">{{
                    item.c_name
                  }}</span>
                  <span class="inlefttow" v-show="item.titleflag">{{
                    inText(item.typeState)
                  }}</span>
                  <a-input
                    placeholder="请输入字段名称"
                    class="left-input-one"
                    v-show="item.flag"
                    @mouseover="writeFlagNo(item)"
                    v-model="item.c_name"
                    :maxLength="20"
                  />
                  <a-select
                    :default-value="item.typeState"
                    v-model="item.typeState"
                    v-show="item.flag"
                    class="left-input-two"
                    placeholder="请选择需要填写的内容形式"
                  >
                    <a-select-option
                      v-for="info in DropDownBox"
                      :value="info.id"
                      :key="info.id"
                      >{{ info.text }}</a-select-option
                    >
                  </a-select>
                  <div class="flex-col-bd"></div>
                  <span
                    class="write"
                    v-show="item.writeflag && !item.flag"
                    @click="inpflag(item)"
                  >
                    <a-icon
                      theme="filled"
                      style="margin-left=5px;"
                      type="edit"
                    />编写
                  </span>
                  <span
                    class="okwrite"
                    v-show="item.okflag"
                    @click="okinpflag(item, index)"
                    >保存</span
                  >
                  <div
                    v-if="item.deleflag && !Edit"
                    class="delets flex-col"
                    @click="delets(item, index)"
                  >
                    删除
                  </div>
                  <a-checkbox
                    class="checkboxtext"
                    @change="onxuan(item, index, $event)"
                    v-show="item.titleflag"
                    >必填</a-checkbox
                  >
                </div>
              </div>
            </template>
            <div class="addtext" @click="adds" :key="'adds'">
              <a-icon type="plus" />新增字段
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <p class="cententitle flex-col">常用标签</p>
    <div class="bottboxto flex-col">
      <div
        :class="commonTags == index ? 'inbox inboxs' : 'inbox'"
        v-for="(item, index) in custom"
        :key="item.id"
        @click="common(item, index)"
        :title="item.c_name"
      >
        {{ item.c_name }}
      </div>
    </div>
    <div class="Mask" v-if="Edit"></div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { Getpostinfo, Postinfo } from "@/api/applicationset.js";
export default {
  name: "PostInfo",
  components: {
    draggable,
  },
  props: ["PostInfo"],
  data() {
    return {
      list: [],
      num: 0,
      textList: [],
      document_arr: [],
      custem_arr: [],
      custem_arrList: [],
      is_must: false,
      arr: [],
      arr1: [],
      custom: [],
      place: false,
      dragOptions: [],
      // 选择输入类型下拉框
      DropDownBox: {
        1: {
          id: 1,
          text: "文本",
        },
        5: {
          id: 5,
          text: "组织中选人",
        },
        6: {
          id: 6,
          text: "组织中选单位",
        },
        7: {
          id: 7,
          text: "从组织中选单位+选收发文单位",
        },
      },
      commonTags: 9999,
      typeText: {
        1: "发文",
        2: "收文",
        3: "签报",
      },
    };
  },
  created() {
    this.$bus.$on("worksetgetdocument", (val) => {
      this.$bus.$emit(this.PostInfo.bus, {
        document_arr: this.document_arr,
        custem_arr: this.custem_arr,
      });
    });
    // 判断是新增进来页面还是编辑进来这个页面
    if (this.$route.query.id != undefined) {
      this.getcompileList();
    } else {
      this.getpostinfo();
    }
  },
  computed: {
    Edit() {
      return this.$route.query.edit != undefined;
    },
  },
  methods: {
    inText(key) {
      if (this.DropDownBox[key] == undefined) {
        return "";
      } else {
        return this.DropDownBox[key].text;
      }
    },
    onChange(el) {},
    // 添加
    adds() {
      this.custem_arrList.push({
        c_name: "其他字段",
        typeState: 1,
        value: "G" + this.num + "A",
        new: true,
        flag: false,
        okflag: false,
        okstyle: false,
        titleflag: true,
        writeflag: false,
        deleflag: true,
        checkdeflag: false,
      });
      this.custem_arr.push({
        name: "其他字段",
        is_must: 0,
      });
      this.num++;
    },
    // 删除
    delets(item, index) {
      this.custem_arr.map((v) => {
        // 如果删除的数据和添加到custem_arr中的数据一样 那么就删掉custem_arr中对应的数据
        if (item.c_name == v.name) {
          this.custem_arr.splice(this.custem_arr.indexOf(v), 1);
        }
      });
      item.deleflag = false;
      this.custem_arrList.splice(index, 1);
      this.custem_arr.splice(index, 1);
    },
    // 必选
    onxuan(val, index, e) {
      if (val.new) {
        val.checkdeflag = !val.checkdeflag;
        if (val.checkdeflag) {
          this.custem_arr[index].is_must = 1;
          this.custem_arr[index].name = val.c_name;
        } else {
          this.custem_arr[index].is_must = 0;
        }
      } else {
        val.checkedflag = !val.checkedflag;
        if (val.checkedflag) {
          this.document_arr[index].is_must = 1;
        } else {
          this.document_arr[index].is_must = 0;
        }
      }
    },
    // 前四个默认为1
    createdis_must() {
      setTimeout(() => {
        this.document_arr[0].is_must = 1;
        this.list[0].checkedflag = true;
        this.document_arr[1].is_must = 1;
        this.list[1].checkedflag = true;
        this.document_arr[2].is_must = 1;
        this.list[2].checkedflag = true;
        this.document_arr[3].is_must = 1;
        this.list[3].checkedflag = true;
      }, 300);
    },
    // 获取字段列表
    getpostinfo() {
      Getpostinfo({ type: this.PostInfo.type }).then((res) => {
        // 对数据进行处理
        this.DataProcessing(res.data);
      });
    },
    // 接口数据处理
    DataProcessing(data) {
      data.system.map((v, i) => {
        v.value = i + 1;
        v.flag = false;
        v.writeflag = false;
        v.titleflag = true;
        v.okflag = false;
        v.okstyle = false;
        v.field_id = v.id;
        v.is_must = 0;
        v.checkid = i + 1;
        v.checkedflag = false;
        this.document_arr.push({
          field_id: v.id,
          is_must: 0,
        });
      });
      this.list = data.system;
      data.custom.map((v) => {
        if (v.c_name) {
          this.custom.push(v);
        }
      });
    },
    // 鼠标移入显示编写
    writeFlag(val) {
      val.writeflag = true;
    },
    // 鼠标移出
    writeFlagNo1(val) {
      val.writeflag = false;
    },
    // 鼠标移入
    writeFlagNo(val) {
      val.writeflag = false;
    },
    // 点击编写出现输入框
    inpflag(val) {
      val.okflag = true;
      val.flag = true;
      val.titleflag = false;
      val.writeflag = false;
      val.okstyle = true;
      if (val.c_name == "其他字段") {
        val.c_name = "";
        // val.typeState = undefined;
      }
    },
    // 完成
    okinpflag(val, index) {
      if (val.c_name == "") {
        this.place = true;
        this.$message.warning("请您输入字段名称");
        return false;
      }

      if (val.typeState == "" || !val.typeState) {
        this.$message.warning("请您选择需要填写的内容形式");
        return false;
      }
      this.custem_arr[index].name = val.c_name;
      this.custem_arr[index].input_type = val.typeState;
      val.flag = false;
      val.titleflag = true;
      val.writeflag = false;
      val.okstyle = false;
      val.okflag = false;
      this.$message.success("新增自定义字段成功");
    },
    // 点击常用模板添加新的输入框
    common(val, index) {
      this.commonTags = index;
      this.custem_arrList.push({
        c_name: val.c_name,
        value: val.e_name,
        typeState: val.input_type_new,
        new: true,
        flag: false,
        okflag: false,
        okstyle: false,
        titleflag: true,
        writeflag: false,
        deleflag: true,
        checkdeflag: false,
      });
      this.custem_arr.push({
        f_id: val.id,
        name: val.c_name,
        is_must: 0,
        input_type: val.input_type_new,
      });
    },
    // 获取公文模板详情
    getcompileList() {
      Postinfo({ id: this.$route.query.id }).then((res) => {
        res.data.fields.map((v, i) => {
          v.value = v.field_id;
          v.flag = false;
          v.writeflag = false;
          v.titleflag = true;
          v.okflag = false;
          v.okstyle = false;
          if (v.is_must == 1) {
            v.checkedflag = true;
            v.checkdeflag = true;
          } else {
            v.checkedflag = false;
            v.checkdeflag = false;
          }
          if (v.is_must) {
            v.checkflag = true;
          }
          if (v.is_system == 0) {
            v.deleflag = true;
          }
          if (i > 7) {
            v.typeState = v.input_type;
            this.custem_arrList.push(v);
            this.custem_arr.push({
              is_must: v.is_must,
              name: v.c_name,
              input_type: v.typeState,
              f_id: v.field_id,
            });
          } else {
            this.list.push(v);
            let obj = {};
            obj.field_id = v.field_id;
            obj.is_must = v.is_must;
            this.document_arr.push(obj);
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-tabs {
  overflow: none;
}
.Mask {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.postinfo {
  position: relative;
  padding-top: 7px;
  .postinfo-title {
    color: #909399;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .ant-checkbox-group {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .span1 {
      .span2 {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .addtext {
      width: 620px;
      line-height: 46px;
      border: 1px solid #ebeef5;
      text-align: center;
      color: #0082ef;
    }
  }
  .left {
    width: 620px;
    height: 48px;
    padding: 0px 23px 0px 66px;
    background: rgba(255, 255, 255, 1)
      url("../../../../assets/addpostset/workicon.png") no-repeat 20px 16px;
    background-size: 16px 16px;
    border: 1px solid rgba(235, 238, 245, 1);
    opacity: 1;
    position: relative;
    transition: all 0.3s linear;
    &:hover {
      transform: translateY(-1px);
      transform: translateX(-1px);
      box-shadow: 0px 0px 6px rgba(00, 00, 00, 0.16);
      z-index: 5;
    }
    /deep/ .ant-input:focus {
      box-shadow: none !important;
    }
    .inleft {
      color: #303133;
      max-width: 140px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 15px;
    }
    .left-tishi {
      color: #bbbbbb;
      font-size: 12px;
      margin-left: 30px;
    }
    .inlefttow {
      width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .left-input-one {
      width: 190px;
      height: 30px;
      border: 1px solid #e6e6e6;
      margin-left: 40px;
    }
    .left-input-two {
      width: 220px;
      height: 30px;
      line-height: 28px;
      margin-left: 9px;
    }
    .leftinput {
      width: 100px;
      padding: 0px;
      background: #ebeef5;
      outline: none;
      border: none;
    }
    .checkboxtext {
      font-size: 14px;
      color: #303133;
      padding-left: 20px;
      border-left: 1px dashed #dcdfe6;
      line-height: 16px;
    }
  }
  .right {
    width: 380px;
    height: 48px;
    border-radius: 0px;
  }
  .delets {
    height: 20px;
    margin-right: 21px;
    padding-left: 20px;
    text-align: center;
    background: url("../../../../assets/addpostset/del.png") no-repeat 2px 5px;
    background-size: 12px 12px;
    color: red;
    .addsimg {
      color: #ffffff;
    }
  }
  .cententitle {
    padding-left: 10px;
    border-left: 4px solid #0082ef;
    height: 22px;
    margin-top: 40px;
  }
  .bottboxto {
    margin: 30px 10px 0px;
    flex-wrap: wrap;
    margin-bottom: 40px;
    .inbox {
      width: 98px;
      height: 48px;
      padding: 0 10px;
      background: rgba(245, 245, 245, 1);
      border: 1px solid rgba(230, 230, 230, 1);
      opacity: 1;
      border-radius: 4px;
      text-align: center;
      line-height: 48px;
      margin-right: 30px;
      color: #606266;
      font-size: 14px;
      font-weight: 400;
      margin-top: 20px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .inboxs {
      color: #0082ef;
      background-color: #ebf5fe;
      border: 1px solid #0082ef;
    }
  }
  .write {
    color: #0082ef;
    margin-right: 20px;
  }
  .ant-input {
    position: relative;
    border: 0px;
    z-index: 100;
  }
  .okwrite {
    width: 44px;
    line-height: 25px;
    text-align: center;
    position: absolute;
    right: 105px;
    cursor: pointer;
    z-index: 150;
    color: #ffffff;
    font-weight: 500;
    background: #0082ef;
  }
  .flag {
    padding: 0;
  }
}
</style>