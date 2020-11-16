<template>
  <div class="addInpostrafts-header-box" v-if="all_data">
    <div class="title">
      <span class="text">发文信息</span>
      <a-button @click="reste_data">清空</a-button>
    </div>
    <div class="line">
      <div class="flex-s" v-for="(item, index) in get_model" :key="index">
        <div class="title2">
          <span class="must">*</span>
          {{ item.c_name }}
          <a-icon
            type="info-circle"
            style="color: #b3b3b3; font-size: 12px"
            title="呈送公文后，公文信息将自动发送到对面单位。"
            v-if="judgment.head_icon.includes(item.e_name)"
            class="title2-icon"
          />
        </div>
        <div
          class="content2"
          :class="{ active: !verification(item.e_name) && verification_flag }"
        >
          <a-input
            :maxLength="20"
            v-model="item.value"
            v-if="item.input_type == 1"
            placeholder="请输入"
          />
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
            class="fine"
            v-if="
              item.input_type >= 3 && judgment.department.includes(item.e_name)
            "
          >
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              @deselect="head_data_deselect(item.e_name, $event)"
              v-model="all_data[item.e_name]"
              :open="false"
            ></a-select>

            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(0, item)"
            ></i>
          </div>
          <div
            class="fine"
            v-if="item.input_type >= 3 && judgment.member.includes(item.e_name)"
          >
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              style="width: 380px"
              @deselect="head_data_deselect(item.e_name, $event)"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.member"
              @click="show_organizate(4, item)"
            ></i>
          </div>
          <div
            class="fine"
            v-if="
              item.input_type >= 3 && judgment.company.includes(item.e_name)
            "
          >
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
              @deselect="main_delivery_deselect"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(2, item)"
            ></i>
          </div>

          <div
            class="word-no"
            v-else-if="item.input_type >= 3 && item.e_name == 'word_no'"
          >
            <span class="flex-col" style="margin-left: 10px">
              <div class="flex-col">
                <span style="margin-right: 10px">发文后自动生成</span>
                <span class="examples" :title="get_model.word_no.value.word_no"
                  >例：{{ get_model.word_no.value.word_no }}</span
                >
              </div>
            </span>
            <div class="right" @click="role_data.visible_role = true">
              <i></i>
              <span>设置</span>
            </div>
          </div>

          <div
            class="fine"
            v-if="item.input_type >= 3 && judgment.other.includes(item.e_name)"
          >
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange(item.e_name)"
              :open="false"
              @deselect="reviewer_deselect"
              v-model="all_data[item.e_name]"
            ></a-select>
          </div>

          <div
            class="fine"
            v-if="
              item.input_type >= 3 &&
              judgment.two_department.includes(item.e_name)
            "
          >
            <a-select
              mode="tags"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
              @deselect="main_delivery_deselect"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.department"
              @click="show_organizate(3, item)"
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
      @cancel="visible = false"
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
          :open_type="open_type"
        />
      </div>
    </a-modal>

    <!-- 规则设置弹窗 -->
    <div v-if="get_model.word_no">
      <a-modal
        title="发文字号"
        cancelText="取消"
        okText="确定"
        :visible="role_data.visible_role"
        :confirm-loading="confirmLoading"
        @ok="handleOk_role"
        @cancel="role_data.visible_role = false"
      >
        <div class="set-role">
          <div class="head">
            <div>
              <span>当前字号：</span>
              <span class="often">{{ get_model.word_no.value.word_no }}</span>
            </div>
            <a><div class="hand set" @click="onNewRules">设置新的规则</div></a>
          </div>
          <div class="body">
            <a-radio-group
              v-model="get_model.word_no.value.id"
              @change="word_no_change"
            >
              <div class="ofen-use-role">
                <a-radio
                  :key="index"
                  :value="item.id"
                  v-for="(item, index) in role_data.ofen_word_no"
                >
                  {{ item.name }}
                  <span class="ofen-use-icon">常用</span>
                </a-radio>

                <a-input
                  class="ofen-user-datas"
                  v-model="get_model.word_no.value.word_no"
                ></a-input>
              </div>

              <div
                class="more-role hand"
                @click="role_data.more_role = !role_data.more_role"
              >
                <span>更多字号</span>
                <i
                  class="sanjiao"
                  :class="role_data.more_role ? 'shang' : 'xia'"
                ></i>
              </div>
              <div class="more-contant" v-show="role_data.more_role">
                <div class="search">
                  <a-input-search
                    placeholder="搜索字号名称"
                    style="width: 279px; margin-bottom: 16px"
                    v-model="role_data.word_no_search"
                    @search="word_no_search"
                  />
                </div>
                <div class="radio-list">
                  <a-radio
                    v-for="item in role_data.all_word_no"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                    <span style="font-size: 12px; color: #c0c4cc"
                      >({{ item.word_no }})</span
                    >
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
          </div>
        </div>
      </a-modal>
    </div>
    <!-- 跳转新建流程页面，保存草稿弹窗 -->
    <a-modal
      title="保存草稿"
      :visible="jumpPopup.visible"
      okText="保存草稿并跳转"
      cancelText="取消"
      @ok="onJumpPopupOk"
      @cancel="onJumpPopupCancel"
    >
      <p>
        即将跳转到新建{{
          jumpPopup.centenText
        }}页面，是否需要保存本页面内容为草稿！！！
      </p>
    </a-modal>
  </div>
