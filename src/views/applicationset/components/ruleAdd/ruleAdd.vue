<template>
  <div>
    <!-- 头部 -->
    <Maintitle :titleObj="titleObj" @go_back="go">
      <div>
        <a-button type="primary" class="bcbtn" @click="keep">保存</a-button>
      </div>
    </Maintitle>
    <!-- 内容 -->
    <Maincontent>
      <!-- 名称 -->
      <div class="Content-name">
        <span> <span style="color: red" class="name-left">*</span>名称 </span>
        <a-input :maxLength="30" placeholder="请输入名称" v-model="name" />
        <a-checkbox class="setTextNum" :checked="checked" @change="setNum"
          >设置为我的常用字号</a-checkbox
        >
      </div>
      <!-- 字号规则 -->
      <div class="monogram">
        <div class="left-text">字号规则</div>
        <div class="right-content">
          <!-- 左侧字号元素选择 -->
          <div class="left-nav">
            <div class="left-nav-text">字号元素</div>
            <!-- 字号分类 -->
            <div
              class="mongram-item hand"
              v-for="(item, index) in itemList"
              :key="item.num"
              :class="index == textindex ? 'active' : ''"
              @click="aciveTrue(item, index)"
            >
              <Svgicon :item="item" />
              {{ item.text }}
            </div>
          </div>
          <!-- 右侧属性选择 -->
          <div class="right-choice">
            <div class="choice-title flex-col">
              <span class="preview" v-show="guishow">规则预览</span>
              <span class="sort">{{ str }}</span>
              <div class="flex-col-bd"></div>
              <a-button class="right-choice-no" @click="cleanUp" v-if="!Edit"
                >清空</a-button
              >
            </div>
            <!-- 具体属性 -->
            <div class="kong" v-if="kong">
              <img
                src="../../../../assets/addpostset/kong.png"
                alt
                width="62"
                height="53"
              />
              <p>点选左边列表中的元素，设置字号规则</p>
            </div>
            <div>
              <!-- 日期属性 -->
              <div
                class="btom10 choice-content"
                v-for="(item, index) in contentList"
                :key="index"
              >
                <div class="choice-content-title">
                  <span class="text">{{ item.title }}</span>
                  <span v-if="!Edit" class="del" @click="del(index)">删除</span>
                </div>
                <div class="select">
                  <div class="city" v-if="item.show">
                    <span class="text">区域设置 (国家/地区)</span>
                    <a-select
                      :default-value="item.city[0].value"
                      placeholder="请选择国家/地区"
                      style="width: 160px"
                      @change="cityChange(item, $event)"
                      :disabled="Edit"
                    >
                      <a-select-option
                        v-for="v in item.city"
                        :value="v.value"
                        :key="v.id"
                        >{{ v.text }}</a-select-option
                      >
                    </a-select>
                  </div>
                  <div class="date" v-if="item.show">
                    <span class="text">类型</span>
                    <a-select
                      :class="item.red ? 'red' : ''"
                      :default-value="item.key[1]"
                      placeholder="请选择类型"
                      style="width: 293px"
                      @change="changeMath($event, item)"
                      :disabled="Edit"
                    >
                      <a-select-option
                        :value="time.value"
                        v-for="(time, index) in item.type"
                        :key="index"
                        >{{ time.text }}</a-select-option
                      >
                    </a-select>
                  </div>
                </div>
                <div class="select" v-if="item.inpshow">
                  <div>
                    <span style="marginright: 30px">{{ item.content }}</span>
                    <a-input
                      :maxLength="item.textshow ? 1 : 30"
                      :class="item.red ? 'red' : ''"
                      placeholder="请输入"
                      style="width: 280px"
                      @blur="changenumVal($event, item, index)"
                      v-model="item.text"
                      :disabled="Edit"
                    />
                    <p
                      style="font-size: 12px; color: #909399; margin-left: 86px"
                      v-show="item.textshow"
                    >
                      请填写1~8的整数，如：设置增量位数为4，那么公文编号就会从0001开始自动增加
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Maincontent>
  </div>
</template>

