<template>
  <div class="addInpostrafts-header-box" v-if="data && head_need_data">
    <div class="title">
      <div>
        <span class="text">{{ nav[$route.query.type - 1] }}单</span>
      </div>
      <div>
        <a-button @click="reste_data">清空</a-button>
      </div>
    </div>

    <div class="line">
      <div class="flex-s" v-for="(item, index) in get_model" :key="index">
        <div class="title2">
          <span class="must" v-if="item.is_must == 1">*</span>
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
          :class="{
            active:
              (!verification(item.e_name) && verification_flag) ||
              (item.e_name == 'word_no' && isok_word_no),
          }"
        >
          <div
            class="receiving_time"
            style="flex: 1"
            v-if="item.e_name == 'receiving_time'"
          >
            <a-date-picker
              :disabledDate="disabledDate"
              format="YYYY-MM-DD"
              v-model="item.value"
              :default-value="moment(new Date(), 'YYYY-MM-DD')"
            />
          </div>
          <a-input
            :maxLength="20"
            v-model="item.value"
            v-else-if="
              item.input_type == 1 &&
              item.e_name != 'issuer' &&
              item.e_name != 'received_delivery'
            "
            :placeholder="
              item.e_name == 'title' ? `请输入${item.c_name}` : '请输入'
            "
          />
          <a-select
            mode="tags"
            placeholder="请输入"
            style="width: 380px"
            v-else-if="
              item.input_type == 1 &&
              (item.e_name == 'issuer' || item.e_name == 'received_delivery')
            "
            @deselect="head_data_deselect(item.e_name, $event)"
            :open="false"
            v-model="all_data[item.e_name]"
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
            class="word-no"
            v-else-if="item.input_type == 3 && item.e_name == 'word_no'"
          >
            <span class="flex-col">
              <div class="flex-col">
                <span style="margin-right: 10px"
                  >{{ nav[$route.query.type - 1] }}后自动生成</span
                >
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
            v-if="item.input_type_new == 5 && item.e_name == 'copy_users'"
          >
            <a-select
              @deselect="head_data_deselect(item.e_name, $event)"
              mode="tags"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
              :open="false"
            ></a-select>
            <i
              class="icon"
              :class="judgment_icon.member"
              @click="show_organizate(7, item)"
            ></i>
          </div>
          <div
            class="fine"
            v-if="item.input_type_new == 5 && item.e_name != 'copy_users'"
          >
            <a-select
              mode="tags"
              @deselect="head_data_deselect(item.e_name, $event)"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
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
              @deselect="head_data_deselect(item.e_name, $event)"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
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
              @deselect="head_data_deselect(item.e_name, $event)"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
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
              @deselect="head_data_deselect(item.e_name, $event)"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
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
              @deselect="head_data_deselect(item.e_name, $event)"
              placeholder="请选择/输入"
              style="width: 380px"
              @change="select_handleChange"
              v-model="all_data[item.e_name]"
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

    <!-- 字号设置弹窗 -->
    <a-modal
      :title="`${nav[$route.query.type - 1]}字号`"
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
          <div class="hand set" @click="set_new_role">设置新的规则</div>
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
import { document_wordno_manager, check_word_wo_re } from "@/api/draft";
import moment from "moment";
import { getDates } from "@/js/public.js";
export default {
  name: "Header",
  props: {
    data: {
      default: null,
    },
    head_need_data: { default: null },
    verification_flag: { default: null },
    isok_word_no: { default: null },
  },
  data() {
    return {
      head_model: null,
      nav: ["发文", "收文", "签报", "", "发文", "收文"],
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

      //（用于数据显示）
      all_data: null,
      //（用于数据提交）
      select_data: null,
      member_text: "人员选单",

      //0（组织架构(限单位)）
      //1（组织架构(限人)）
      //2（发文收文单位(单位)）
      //3发文单位、组织架构单位
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

      //判断是哪个打开的窗口
      //0（组织架构(限单位)）
      //1（组织架构(限人)）
      //2（发文收文单位(单位)）
      //3（发文收文单位(单位),组织架构人）
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
      },

      before_input_arr: [],
      // 跳转流程页面弹窗控制
      jumpPopup: {
        visible: false, // 弹窗开关
        centenText: "字号规则", // 打开的按钮
      },
    };
  },
  components: { Framelist },
  created() {
    //接收提交组件发过来的事件，提交数据到vuex
    this.$bus.$on("document_header", this.set_vuex_data);

    // 上传图片更新发文单
    this.$bus.$off("updata_upload_header_data");
    this.$bus.$on("updata_upload_header_data", (res) => {
      res.forEach((el) => {
        this.all_data[el.e_name].push(el.value);
      });
      this.set_vuex_data();
    });
    this.get_father_data();
  },

  mounted() {},
  computed: {
    get_model() {
      console.log(this.$store.state.document_all.header);
      return this.$store.state.document_all.header;
    },
  },
  methods: {
    moment,
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
      let path = null;
      switch (parseInt(this.$route.query.type)) {
        case 1:
          path = "/postruleset/add";
          break;
        case 2:
          path = "/getruleset/addressee";
          break;
        case 3:
          path = "/signoffruleset/signoffadd";
          break;
        default:
          path = "/postruleset/add";
      }
      this.$router.push(path);
    },
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
    reste_data() {
      this.all_data = {};
      this.select_data = {};
      if (this.$route.d_id || this.$route.d_id == 0) {
      } else {
        this.get_father_data();
      }
      this.head_need_data.title.value = "";
      this.$store.commit("SET_DOCUMENT_HEADER", this.head_need_data);
    },
    select_handleChange(value) {},
    search_change(value) {},

    //字号搜索
    word_no_search() {
      this.get_document_wordno_manager();
    },
    //字号选择改变
    word_no_change(val) {
      this.role_data.all_word_no.forEach((el) => {
        if (el.id === val.target.value) {
          this.$store.commit("SET_DOCUMENT_WORD_NO", el.word_no);
        }
      });
    },

    //设置新字号
    set_new_role() {
      this.role_data.visible_role = false;
      this.jumpPopup.visible = true;
    },

    //显示组织机构
    show_organizate(val, item) {
      //0（组织架构(限单位)）
      //1（组织架构(限人)）
      //2（发文收文单位(单位)）
      //3发文单位、组织架构单位
      //4发文单位、组织架构人

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
      //格式变化
      //主送单位
      // if (this.visiblerange.visual.length==0) {
      //   this.$message.error(`人员不能为空`);
      //   return false;
      // }
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
      let set_data = {};
      for (let key in this.select_data) {
        set_data[key] = {
          select: JSON.parse(JSON.stringify(this.select_data[key])) || [],
          text: this.data_screen(key).join(),
        };
      }
      this.$store.commit("SET_DOCUMENT_HEADER_select", set_data);
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

    //字号规则设置
    async handleOk_role() {
      if (this.head_need_data.word_no.is_must == 1) {
        let { code } = await check_word_wo_re({
          word_no: this.get_model.word_no.value.word_no,
          id: this.$route.query.d_id || "",
        });
        if (code == 1) {
          this.role_data.visible_role = false;
          this.role_data.all_word_no.forEach((el) => {
            if (el.id === this.get_model.word_no.value) {
              this.data.word_no = el.word_no;
            }
          });
          this.$emit("update:isok_word_no", false);
        }
      } else {
        this.role_data.visible_role = false;
        this.role_data.all_word_no.forEach((el) => {
          if (el.id === this.get_model.word_no.value) {
            this.data.word_no = el.word_no;
          }
        });
        this.$emit("update:isok_word_no", false);
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

    //拿到父组件传过来的数据
    get_father_data() {
      if (this.head_need_data && !this.all_data) {
        this.all_data = {};
        this.select_data = {};
        if (this.$route.query.file_id || this.$route.query.d_id) {
          for (let key in this.head_need_data) {
            let a_value = [];
            let sel_val = [];
            if (
              this.head_need_data[key].input_type_new == 1 &&
              (key == "issuer" || key == "received_delivery")
            ) {
              this.head_need_data[key].input_type_new = 3;
            }
            if (key == "receiving_time") {
              this.$set(
                this.head_need_data[key],
                "value",
                getDates(new Date())
              );
            }
            if (
              [3, 5, 6, 7, 8, 9].includes(
                parseInt(this.head_need_data[key].input_type_new)
              )
            ) {
              if (
                (key == "issuer" || key == "received_delivery") &&
                this.head_need_data[key].input_type_new != 5
              ) {
                this.head_need_data[key].value = {
                  select: [],
                  text: this.head_need_data[key].value,
                };
              }
              if (this.head_need_data[key].value) {
                if (
                  this.head_need_data[key].value.select &&
                  this.head_need_data[key].value.select.length &&
                  key !== "word_no"
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
              }
              if (key == "word_no") {
                this.data.word_no = this.head_need_data[key].value2;
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
          for (let key in this.head_need_data) {
            if (key == "issuer" || key == "received_delivery") {
              this.head_need_data[key].input_type_new = 3;
            }
            if (
              [3, 5, 6, 7, 8, 9].includes(
                parseInt(this.head_need_data[key].input_type_new)
              )
            ) {
              this.$set(this.all_data, this.head_need_data[key].e_name, []);
              this.$set(this.select_data, this.head_need_data[key].e_name, []);
            }
          }
          delete this.all_data.word_no;
          delete this.select_data.word_no;
        }
        let _userinfo = JSON.parse(window.sessionStorage.getItem("userinfo"));
        if (
          this.select_data["receiving_user"] &&
          [2].includes(parseInt(this.$route.query.type))
        ) {
          this.select_data.receiving_user.push({
            id: _userinfo.id,
            name: _userinfo.name,
          });
          this.all_data.receiving_user.push(_userinfo.name);

          this.all_data.receiving_user = Array.from(
            new Set(this.all_data.receiving_user)
          );
          this.select_data.receiving_user = Array.from(
            new Set(this.select_data.receiving_user)
          );
        }
        for (let key in this.all_data) {
          this.all_data[key] = Array.from(new Set(this.all_data[key]));
        }
        this.get_document_wordno_manager();
      }
      this.$store.commit("SET_DOCUMENT_HEADER", this.head_need_data);
      if ((this.$route.query.type == 1||this.$route.query.type == 3)&&this.get_model) {
        this.get_model.issuer.input_type_new = 5;
      }else if(this.$route.query.type == 2&&this.get_model){
        this.$set(this.get_model.receiving_time,'value',getDates(new Date()))
      }
    },

    //验证
    verification(e_name) {
      let document_arr = [];
      for (let key in this.get_model) {
        document_arr.push({
          value: this.get_model[key].value,
          c_name: this.get_model[key].c_name,
          e_name: this.get_model[key].e_name,
          is_must: this.get_model[key].is_must,
        });
      }
      let judge = {};
      document_arr.forEach((el) => {
        let flag = null;
        if (el.value) {
          if (el.value.select) {
            if (el.value.select.length > 0 || el.value.text.length > 0) {
              flag = true;
            } else {
              if (el.is_must == 1) {
                flag = false;
              } else {
                flag = true;
              }
            }
          } else {
            flag = true;
          }
        } else {
          if (el.is_must == 1) {
            flag = false;
          } else {
            flag = true;
          }
        }

        judge[el.e_name] = {
          flag,
          c_name: el.c_name,
          e_name: el.e_name,
        };
      });
      return judge[e_name].flag;
    },
  },

  watch: {
    data() {
      this.role_data.zanshi_word_no = this.data.word_no;
    },
    head_need_data() {
      this.get_father_data();
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../css/header.less");
/deep/.ant-calendar-picker {
  width: 100%;
}
.title2 {
  position: relative;
}
.title2-icon {
  position: absolute;
  right: 14px;
  top: 14px;
}
/deep/ .ant-select-selection--multiple .ant-select-selection__choice {
  background: none;
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
  }
}

/deep/ .ant-calendar-picker-clear {
  right: 21px;
}
</style>