<template>
  <div class="addInpostrafts-header-box" v-if="leftdata_fields">
    <div
      class="line-show"
      v-if="
        leftdata.auth.can_approval == 1 || this.leftdata.status == 20
          ? false
          : true
      "
    ></div>
    <div class="line">
      <div
        class="flex-s"
        :style="w100.includes(index) ? 'width:100%' : ''"
        v-for="(item, index) in leftdata_fields"
        :key="index"
      >
        <div class="title2 flex-col">
          <span class="red Mandatory" v-if="item.is_must != 0">*</span
          >{{ item.c_name }}
        </div>
        <div class="content2">
          <div class="fine" style="100%" v-if="item.e_name === 'word_no'">
            <span class="word_no-span">{{ item.value }}</span>
          </div>
          <a-input
            style="width: 100%"
            :maxLength="20"
            v-model="item.value"
            v-else-if="item.e_name === 'title'"
            placeholder="请输入"
          />
          <!-- <a-input
            :maxLength="20"
            v-model="item.value"
            v-else-if="item.input_type == 1"
            placeholder="请输入"
          /> -->
          <a-input
            :maxLength="20"
            v-model="item.value"
            v-else-if="
              item.input_type == 1 &&
              item.e_name != 'issuer' &&
              item.e_name != 'received_delivery'
            "
            placeholder="请输入"
          />
          <a-select
            mode="tags"
            placeholder="请输入"
            v-else-if="
              item.input_type == 1 &&
              (item.e_name == 'issuer' || item.e_name == 'received_delivery')
            "
            @deselect="head_data_deselect(item.e_name, $event)"
            :open="false"
            v-model="all_data[item.e_name]"
            @change="select_handleChange($event, item)"
          ></a-select>

          <a-select
            placeholder="请选择"
            show-search
            option-filter-prop="children"
            v-model="item.value"
            v-else-if="item.input_type == 2"
            class="tw"
          >
            <a-select-option
              :value="item2.id"
              v-for="(item2, index2) in item.child"
              :key="index2"
              >{{ item2.name }}</a-select-option
            >
          </a-select>
          <div
            class="receiving_time"
            style="flex: 1"
            v-if="item.e_name == 'receiving_time'"
          >
            <a-date-picker
              format="YYYY-MM-DD"
              :disabledDate="disabledDate"
              v-model="item.value"
            />
          </div>
          <div class="fine" v-if="item.input_type_new == 5">
            <a-select
              @deselect="head_data_deselect(item.e_name, $event)"
              mode="tags"
              placeholder="请选择/输入"
              @change="select_handleChange($event, item)"
              v-model="all_data[item.e_name]"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.member"
              @click="show_organizate(6, item)"
            ></i>
          </div>

          <div class="fine" v-if="item.input_type_new == 6">
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              @change="select_handleChange($event, item)"
              v-model="all_data[item.e_name]"
              @deselect="head_data_deselect(item.e_name, $event)"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(0, item)"
            ></i>
          </div>
          <div class="fine" v-if="item.input_type_new == 7">
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              @change="select_handleChange($event, item)"
              v-model="all_data[item.e_name]"
              @deselect="head_data_deselect(item.e_name, $event)"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(3, item)"
            ></i>
          </div>
          <div class="fine" v-if="item.input_type_new == 8">
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              @change="select_handleChange($event, item)"
              v-model="all_data[item.e_name]"
              @deselect="head_data_deselect(item.e_name, $event)"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(5, item)"
            ></i>
          </div>
          <div class="fine" v-if="item.input_type_new == 9">
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              @change="select_handleChange($event, item)"
              v-model="all_data[item.e_name]"
              @deselect="head_data_deselect(item.e_name, $event)"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(2, item)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择人员弹窗 -->
    <a-modal
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk_ren"
      @cancel="handle_close"
      :title="member_text"
      class="circulation"
      cancelText="取消"
      okText="确定"
    >
      <div>
        <Framelist
          :show_data_list="show_data_list"
          :show_data_flag="show_data_flag"
          :range="visiblerange"
          :tag="tag"
          :restype="4"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import SvgIcon from "@/views/components/svgicon.vue";
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
import { document_wordno_manager } from "@/api/draft";
import moment from "moment";
export default {
  name: "Sendinginfo",

  data() {
    return {
      //组织架构
      visible: false,
      confirmLoading: false,
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], //临时数据
        visuals: [], //使用数据弹框
      },
      //输入，选择，输入+选择数组(文本类型判断)
      judgment: {
        department: [], //只能选部门（组织架构）
        member: [], //只能选成员（组织架构）
        company: ["main_delivery"], //收文发文单位
        other: [], //依赖于其他选项的（如收发文单位和接收人）
        two_department: [], //选择组织架构和发文收文单位
        person_and_department: [], //选择组织架构人和发文收文单位
        head_icon: ["main_delivery"],
      },
      judgment_icon: {
        department: "department",
        member: "member",
      },
      w100: ["title", "word_no"],

      //（用于数据显示）
      all_data: null,
      //（用于数据提交）
      select_data: null,
      member_text: "人员选单",

      tags: {
        0: { tab: true, bm: true, company: false }, //（组织架构(限单位)）
        1: { tab: true, pe: true, company: false }, //（组织架构(限人)）
        2: { tab: false, bm: true, company: true }, //（发文收文单位(单位)）
        3: { tab: true, bm: true, pe: false, company: true }, //（发文收文单位(单位)，组织架构单位）
        4: { tab: true, bm: false, pe: true, company: true }, //（发文收文单位(单位)，组织架构人）
        5: { tab: true, bm: true, pe: true, company: false }, //组织架构选人选部门
        6: {
          tab: true,
          bm: true,
          pe: true,
          company: false,
          label: true,
          role: true,
          lately: true,
        }, //组织架构部门+人，最近，标签，角色
        7: {
          tab: true,
          bm: true,
          pe: true,
          company: true,
          label: true,
          role: true,
          lately: true,
        }, //组织架构部门+人，最近，标签，角色,收发文单位
      },

      tag: {
        tab: true,
        tab2: false,
      },

      that_e_name: null,

      //在选人弹窗回填数据
      show_data_list: null,
      show_data_flag: false,

      //规则设置
      role_data: {
        visible_role: false,
        role_value: 1,
        more_role: false,
        ofen_word_no: [], //常用字号
        all_word_no: [], //全部字号
        word_no_search: null, //搜索内容
        zanshi_word_no: null, //用于选择切换显示时的数据
      },
    };
  },
  created() {
    this.get_data();
  },
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf("day");
    },
    //获取字号列表
    async get_document_wordno_manager(val) {
      let data = await document_wordno_manager({
        type: this.$route.query.type,
        kwd: this.role_data.word_no_search,
      });
      // val 0=>初始加载 1=>搜索
      if (val == 0) {
        data.data.forEach((el) => {
          if (el.is_default == 1 && this.role_data.ofen_word_no.length < 3) {
            this.role_data.ofen_word_no.push(JSON.parse(JSON.stringify(el)));
          }
        });
      }
      this.role_data.all_word_no = JSON.parse(JSON.stringify(data.data));
    },
    //重置头部数据
    reste_data() {},
    select_handleChange(value, info) {
      info.value.text = value;
    },
    //字号搜索
    word_no_search() {
      this.get_document_wordno_manager();
    },
    //字号选择改变
    word_no_change(val) {
      this.role_data.all_word_no.forEach((el) => {
        if (el.id === val.target.value) {
          this.role_data.zanshi_word_no = el.word_no;
        }
      });
    },
    //显示组织架构
    handle_close() {
      this.visible = false;
    },
    //显示组织架构
    show_organizate(val, item) {
      //0（组织架构(限单位)）
      //1（组织架构(限人)）
      //2（发文收文单位(单位)）
      //3发文单位、组织架构单位
      //4发文单位、组织架构人
      this.visible = true;
      //用于数据回填
      this.show_data_list = JSON.parse(
        JSON.stringify(this.select_data[item.e_name])
      );
      this.show_data_flag = !this.show_data_flag;
      this.open_type = val;

      this.that_e_name = item.e_name;
      this.tag = this.tags[val];
      this.member_text = "选择" + item.c_name;

      //清空数据
      this.visiblerange = {
        visible: false, // 可见范围弹窗
        visual: [], //临时数据
        visuals: [], //使用数据弹框
      };
    },
    //组织架构确认
    handleOk_ren() {
      //格式变化
      //主送单位
      //设置当在弹窗内删除数据后，在外面也要删除
      this.before_input_arr = this.data_screen(this.that_e_name);
      this.select_data[this.that_e_name] = [];
      this.all_data[this.that_e_name] = [];

      if (this.that_e_name == "main_delivery") {
        this.select_data.reviewer = [];
        //设置接收人
        this.visiblerange.visual.forEach((el) => {
          if (el.receiver_name) {
            if (
              this.select_data.reviewer &&
              [1, 2].includes(parseInt(this.$route.query.type))
            ) {
              this.select_data.reviewer.push({
                id: el.value,
                name: el.receiver_name,
              });
              this.all_data.reviewer.push(el.receiver_name);
              this.all_data.reviewer = Array.from(
                new Set(this.all_data.reviewer)
              );
            }
          }
          this.select_data[this.that_e_name].push({
            id: el.value,
            name: el.title,
            receiver_name: el.receiver_name,
            del_id: el.del_id,
            type: el.type,
          });
          this.all_data[this.that_e_name].push(el.title || "");
        });
      } else if (this.that_e_name == "receiving_unit") {
        //设置接收人
        this.visiblerange.visual.forEach((el) => {
          if (
            this.select_data.receiving_user &&
            [1, 2].includes(parseInt(this.$route.query.type)) &&
            el.receiver_name
          ) {
            this.select_data.receiving_user.push({
              id: el.value,
              name: el.receiver_name,
            });
            this.all_data.receiving_user.push(el.receiver_name);
            this.all_data.receiving_user = Array.from(
              new Set(this.all_data.receiving_user)
            );
          }
          this.select_data[this.that_e_name].push({
            id: el.value,
            name: el.title,
            receiver_name: el.receiver_name,
            del_id: el.del_id,
            type: el.type,
          });
          this.all_data[this.that_e_name].push(el.title || "");
        });
      } else {
        this.visiblerange.visual.forEach((el) => {
          this.select_data[this.that_e_name].push({
            id: el.value,
            name: el.title,
            // receiver_name: el.receiver_name,
            del_id: el.del_id,
            type: el.type,
          });
          this.all_data[this.that_e_name].push(el.title || "");
        });
      }
      let has_data_id = [];

      //去重选择的
      this.select_data[this.that_e_name].forEach((el, inx) => {
        if (!has_data_id.includes(el.del_id)) {
          has_data_id.push(el.del_id);
        } else {
          this.select_data[this.that_e_name].splice(inx, 1);
        }
      });
      this.all_data[this.that_e_name] = [
        ...this.before_input_arr,
        ...this.all_data[this.that_e_name],
      ];
      //去重全部数据（显示的）
      this.all_data[this.that_e_name] = Array.from(
        new Set(this.all_data[this.that_e_name])
      );
      this.visible = false;
      //   if (this.$route.query.type == 3 && this.select_data.reviewer) {
      //     delete this.select_data.reviewer
      //   }

      this.set_vuex_data();
    },

    //设置发文单位，签发人，主送单位数据
    set_vuex_data() {
      for (let key in this.select_data) {
        let mothods_name = null;
        mothods_name = `SET_LEFTDATA_FIELDS_${key}`;
        this.$store.commit(mothods_name, {
          select: this.select_data[key],
          text: this.data_screen(key).join(),
        });
      }
    },

    //数据筛选（用于筛选输入的数据）
    data_screen(key) {
      //选择的数组（用于判断）
      let zanshi = [];
      this.select_data[key].forEach((el) => {
        zanshi.push(el.name || el.title);
      });
      let text_copy_users = [];
      this.all_data[key].forEach((el) => {
        if (!zanshi.includes(el)) {
          text_copy_users.push(el);
        }
      });
      return text_copy_users;
    },
    head_data_deselect(e_name, option) {
      this.select_data[e_name].forEach((el, index) => {
        if (el.name == option) {
          setTimeout(() => {
            this.select_data[e_name].splice(index, 1);
            this.set_vuex_data();
          });
        }
      });
    },
    //接收人删除
    reviewer_deselect(val) {
      this.select_data.reviewer.forEach((el, index) => {
        if (el.name == val) {
          setTimeout(() => {
            this.all_data.reviewer.splice(index, 0, val);
          });
        }
      });
    },

    //主送单位删除
    main_delivery_deselect(val) {
      this.select_data.main_delivery.forEach((el, inx) => {
        if (el.name == val) {
          let receiver_name = this.select_data.main_delivery[inx].receiver_name;

          this.select_data.main_delivery.splice(inx, 1);
          this.all_data.main_delivery.splice(inx, 1);

          this.select_data.reviewer.forEach((el2, inx2) => {
            if (el2 == receiver_name) {
              this.select_data.reviewer.splice(inx2, 1);
            }
          });
          this.all_data.reviewer.forEach((el2, inx2) => {
            if (el2 == receiver_name) {
              this.all_data.reviewer.splice(inx2, 1);
            }
          });
        }
      });
    },
    //拿到头部的内容
    get_data() {
      if (this.leftdata_fields) {
        this.all_data = {};
        this.select_data = {};
        for (let key in this.leftdata_fields) {
          let all_value = [];
          if (
            (key == "issuer" || key == "received_delivery") &&
            this.leftdata_fields[key].input_type_new == 1
          ) {
            this.leftdata_fields[key].input_type_new = 3;
            let s_value = this.leftdata_fields[key].value;
            this.$set(this.leftdata_fields[key], "value", {
              select: [],
              text: s_value,
            });
          }
          if (this.leftdata_fields[key].input_type_new >= 3) {
            this.$set(this.all_data, this.leftdata_fields[key].e_name, []);
            this.$set(this.select_data, this.leftdata_fields[key].e_name, []);
          }

          if (
            this.leftdata_fields[key]?.value?.text &&
            this.leftdata_fields[key].value.text.length > 0
          ) {
            all_value = this.leftdata_fields[key].value.text.split(",");
          }

          if (
            this.leftdata_fields[key]?.value?.select &&
            this.leftdata_fields[key].value.select.length > 0
          ) {
            this.select_data[this.leftdata_fields[key].e_name] = JSON.parse(
              JSON.stringify(this.leftdata_fields[key].value.select)
            );

            this.leftdata_fields[key].value.select.forEach((el) => {
              all_value.push(el.name);
            });
          }
          this.all_data[this.leftdata_fields[key].e_name] = all_value;
        }
        delete this.all_data.word_no;
        delete this.select_data.word_no;
        for (let key in this.all_data) {
          this.all_data[key] = Array.from(new Set(this.all_data[key]));
        }
      }
    },
  },
  components: {
    SvgIcon,
    Framelist,
  },
  computed: {
    leftdata_fields() {
      return this.$store.state.leftdata.fields;
    },
    leftdata() {
      return this.$store.state.leftdata;
    },
  },
  watch: {
    leftdata_fields() {
      this.get_data();
    },
  },
};
</script>
<style lang="less" scoped>
.Mandatory {
  padding-top: 4px;
}
/deep/ .ant-select-selection--multiple .ant-select-selection__choice {
  background-color: #ffffff;
  border: 1px solid transparent;
  transition: all 0.2s linear;
  &:hover {
    border: 1px solid #f56c6c;
    color: #f56c6c;
  }
  &:hover .ant-select-selection__choice__remove {
    display: inline-block;
    color: #f56c6c;
  }
  .ant-select-selection__choice__remove {
    display: none;
    transition: all 0.2s linear;
  }
}
/deep/.tw {
  flex: 1;
  height: 100%;
  overflow: hidden;
  .ant-select-selection {
    height: 100%;
    border-radius: 0;
    .ant-select-selection__rendered {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
/deep/ .ant-modal {
  width: 730px !important;
}
.set-role {
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 14px;
    .often {
      color: #476dbc;
    }
    .set {
      color: #0082ef;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid rgba(220, 223, 230, 1);
    padding: 14px 40px;
    .ofen-use-role {
      display: flex;
      flex-direction: column;

      .ofen-use-icon {
        display: inline-block;
        width: 34px;
        height: 20px;
        background: rgba(234, 240, 252, 1);
        border-radius: 2px;
        color: #839ccf;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        margin-left: 10px;
      }
      .ofen-user-datas {
        display: flex;
        align-items: center;
        width: 400px;
        height: 45px;
        box-sizing: border-box;
        border-top: 1px dashed rgba(220, 223, 230, 1);
        border-bottom: 1px dashed rgba(220, 223, 230, 1);
        font-size: 14px;
        color: #303133;
        margin-left: 25px;
        margin-bottom: 16px;
        padding: 10px 0;
        .date,
        .role {
          border-bottom: 1px solid rgba(220, 223, 230, 1);
          padding-bottom: 5px;
        }
        .role {
          margin-left: 10px;
        }
      }
    }
    .more-contant {
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      height: 160px;
      overflow-y: scroll;
      .ant-radio-wrapper {
        display: block;
      }
    }
    .ant-radio-wrapper {
      margin-bottom: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .more-role {
      display: flex;
      align-items: center;
      color: #0082ef;
      font-size: 14px;
      margin-top: 10px;
    }
  }
}
.flex-s {
  display: flex;
  align-items: center;
  width: 50%;
  border: 1px solid rgba(220, 223, 230, 1);
  min-height: 40px;
  border-top: none;

  &:first-child {
    border-top: 1px solid rgba(220, 223, 230, 1);
  }

  &:nth-child(2) {
    border-left: 1px solid rgba(220, 223, 230, 1);
  }
}
.addInpostrafts-header-box {
  position: relative;
}
.line-show {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.line {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 0 10px;

  .title2 {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 152px;
    height: 100%;
    border-right: 1px solid rgba(220, 223, 230, 1);
    padding-right: 30px;
    background: rgba(249, 249, 249, 1);
    color: #303133;
    font-size: 14px;
    font-weight: 500;
  }
  .content2 {
    display: flex;
    flex: 1;
    align-items: center;
    padding-left: 25px;

    .fine {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding-right: 8px;
      .icon {
        width: 16px;
        height: 16px;
      }
      .department {
        background: url("../../../../../assets/adddraft/department.png");
        background-size: 16px 16px;
      }
      .member {
        background: url("../../../../../assets/adddraft/member.png");
        background-size: 16px 16px;
      }
    }
  }
  .textarea {
    min-height: 80px;
  }
  .font {
    white-space: nowrap;
    color: #0082ef;
  }
  /deep/.ant-dropdown-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 350px;
    height: 40px;
    margin-left: 0 !important;
  }
  /deep/ .ant-input {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  /deep/.ant-select-selection {
    border: none !important;
  }
  /deep/ .ant-select-selection {
    box-shadow: none !important;
    .ant-select-selection__rendered {
      box-shadow: none !important;
    }
  }
  .word-no {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 380px;
    color: #303133;
    .examples {
      font-size: 12px;
      color: rgba(144, 147, 153, 1);
    }
    .right {
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        width: 16px;
        height: 12px;
        background: url("../../../../../assets/addpostset/set-font.png");
        background-size: 16px 12px;
        margin-right: 10px;
        vertical-align: middle;
        margin-top: 2px;
      }
      span {
        font-size: 14px;
        color: #0082ef;
      }
    }
  }
}
/deep/.ant-select {
  width: 100%;
}
/deep/.ant-select-search__field__wrap {
  max-width: 180px !important;
}
/deep/ .ant-select-selection__choice {
  max-width: 180px !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/deep/ .ant-calendar-picker-input {
  width: 238px;
  padding-right: 0;
}
/deep/ .ant-select-selection__rendered {
  margin: 0;
  .ant-select-selection-selected-value {
    margin-left: 10px;
  }
}
.word_no-span {
  margin-left: 8px;
}
/deep/ .ant-modal-body {
  padding-top: 0;
}
</style>