<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import { Addpostrulese, Getpostruleseinfo } from "@/api/postruleset.js";
import Svgicon from "@/views/applicationset/postset/postruleset/components/svgicon.vue";
export default {
  components: {
    Maintitle,
    Maincontent,
    Svgicon,
  },
  props: ["type"],
  data() {
    return {
      textindex: 5, //字号下表
      // 头部需要的开关集合
      titleObj: {
        retu: true, // 返回开关
      },
      //设置常用模板
      is_default: 0,
      //   名称
      name: "",
      //   字号分类
      itemList: [
        { text: "日期", num: 0 },
        { text: "时间", num: 1 },
        { text: "常量", num: 2 },
        { text: "自动增量", num: 3 },
      ],
      // 规则循环
      contentList: [],
      str: "", // 展示在头部的规则预览
      Arr: [], // 上传给后端的数据
      kong: true,
      ListNum: -1,
      num: -1,
      activearr: [],
      guishow: false,
      isDefault: 0,
      checked: false, // 是否设置了常用
      obj: {
        // 数据对象，通过后端传过来的数据决定显示什么
        date1: "20121202",
        date2: "2012-12-02",
        date3: "二零一二十二零二",
        date4: "2012年12月2日",
        date5: "二零一二年十二月二日",
        time1: "130355",
        time2: "13:03:55",
        time3: "1:03:55 PM",
        time4: "13时3分55秒",
      },
    };
  },
  created() {
    if (this.$route.query.id != undefined) {
      this.getGetpostruleseinfo();
    }
  },
  computed: {
    Edit() {
      return this.$route.query.id != undefined ? true : false;
    },
  },
  methods: {
    //获取详情
    getGetpostruleseinfo() {
      Getpostruleseinfo({
        id: this.$route.query.id,
      }).then((res) => {
        this.ProcessingDetails(res);
      });
    },
    // 点击左边列表增加规则
    aciveTrue(item, index) {
      if (!this.Edit) {
        this.textindex = index;
        this.kong = false;
        this.guishow = true;
        this.ListNum++;
        // 点击字号分类 对应的添加
        if (item.num == 0) {
          this.contentList.push({
            title: "日期属性",
            city: [
              { value: "china", text: "中国" },
              { value: "usa", text: "美国" },
              { value: "rb", text: "日本" },
            ],
            type: [
              { value: "date1", text: "20121202" },
              { value: "date2", text: "2012-12-02" },
              { value: "date3", text: "二零一二十二零二" },
              { value: "date4", text: "2012年12月2日" },
              { value: "date5", text: "二零一二年十二月二日" },
            ],
            show: true,
            typenum: 1,
            pathflag: true,
            text: "",
            key: "",
            red: false,
          });
          this.activearr.push("1");
        } else if (item.num == 1) {
          this.contentList.push({
            title: "时间属性",
            city: [
              { value: "china", text: "中国" },
              { value: "usa", text: "美国" },
              { value: "rb", text: "日本" },
            ],
            type: [
              { value: "time1", text: "130355" },
              { value: "time2", text: "13:03:55" },
              { value: "time3", text: "1:03:55 PM" },
              { value: "time4", text: "13时3分55秒" },
            ],
            show: true,
            typenum: 2,
            dateflag: true,
            text: "",
            key: "",
            red: false,
          });
          this.activearr.push("2");
        } else if (item.num == 2) {
          this.contentList.push({
            title: "常量属性",
            content: "常量值",
            inpshow: true,
            typenum: 3,
            numflag: true,
            text: "",
            key: "",
            red: false,
          });
          this.activearr.push("3");
        } else if (item.num == 3) {
          this.contentList.push({
            title: "增量位数",
            content: "增量位数",
            inpshow: true,
            textshow: true,
            typenum: 4,
            numaddflag: true,
            text: "",
            key: "",
            red: false,
          });
          this.activearr.push("4");
        }
        // 调用规则预览处理函数
        this.RulePreview();
      }
    },
    // 删除
    del(num) {
      this.contentList.splice(num, 1);
      this.activearr.splice(num, 1);
      if (this.contentList.length <= 0) {
        this.kong = true;
        this.guishow = false;
      }
      this.RulePreview();
    },
    // 清空日期，时间，常量，自动增量对象
    cleanUp() {
      event.red = false;
      this.textindex = "";
      this.str = "";
      this.contentList = [];
      this.kong = true;
      this.guishow = false;
    },
    // 时间类型
    changeMath(val, event) {
      event.red = false;
      if (event.typenum == 1) {
        event.key = ["date", val];
      } else if (event.typenum == 2) {
        event.key = ["time", val];
      }
      event.text = this.obj[val];
      // 调用规则预览处理函数
      this.RulePreview();
    },
    // 常量
    changenumVal(val, event, index) {
      if (event.textshow) {
        event.text = event.text.replace(/[^\d]/g, "");
        if (event.text < 1 || event.text > 8) {
          event.red = true;
        } else {
          event.red = false;
        }
      }
      if (event.typenum == 3) {
        event.key = ["constant", event.text];
      } else if (event.typenum == 4) {
        event.key = ["increment", event.text];
      }
      // 调用规则预览处理函数
      this.RulePreview();
    },
    //设置是否为我的常用模板
    setNum(e) {
      if (e.target.checked) {
        this.checked = true;
        this.isDefault = 1;
      } else {
        this.checked = false;
        this.isDefault = 0;
      }
    },
    // 保存
    keep() {
      let _onOff = true;
      this.contentList.forEach((el) => {
        if (el.key[1] == undefined || el.key[1] == "") {
          el.red = true;
          _onOff = false;
          this.$message.error("类型、常量值或增量位数不能为空");
          return false;
        }
        if (el.typenum == 4 && (Number(el.text) > 8 || Number(el.text) < 1)) {
          el.red = true;
          this.$message.error("增量位数请填写1~8的整数");
          _onOff = false;
          return false;
        }
      });
      if (_onOff) {
        if (this.name == "" && this.Arr.length == 0) {
          this.$message.error("请输入名称并且选择字号规则");
        } else if (this.name && this.Arr.length == 0) {
          this.$message.error("请选择字号规则");
        } else if (this.name == "" && this.Arr.length) {
          this.$message.error("请输入名称");
        } else {
          Addpostrulese({
            name: this.name,
            type: this.type,
            rule: this.Arr,
            is_default: this.isDefault,
            id: this.$route.query.id == undefined ? "" : this.$route.query.id,
          }).then((res) => {
            if (res.code == 1) {
              this.$router.go(-1);
            }
          });
        }
      }
    },
    // 取消
    go() {
      this.$router.go(-1);
    },
    // 城市变更
    cityChange(val, e) {
      let usatype = [
        { value: "date2", text: "2012-12-02" },
        { value: "date1", text: "20121202" },
      ];
      let type = [
        { value: "date1", text: "20121202" },
        { value: "date2", text: "2012-12-02" },
        { value: "date3", text: "二零一二十二零二" },
        { value: "date4", text: "2012年12月2日" },
        { value: "date5", text: "二零一二年十二月二日" },
      ];
      let usatime = [
        { value: "time1", text: "130355" },
        { value: "time2", text: "13:03:55" },
        { value: "time3", text: "1:03:55 PM" },
        { value: "time4", text: "13时3分55秒" },
      ];
      let time = [
        { value: "time1", text: "130355" },
        { value: "time2", text: "13:03:55" },
        { value: "time3", text: "1:03:55 PM" },
      ];
      if (e == "usa" && val.typenum == 1) {
        val.type = usatype;
      } else if (val.typenum == 1) {
        val.type = type;
      } else if (e == "usa" && val.typenum == 2) {
        val.type = time;
      } else if (val.typenum == 2) {
        val.type = usatime;
      }
    },
    // 规则预览处理函数
    RulePreview() {
      this.str = "";
      this.Arr = [];
      let _text = "";
      this.contentList.forEach((el, index) => {
        this.Arr.push(el.key);
        if (el.typenum == 4) {
          let _num = "";
          for (let i = 0; i < Number(el.text) - 1; i++) {
            _num += "0";
          }
          _num += "1";
          _text += _num;
        } else {
          _text += el.text;
        }
        if (index > 0) {
          this.str += ` 一 ${el.title}`;
        } else {
          this.str += `${el.title}`;
        }
      });
      if (_text != "") {
        this.str += `(${_text})`;
      }
    },
    // 处理获取到的详情数据
    ProcessingDetails(res) {
      if (res.data.is_default == 1) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.name = res.data.name;
      let _arr = res.data.rule;
      if (_arr.length > 0) {
        this.kong = false;
      }
      this.Arr = _arr;
      _arr.map((item) => {
        if (item[0] == "date") {
          this.contentList.push({
            title: "日期属性",
            city: [
              { value: "china", text: "中国" },
              { value: "usa", text: "美国" },
              { value: "rb", text: "日本" },
            ],
            type: [
              { value: "date1", text: "20121202" },
              { value: "date2", text: "2012-12-02" },
              { value: "date3", text: "二零一二十二零二" },
              { value: "date4", text: "2012年12月2日" },
              { value: "date5", text: "二零一二年十二月二日" },
            ],
            show: true,
            typenum: 1,
            pathflag: true,
            text: this.obj[item[1]],
            key: item,
            red: false,
          });
        } else if (item[0] == "time") {
          this.contentList.push({
            title: "时间属性",
            city: [
              { value: "china", text: "中国" },
              { value: "usa", text: "美国" },
              { value: "rb", text: "日本" },
            ],
            type: [
              { value: "time1", text: "130355" },
              { value: "time2", text: "13:03:55" },
              { value: "time3", text: "1:03:55 PM" },
              { value: "time4", text: "13时3分55秒" },
            ],
            show: true,
            typenum: 2,
            dateflag: true,
            text: this.obj[item[1]],
            key: item,
            red: false,
          });
        } else if (item[0] == "constant") {
          this.contentList.push({
            title: "常量属性",
            content: "常量值",
            inpshow: true,
            typenum: 3,
            numflag: true,
            text: item[1],
            key: item,
            red: false,
          });
        } else {
          this.contentList.push({
            title: "增量位数",
            content: "增量位数",
            inpshow: true,
            textshow: true,
            typenum: 4,
            numaddflag: true,
            text: item[1],
            key: item,
            red: false,
          });
        }
      });
      this.RulePreview();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-checkbox-wrapper {
  margin-left: 30px;
}
.maintitle {
  margin-bottom: 10px;
  .bcbtn {
    margin-left: 20px;
  }
  button {
    width: 78px;
    height: 36px;
  }
}
.maincontent {
  height: 950px;
  .kong {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
      margin-top: 20px;
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }
  // 名称
  .Content-name {
    margin-left: 40px;
    padding-top: 40px;
    input {
      width: 400px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(220, 223, 230, 1);
      opacity: 1;
      border-radius: 2px;
    }
    span {
      font-size: 14px;
      color: #606266;
      margin-right: 18px;
    }
    .name-left {
      margin-right: 10px;
      font-size: 20px;
      position: relative;
      top: 5px;
    }
  }
  //   字号规则
  .monogram {
    display: flex;
    margin-top: 30px;
    .left-text {
      margin-left: 30px;
      margin-right: 23px;
      font-size: 14px;
      color: #606266;
    }
    .right-content {
      width: 903px;
      height: 800px;
      border: 1px solid rgba(220, 223, 230, 1);
      opacity: 1;
      display: flex;
      //   左侧字号元素选择
      .left-nav {
        width: 166px;
        height: 100%;
        background: rgba(245, 245, 245, 1);
        opacity: 1;
        padding: 20px 30px;
        .left-nav-text {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
        }
        //   字号分类
        .mongram-item {
          width: 106px;
          height: 36px;
          margin-top: 20px;
          border: 1px solid rgba(220, 223, 230, 1);
          opacity: 1;
          border-radius: 2px;
          text-align: center;
          line-height: 36px;
          display: flex;
          padding-left: 16px;
          /deep/ .anticon {
            margin-right: 6px;
          }
        }
        .mongram-item:nth-child(2) {
          background: rgba(255, 255, 255, 1);
          background-size: 12px 12px;
          letter-spacing: 5px;
        }
        .mongram-item:nth-child(3) {
          background: rgba(255, 255, 255, 1);
          letter-spacing: 5px;
          background-size: 12px 12px;
        }
        .mongram-item:nth-child(4) {
          background: rgba(255, 255, 255, 1);
          letter-spacing: 5px;
          background-size: 12px 12px;
        }
        .mongram-item:nth-child(5) {
          background: rgba(255, 255, 255, 1);
          background-size: 12px 12px;
        }
        .mongram-item.active {
          color: #0082ef;
          border: 1px solid rgba(0, 130, 239, 1);
        }
        .mongram-item:nth-child(2).active {
          border-radius: 2px;
          background: rgba(255, 255, 255, 1);
          background-size: 12px 12px;
        }
        .mongram-item:nth-child(3).active {
          border-radius: 2px;
          background: rgba(255, 255, 255, 1);
          background-size: 12px 12px;
        }
        .mongram-item:nth-child(4).active {
          border-radius: 2px;
          background: rgba(255, 255, 255, 1);
          background-size: 12px 12px;
        }
        .mongram-item:nth-child(5).active {
          border-radius: 2px;
          background: rgba(255, 255, 255, 1);
          background-size: 12px 12px;
        }
      }
      //   右侧属性选择
      .right-choice {
        padding: 20px 30px;
        margin-bottom: 20px;
        overflow: scroll;
        width: 100%;
        // 上部规则排序
        .choice-title {
          .right-choice-no {
            height: 24px;
            padding: 0px 12px;
          }
          .preview {
            color: #303133;
            font-weight: 500;
            margin-right: 10px;
          }
          .sort {
            color: rgba(103, 194, 58, 1);
            font-weight: 500;
            width: 70%;
          }
          margin-bottom: 26px;
        }
        // 属性内容
        .choice-content {
          height: 170px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
          opacity: 1;
          .red {
            border: 1px solid red;
            border-radius: 5px;
          }
          .choice-content-title {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            .text {
              font-size: 18px;
              font-weight: 500;
              color: #303133;
            }
            .del {
              color: #606266;
              background: url("../../../../assets/addpostset/del.png") no-repeat
                0px 5px;
              background-size: 9px 12px;
              display: inline-block;
              width: 50px;
              padding-left: 15px;
              cursor: pointer;
              color: #606266;
            }
          }
          //   属性选择
          .select {
            padding: 0px 20px;
            .text {
              margin-right: 30px;
            }
            .city {
              margin-bottom: 10px;
            }
            .date {
              span {
                margin-right: 132px;
              }
            }
          }
        }
      }
    }
  }
  .btom10 {
    margin-bottom: 20px;
  }
}
</style>