</template>
<script>
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
import { urgent_type_list, secret_type_list } from "@/api/quick_post";
import { document_wordno_manager, check_word_wo_re } from "@/api/draft";
export default {
  name: "Header",
  data() {
    return {
      //头部用的数据
      head_data: [
        {
          c_name: "发文标题",
          field_id: 1,
          is_must: 1,
          e_name: "title",
          is_system: 1,
          input_type: 1,
        },
        {
          c_name: "发文字号",
          field_id: 2,
          is_must: 1,
          e_name: "word_no",
          is_system: 1,
          input_type: 3,
        },
        {
          c_name: "公文密级程度",
          field_id: 3,
          is_must: 1,
          e_name: "secret_level",
          is_system: 1,
          input_type: 2,
        },
        {
          c_name: "公文紧急程度",
          field_id: 4,
          is_must: 1,
          e_name: "urgent_level",
          is_system: 1,
          input_type: 2,
        },
        {
          c_name: "发文单位",
          field_id: 5,
          is_must: 0,
          e_name: "copy_users",
          is_system: 1,
          input_type: 3,
        },
        {
          c_name: "签发人",
          field_id: 6,
          is_must: 0,
          e_name: "issuer",
          is_system: 1,
          input_type: 3,
        },
        {
          c_name: "主送单位",
          field_id: 7,
          is_must: 0,
          e_name: "main_delivery",
          is_system: 1,
          input_type: 3,
        },
        {
          c_name: "接收人",
          field_id: 8,
          is_must: 0,
          e_name: "reviewer",
          is_system: 1,
          input_type: 3,
        },
      ],

      head_model: null,

      verification_head_data: null, //验证

      before_data: "",
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
        department: ["received_delivery", "receiving_unit"], //只能选部门（组织架构）
        member: ["issuer", "receiving_user", "reviewer"], //组织架构部门+人，最近，标签，角色
        company: ["main_delivery"], //收文发文单位
        other: [], //依赖于其他选项的（如收发文单位和接收人）
        two_department: ["copy_users"], //选择组织架构和发文收文单位
        head_icon: ["main_delivery"], //头图标
      },
      judgment_icon: {
        department: "department",
        member: "member",
      },

      //（用于数据显示）
      all_data: null,
      //（用于数据提交）
      select_data: null,
      member_text: "人员选单",
      tags: [
        { tab: true, bm: true, company: false }, //（组织架构(限单位)）
        { tab: true, pe: true, company: false }, //（组织架构(限人)）
        { tab: false, bm: true, company: true }, //（发文收文单位(单位)）
        { tab: true, bm: true, pe: false, company: true }, //（发文收文单位(单位)，组织架构单位）
        {
          tab: true,
          bm: true,
          pe: true,
          company: false,
          label: true,
          role: true,
          lately: true,
        }, //组织架构部门+人，最近，标签，角色
      ],
      tag: {
        tab: true,
      },
      that_e_name: null,

      //在选人弹窗回填数据
      show_data_list: null,
      show_data_flag: false,
      //判断是哪个打开的窗口
      open_type: null,

      //规则设置
      role_data: {
        visible_role: false,
        role_value: 1,
        more_role: false,
        ofen_word_no: [], //常用字号
        all_word_no: [], //全部字号
        word_no_search: null, //搜索内容
        zanshi_word_no: null, //用于选择切换显示时的数据
        show_text: null,
      },
      before_input_arr: [],
      // 跳转流程页面弹窗控制
      jumpPopup: {
        visible: false, // 弹窗开关
        centenText: "字号规则", // 打开的按钮
      },
    };
  },
  props: ["head_need_data", "verification_flag"],
  components: { Framelist },
  created() {
    //接收提交组件发过来的事件，提交数据到vuex
    this.$bus.$on("document_header_quick", this.set_vuex_data);
    this.chuli_data();
  },
  mounted() {},
  computed: {
    get_model() {
      return this.$store.state.quick_draft.header;
    },
  },
  methods: {
    // 保存草稿并跳转新建流程页面
    async onJumpPopupOk() {
      let { code } = await check_word_wo_re({
        word_no: this.get_model.word_no.value.word_no,
        id: this.$route.query.d_id || "",
      });
      if (code != 1) {
        this.jumpPopup.visible = false;
        return;
      }
      this.$emit("SettingNotice");
      this.jumpPopup.visible = false;
      this.JumpFunction();
    },
    // 取消跳转
    onJumpPopupCancel() {
      this.jumpPopup.visible = false;
    },
    // 跳转函数
    JumpFunction() {
      this.$router.push("/postruleset/add");
    },
    onNewRules(){
      this.role_data.visible_role = false;
      this.jumpPopup.visible = true;
    },
    //验证
    verification(e_name) {
      let document_arr = [];
      for (let key in this.get_model) {
        document_arr.push({
          value: this.get_model[key].value,
          c_name: this.get_model[key].c_name,
          e_name: this.get_model[key].e_name,
        });
      }

      let judge = {};

      document_arr.forEach((el) => {
        if (el.value) {
          if (el.value.select) {
            if (el.value.select.length > 0 || el.value.text.length > 0) {
              judge[el.e_name] = {
                flag: true,
                c_name: el.c_name,
                e_name: el.e_name,
              };
            } else {
              judge[el.e_name] = {
                flag: false,
                c_name: el.c_name,
                e_name: el.e_name,
              };
            }
          } else if (el.e_name == "word_no") {
            if (el.value.id || el.value.name) {
              judge[el.e_name] = {
                flag: true,
                c_name: el.c_name,
                e_name: el.e_name,
              };
            } else {
              judge[el.e_name] = {
                flag: false,
                c_name: el.c_name,
                e_name: el.e_name,
              };
            }
          } else {
            judge[el.e_name] = {
              flag: true,
              c_name: el.c_name,
              e_name: el.e_name,
            };
          }
        } else {
          judge[el.e_name] = {
            flag: false,
            c_name: el.c_name,
            e_name: el.e_name,
          };
        }
      });

      return judge[e_name].flag;
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

      if (this.role_data.all_word_no[0]) {
        this.$store.commit(
          "SET_QUICK_DOCUMENT_WORD_NO",
          this.role_data.all_word_no[0].word_no
        );
        this.$store.commit(
          "SET_QUICK_DOCUMENT_WORD_NO_ID",
          this.role_data.all_word_no[0].id
        );
      }
    },
    //重置头部数据
    reste_data() {
      this.all_data = {};
      this.select_data = {};
      if (this.$route.d_id || this.$route.d_id == 0) {
      } else {
        this.chuli_data();
      }
      let _head = JSON.parse(JSON.stringify(this.head_need_data));
      _head.title.value = "";
      this.$store.commit("SET_QUICK_DOCUMENT_HEADER", _head);
    },
    select_handleChange() {
      this.set_vuex_data();
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
          this.$store.commit("SET_QUICK_DOCUMENT_WORD_NO", el.word_no);
        }
      });
    },
    //显示组织机构
    show_organizate(val, item) {
      //0（组织架构(限单位)）
      //1（组织架构(限人)）
      //2（发文收文单位(单位)）

      //用于数据回填
      this.show_data_list = this.select_data[item.e_name];
      this.show_data_flag = !this.show_data_flag;
      this.open_type = val;

      this.that_e_name = item.e_name;

      this.tag = this.tags[val];
      this.member_text = "选择" + item.c_name;
      this.visible = true;
      //清空数据
      this.visiblerange = {
        visible: false, // 可见范围弹窗
        visual: [], //临时数据
        visuals: [], //使用数据弹框
      };
    },
    //组织架构确认
    handleOk_ren() {
      this.before_input_arr = this.data_screen(this.that_e_name);
      this.select_data[this.that_e_name] = [];
      this.all_data[this.that_e_name] = [];
      if (this.that_e_name == "main_delivery") {
        this.select_data.reviewer = [];

        //设置接收人
        this.visiblerange.visual.forEach((el) => {
          if (el.receiver_name) {
            if (this.select_data.reviewer) {
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
      } else {
        this.visiblerange.visual.forEach((el) => {
          this.select_data[this.that_e_name].push({
            id: el.value,
            name: el.title,
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
      if (this.$route.query.type == 3 && this.select_data.reviewer) {
        delete this.select_data.reviewer;
      }
      this.set_vuex_data();
    },

    //设置发文单位，签发人，主送单位数据
    set_vuex_data() {
      for (let key in this.select_data) {
        let mothods_name = null;
        mothods_name = `SET_QUICK_DOCUMENT_HEADER_${key}`;
        this.$store.commit(mothods_name, {
          select: this.select_data[key],
          text: this.data_screen(key).join(),
        });
      }
    },

    //数据筛选
    data_screen(key) {
      //选择的数组（用于判断）
      let zanshi = [];
      this.select_data[key].forEach((el) => {
        zanshi.push(el.name);
      });

      let text_copy_users = [];
      this.all_data[key].forEach((el) => {
        if (!zanshi.includes(el)) {
          text_copy_users.push(el);
        }
      });

      return text_copy_users;
    },

    //字号规则设置
    async handleOk_role() {
      let { code } = await check_word_wo_re({
        word_no: this.get_model.word_no.value.word_no,
      });
      if (code == 1) {
        this.role_data.visible_role = false;
        this.role_data.all_word_no.forEach((el) => {
          if (el.id === this.get_model.word_no.value) {
            this.role_data.show_text = el.word_no;
          }
        });
      }
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

    head_data_deselect(e_name, option) {
      this.select_data[e_name].forEach((el, index) => {
        if (el.name == option) {
          setTimeout(() => {
            this.select_data[e_name].splice(index, 1);
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

    async chuli_data() {
      if (!this.all_data) {
        //设置当前页面下拉选择的页面
        if (this.$route.query.d_id && this.head_need_data) {
          this.all_data = {};
          this.select_data = {};
          for (let key in this.head_need_data) {
            let a_value = [];
            let sel_val = [];
            if (this.head_need_data[key].input_type_new >= 3) {
              if (
                this.head_need_data[key].value &&
                this.head_need_data[key].value.select &&
                this.head_need_data[key].e_name !== "word_no"
              ) {
                this.head_need_data[key].value.select.forEach((el) => {
                  a_value.push(el.name);
                  sel_val.push(el);
                });
              }
              if (this.head_need_data[key].value.text) {
                let text_arr = this.head_need_data[key].value.text.split(",");
                a_value = [...text_arr, ...a_value];
              }
              if (key == "word_no") {
                this.role_data.show_text = this.head_need_data[key].value.name;
              }
              this.$set(
                this.all_data,
                this.head_need_data[key].e_name,
                a_value
              );
              this.$set(
                this.select_data,
                this.head_need_data[key].e_name,
                sel_val
              );
            }
          }
          delete this.all_data.word_no;
          delete this.select_data.word_no;
        } else {
          if (this.$route.query.d_id) {
            return;
          }
          this.all_data = {};
          this.select_data = {};
          for (let key in this.head_data) {
            if (this.head_data[key].input_type == 3) {
              this.$set(this.all_data, this.head_data[key].e_name, []);
              this.$set(this.select_data, this.head_data[key].e_name, []);
            }
          }
          delete this.all_data.word_no;
          delete this.select_data.word_no;
          let data = await urgent_type_list({ limit: 99999 });
          let data2 = await secret_type_list({ limit: 99999 });
          //设置头部数据格式
          let head = {};
          let _userinfo = JSON.parse(window.sessionStorage.getItem("userinfo"));
          this.head_data.forEach((el) => {
            el.value = undefined;
            0.0;
            head[el.e_name] = el;
            if (el.e_name == "secret_level") {
              el.child = data2.data.data;
              if (el.child != 0 && el.child != undefined) {
                el.value = el.child[0].id;
              }
            }
            if (el.e_name == "urgent_level") {
              el.child = data.data.data;
              if (el.child != 0 && el.child != undefined) {
                el.value = el.child[0].id;
              }
            }
            if (el.e_name == "word_no") {
              el.value = { id: "", word_no: "" };
            }
          });
          this.$store.commit(
            "SET_QUICK_DOCUMENT_HEADER",
            JSON.parse(JSON.stringify(head))
          );
        }
        this.get_document_wordno_manager();
      }
    },
  },
  watch: {
    head_need_data() {
      this.chuli_data();
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../css/header.less");
.title2-icon {
  position: relative;
  top: 1px;
  left: 3px;
}
</style>