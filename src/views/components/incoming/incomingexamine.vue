    <template>
  <div>
    <a-affix style="z-index: 12; position: relative" :offset-top="64">
      <div class="title">
        <div @click="reverts" class="flex-col hand">
          <img class="retuLeft" src="../../../assets/left.png" alt />
          {{ all_data.data.title }}
        </div>
        <div>
          <!-- 全部文件夹 -->
          <NewDocument
            @delNewDoucument="delNewDoucument"
            :TemplatePopup="TemplatePopup"
          />
        </div>
      </div>
    </a-affix>
    <Maincontent class="incomingexamine-Maincontent">
      <!-- 选择人员弹窗 -->
      <a-modal
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="preview_document(1)"
        @cancel="person_close"
        title="人员选单"
        class="circulation"
      >
        <div>
          <Framelist
            :show_data_flag="visible"
            :range="visiblerange"
            :tag="tag"
            :restype="4"
          />
        </div>
      </a-modal>
      <div
        :style="get_stata.leftdata.auth.can_readexamine == 0 ? w_style : ''"
        class="maincontent-box maincontent-left flex-col-bd"
      >
        <div class="maincontent-left-top">
          <a-tabs v-model="activeKey" @change="change">
            <a-tab-pane :key="1">
              <span slot="tab">
                <SvgIcon :item="'Sendinginfo'" />
                {{ all_data.data.nav[0] }}
              </span>
              <Gendinginfo />
            </a-tab-pane>
            <a-tab-pane :key="2">
              <span slot="tab">
                <SvgIcon :item="'Textcontent'" />
                {{ all_data.data.nav[1] }}
              </span>
              <Bodycontent
                v-if="all_data.data.id != ''"
                :manager="all_data.data"
              />
            </a-tab-pane>
            <a-tab-pane :key="3" v-if="get_stata.leftdata.auth.is_show == 1">
              <span slot="tab">
                <SvgIcon :item="'Attachment'" />
                {{ all_data.data.nav[2] }}
              </span>
              <Attachment
                v-if="all_data.data.id != ''"
                :file_path="all_data.data"
              />
            </a-tab-pane>
            <a-tab-pane :key="4" v-if="get_stata.leftdata.auth.is_show == 1">
              <span slot="tab">
                <SvgIcon :item="'Processinfo'" />
                {{ all_data.data.nav[3] }}
              </span>
              <Processcontent :processing="all_data.data.processing" />
            </a-tab-pane>
            <a-tab-pane :key="5" v-if="get_stata.leftdata.auth.is_show == 1">
              <span slot="tab">
                <SvgIcon :item="'Behaviorstatis'" />
                {{ all_data.data.nav[4] }}
              </span>
              <Conductstatis />
            </a-tab-pane>
          </a-tabs>
          <a-button class="seefile-link" type="link" @click="preview_document"
            >预览公文内容</a-button
          >
        </div>
        <!-- 报废logo -->
        <div class="scrap" v-if="all_data.data.iswastetank">
          <img src="../../../assets/addpostset/scrap.png" alt srcset />
        </div>
      </div>
      <div
        v-if="
          get_stata.leftdata.auth.can_readexamine &&
          get_stata.leftdata.auth.is_show == 1
        "
        class="maincontent-box maincontent-right"
      >
        <a-tabs
          :default-active-key="
            get_stata.leftdata.auth.can_approval == 0
              ? '2'
              : get_stata.leftdata.auth.can_approval == 1
              ? '1'
              : '0'
          "
        >
          <a-tab-pane
            key="0"
            tab="当前审批"
            v-if="get_stata.leftdata.auth.can_approval == 2"
          >
            <CurrentApproval :manager="all_data.data" />
          </a-tab-pane>
          <a-tab-pane
            key="1"
            tab="接受审批"
            v-if="get_stata.leftdata.auth.can_approval == 1"
          >
            <Accept />
          </a-tab-pane>
          <a-tab-pane key="2" tab="意见汇总">
            <Summary />
          </a-tab-pane>
          <a-tab-pane key="3" tab="附件列表">
            <EnclosureList />
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- <div class="preview-title-box flex-col"
           :class="vis3?'preview-title-boxs':''">
        <span style="display:flex;">
          呈送/分发/传阅单位或人员：
          <span class="preview-box-title">{{usernames}}</span>
          ，呈送后不可撤回，确认{{titleTxt}}？
        </span>
        <div class="flex-col-bd"></div>
        <a-button @click="ClosePreview">取消</a-button>
        <a-button type="primary"
                  style="margin-left:10px;"
                  @click="onSendOut">确定</a-button>
      </div>-->
      <!-- 预览公文内容 -->
      <a-modal
        class="preview-modal"
        @cancel="ClosePreview"
        v-model="ViewDocument.vis2"
        footer
      >
        <div id="print" ref="print">
          <ViewDocument
            :Popup="Popup"
            :ViewDocument="ViewDocument"
            :datas="$store.state.leftdata"
            v-if="ViewDocument.vis2"
          />
        </div>
      </a-modal>
      <div
        class="scrap"
        v-if="$route.query.area_type && $route.query.area_type == 2"
      ></div>
      <a-affix
        :offset-bottom="0"
        v-if="get_stata.leftdata.auth.is_show == 1"
        class="btn-bg-box"
      >
        <div class="btn-bg flex-col">
          <div class="flex-col-bd"></div>
          <a-button
            class="bcbtn"
            v-if="
              get_stata.leftdata.button.dayin &&
              (powers('post_print') ||
                powers('get_print') ||
                powers('sign_print')) &&
              $route.query.file_type == 2
            "
            @click="dayin"
            >打印</a-button
          >
          <a-button
            class="bcbtn"
            v-if="
              get_stata.leftdata.button.guidang && $route.query.file_type == 2
            "
            @click="guidang"
            >归档</a-button
          >
          <a-button
            class="bcbtn"
            v-if="
              get_stata.leftdata.button.xiazai &&
              (powers('post_download') ||
                powers('get_download') ||
                powers('sign_download')) &&
              $route.query.file_type == 2
            "
            @click="xiazai"
            >下载</a-button
          >
          <a-button
            class="bcbtn"
            v-if="
              get_stata.leftdata.button.baofei &&
              (powers('post_scrap') ||
                powers('get_scrap') ||
                powers('sign_scrap')) &&
              $route.query.file_type == 2
            "
            @click="baofei"
            >报废</a-button
          >
          <a-button
            type="primary"
            v-if="
              get_stata.leftdata.button.chuanyue &&
              (powers('post_circulated') ||
                powers('get_circulated') ||
                powers('sign_circulated'))
            "
            class="bcbtn"
            @click="chuanyue"
            >传阅</a-button
          >
          <a-button
            type="primary"
            class="bcbtn"
            v-if="get_stata.leftdata.button.chehui"
            @click="chehui"
            >撤回</a-button
          >
          <a-button
            type="primary"
            v-if="get_stata.leftdata.button.tijiao"
            class="bcbtn"
            @click="approval"
            >提交</a-button
          >
          <a-button
            type="primary"
            v-if="
              get_stata.leftdata.button.chengsong &&
              (powers('post_presented') ||
                powers('get_presented') ||
                powers('sign_presented'))
            "
            class="bcbtn"
            @click="preview_document(2)"
            >呈送</a-button
          >
          <a-button
            type="primary"
            v-if="
              get_stata.leftdata.button.fenfa &&
              (powers('post_distribution') ||
                powers('get_distribution') ||
                powers('sign_distribution'))
            "
            class="bcbtn"
            @click="fenfa"
            >分发</a-button
          >
          <a-button
            type="primary"
            v-if="
              get_stata.leftdata.button.fabu &&
              (powers('post_release') ||
                powers('get_release') ||
                powers('sign_release'))
            "
            class="bcbtn"
            @click="fabu"
            >发布</a-button
          >
          <a-button
            type="primary"
            class="bcbtn"
            v-if="get_stata.leftdata.button.zhuanfawen"
            @click="zhuanfawen"
            >转发文</a-button
          >
          <a-button
            class="bcbtn"
            type="primary"
            v-if="get_stata.leftdata.button.shanchu"
            @click="all_data.methods.dele"
            >删除</a-button
          >
          <a-dropdown
            v-if="
              ((get_stata.leftdata.button.dayin &&
                (powers('post_print') ||
                  powers('get_print') ||
                  powers('sign_print'))) ||
                (get_stata.leftdata.button.baofei &&
                  (powers('post_scrap') ||
                    powers('get_scrap') ||
                    powers('sign_scrap'))) ||
                (get_stata.leftdata.button.xiazai &&
                  (powers('post_download') ||
                    powers('get_download') ||
                    powers('sign_download'))) ||
                get_stata.leftdata.button.guidang) &&
              $route.query.file_type != 2
            "
            placement="topCenter"
          >
            <a-button style="margin-left: 20px">
              <a-icon class="more" type="unordered-list" />更多
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item
                v-if="
                  get_stata.leftdata.button.dayin &&
                  (powers('post_print') ||
                    powers('get_print') ||
                    powers('sign_print'))
                "
                @click="dayin"
                >打印</a-menu-item
              >
              <a-menu-item
                v-if="
                  get_stata.leftdata.button.guidang &&
                  $route.query.file_type != 2
                "
                @click="guidang"
                >归档</a-menu-item
              >
              <a-menu-item
                v-if="
                  get_stata.leftdata.button.baofei &&
                  (powers('post_scrap') ||
                    powers('get_scrap') ||
                    powers('sign_scrap'))
                "
                @click="baofei"
                >报废</a-menu-item
              >
              <a-menu-item
                v-if="
                  get_stata.leftdata.button.xiazai &&
                  (powers('post_download') ||
                    powers('get_download') ||
                    powers('sign_download'))
                "
                @click="xiazai"
                >下载</a-menu-item
              >
            </a-menu>
          </a-dropdown>
        </div>
      </a-affix>
    </Maincontent>
  </div>
</template>
<script>
import Maincontent from "@/views/components/maincontent.vue";
import Gendinginfo from "@/views/components/incoming/components/left/Gendinginfo.vue";
import Conductstatis from "@/views/components/incoming/components/left/Conductstatis.vue";
import Bodycontent from "@/views/components/incoming/components/left/Bodycontent.vue";
import Attachment from "@/views/components/incoming/components/left/Attachment.vue";
import Processcontent from "@/views/components/incoming/components/left/Processcontent.vue";
import Accept from "@/views/components/incoming/components/right/accept.vue";
import Summary from "@/views/components/incoming/components/right/summary.vue";
import EnclosureList from "@/views/components/incoming/components/right/enclosureList.vue";
import CurrentApproval from "@/views/components/incoming/components/right/currentapproval.vue";
import { manage_detail, del_manage } from "@/api/file_management.js";
import {
  get_approval,
  file_manager_circulation,
  approval_revoke,
  approval_scrap,
  document_distribute,
  document_forward_Send,
  approval_my_shift,
  document_status,
  document_release,
} from "@/api/incoming.js";
import { Getpostruleseinfo } from "@/api/postruleset.js";
import { printing_add } from "@/api/public.js"; // 上传当前行为记录的api接口
import { document_add_fast } from "@/api/quick_post.js";
import { document_add, document_wordno_manager } from "@/api/draft.js";
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
import Ottree from "@/views/components/incoming/components/other/ottree.vue";
import SvgIcon from "@/views/components/svgicon.vue";
import NewDocument from "@/views/components/NewDocument.vue";
import ViewDocument from "@/views/components/viewDocument.vue";
import { HttpUrl } from "@/js/public.js";
import { nextTick } from "vuedraggable";
export default {
  name: "incoming",
  props: {
    all_data: {
      default: function () {
        return {
          data: {
            title: "",
            nav: "",
            son_type: "",
            id: "",
            fields: "",
            content: "",
            file_path: "",
            create_time: "",
          },
          methods: {
            get_detail: "",
            init: "",
            dele: "",
            handleOk: "",
            onSearch: "",
          },
        };
      },
    },
  },
  data() {
    return {
      // tabs切换
      activeKey: 1,
      // 选着归档id
      avt_id: "",
      tag: {
        tab: true,
        bm: true,
        pe: true,
        company: true,
        label: true,
        role: true,
        lately: true,
      },
      // 样式
      w_style: {
        width: "1280px",
      },
      //传阅
      visible: false,
      ViewDocument: {
        // 预览
        vis2: false,
        condition: false, // 是否是打印，如果是的话就要打开分页
      },
      vis3: false,
      confirmLoading: false,
      radio: 1,

      //传阅
      circulation: {
        tab: 1,
      },
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      btn_type: 1, // 哪个按钮打开了弹窗 1传阅 2分发
      // 转发文打开发文模板弹窗数据
      TemplatePopup: {
        visibles: false,
        type: 1,
        title: "选择发文模板",
        type2: 5,
        file_id: this.$route.query.id,
      },
      //预览数据
      view_data: {
        fir: [],
        sec: [],
      },
      //全部发文字号
      all_word_no: null,

      Popup: {
        usernames: "",
        titleTxt: "",
        onSendOut: this.onSendOut,
        onClose: this.ClosePreview,
        vis3: false,
      },
    };
  },
  created() {
    this.$bus.$on("tabs_change", (v) => {
      this.activeKey = 2;
    });
    this.get_document_wordno_manager();
  },
  computed: {
    // 获取权限
    jurisdiction() {
      let num;
      if (this.$route.query.file_type == 1) {
        num = 1;
      } else if (this.$route.query.file_type == 2) {
        num = 2;
      } else if (this.$route.query.file_type == 3) {
        num = 3;
      }
      return this.$store.state.jurisdiction[num];
    },
    get_stata() {
      return this.$store.state;
    },
    //获取头部数据
    get_leftdata() {
      return this.$store.state.leftdata.fields;
    },
    //获取正文
    get_content() {
      return this.$store.state.leftdata.content;
    },
    get_now_time() {
      var date = new Date();
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    },
  },
  methods: {
    //关闭选人
    person_close() {
      this.visiblerange = {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      };

      this.visible = false;
    },
    // 预览头部确定按钮，呈送/分发/传阅
    onSendOut() {
      this.ViewDocument.vis2 = false;
      this.Popup.vis3 = false;
      if (this.Popup.titleTxt == "呈送") {
        if (this.$store.state.leftdata.status == 20) {
          this.forward_send();
        } else {
          this.chengsong();
        }
      } else {
        if (this.$store.state.leftdata.status == 20) {
          this.handleOk_ren();
        } else {
          this.handleOk_rens();
        }
      }
    },
    //判断发文信息是否有值
    has_head_data() {
      this.remind();
      let document_arr = [];
      for (let key in this.get_leftdata) {
        document_arr.push({
          value: this.get_leftdata[key].value,
          c_name: this.get_leftdata[key].c_name,
          e_name: this.get_leftdata[key].e_name,
        });
      }

      let judge = [];

      document_arr.forEach((el) => {
        if (el.value) {
          if (el.value.select) {
            if (el.value.select.length > 0 || el.value.text.length > 0) {
              judge.push({
                flag: true,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            } else {
              judge.push({
                flag: false,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            }
          } else if (el.e_name == "word_no") {
            if (el.value.id || el.value.name) {
              judge.push({
                flag: true,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            } else {
              judge.push({
                flag: false,
                c_name: el.c_name,
                e_name: el.e_name,
              });
            }
          } else {
            judge.push({
              flag: true,
              c_name: el.c_name,
              e_name: el.e_name,
            });
          }
        } else {
          judge.push({
            flag: false,
            c_name: el.c_name,
            e_name: el.e_name,
          });
        }
      });

      let no = judge.filter((el) => !el.flag);
      if (no.length <= 0) {
        if (!/\p{Unified_Ideograph}/u.test(this.get_all.content.text)) {
          this.$message.error(`请完善正文内容,且正文内容应包含中文`);
          return false;
        }
        return true;
      } else {
        this.$message.error(`请完善${no[0].c_name}的内容`);
        return false;
      }
    },
    //呈送
    forward_send() {
      this.ViewDocument.condition = false;
      if (this.has_head_data) {
        this.visiblerange = {
          visible: false, // 可见范围弹窗
          visual: [], // 弹窗
          visuals: [], // 不是弹框
        };
        this.go_document_add(12, 4);
      } else {
        this.verification_flag = true;
      }
    },
    //提交传阅/分发
    handleOk_ren() {
      this.ViewDocument.condition = false;
      if (this.has_head_data) {
        this.visiblerange.visual.forEach((el) => {
          switch (el.type) {
            //部门
            case 1:
              el.flag = 1;
              el.id = el.value;
              break;
            //人
            case 2:
              el.flag = 4;
              el.id = el.value;
              break;
            //标签
            case 4:
              el.flag = 2;
              el.id = el.value;
              break;
            //角色
            case 5:
              el.flag = 3;
              el.id = el.value;
              break;
            //发文收文单位
            case 3:
              el.flag = 5;
              el.id = el.value;
              break;
            //最近选择
            case 6:
              el.flag = 4;
              el.id = el.value;
              break;
          }
        });
        if (this.btn_type == 1) {
          this.go_document_add(2, 5);
        }
        if (this.btn_type == 2) {
          this.go_document_add(2, 3);
        }
      } else {
        this.verification_flag = true;
      }
      this.visible = false;
    },
    //添加接口
    async go_document_add(status = "", button = "", NoJump = "111") {
      //转时间
      let all_time = "";

      //发文信息数据转换
      let document_arr = {};
      for (let key in this.get_leftdata) {
        if (
          this.get_leftdata[key]?.value?.text &&
          typeof this.get_leftdata[key]?.value?.text == "object"
        ) {
          this.get_leftdata[key].value.text = this.get_leftdata[
            key
          ].value.text.join(",");
        }
        if (
          this.get_leftdata[key].input_type == 1 &&
          (this.get_leftdata[key].e_name == "issuer" ||
            this.get_leftdata[key].e_name == "received_delivery")
        ) {
          this.get_leftdata[key].value = this.get_leftdata[key].value.text;
        }
        document_arr[key] = this.get_leftdata[key].value || "";
      }
      document_arr.word_no = this.$store.state.leftdata.word_no.id;
      let word_no = this.$store.state.leftdata.word_no;
      // let res = await Getpostruleseinfo({
      //   id: document_arr.word_no,
      // });
      // word_no = this.res.data;
      let approval_where = [];
      let users_ids = [];

      // this.get_all.process.approval_where.forEach((el) => {
      //   users_ids.push(el.users[0].id);
      // });

      // if (this.get_all.process.liucheng_id == "next") {
      //   approval_where = [
      //     {
      //       users: [{ flag: 3, id: users_ids.join() }],
      //       approver_type: this.get_all.process.approval_way,
      //     },
      //   ];
      // } else {
      //   approval_where = this.get_all.process.approval_where;
      // }

      let process_id = "";
      // if (
      //   this.get_all.process.liucheng_id &&
      //   this.get_all.process.liucheng_id != "next" &&
      //   this.get_all.process.liucheng_id != "null"
      // ) {
      //   process_id = this.get_all.process.liucheng_id;
      // }

      let red_templete_id = this.$store.state.leftdata.red_template_model.id;

      //签章
      let process_signature = JSON.parse(
        JSON.stringify(this.get_stata.use_zhang)
      );
      let signature_arr = [];
      process_signature.forEach((el) => {
        signature_arr.push({
          signature_base: el.signature_base,
          signature_img: el.signature_img,
          signature_id: el.signature_id,
          position: el.position,
        });
      });
      let process_signature_other = JSON.parse(
        JSON.stringify(this.get_stata.other_zhang)
      );
      for (let i = 0; i < this.all_data.data.signature.length; i++) {
        process_signature_other.forEach((el, index) => {
          if (el.id == this.all_data.data.signature[i].id) {
            let _position1 = this.all_data.data.signature[i].position;
            let _position2 = el.position;
            if (
              _position1.left == _position2.left &&
              _position1.right == _position2.right &&
              _position1.width == _position2.width
            ) {
              process_signature_other.splice(index, 1);
            }
          }
        });
      }

      signature_arr = [...signature_arr, ...process_signature_other];

      signature_arr.sort(function (a, b) {
        return a.position.zindex - b.position.zindex;
      });
      signature_arr.forEach((el, index) => {
        el.position.zindex = index;
      });
      let data = await document_add_fast({
        id: this.$route.query.id,
        document_arr,
        content: this.$store.state.leftdata.content,
        enclosure_file: this.$store.state.leftdata.enclosure,
        approval_where,
        approval_copy: [],
        status,
        button,
        arr: this.visiblerange.visual || "",
        handles: {
          opinion: this.$store.state.toexamine.explain,
          files: this.$store.state.toexamine.files,
          notice: this.$store.state.toexamine.notice,
          process_urgent_level: this.$store.state.toexamine
            .process_urgent_level,
          where_id: this.$store.state.toexamine.where_id,
          way: this.$store.state.toexamine.way,
        },
        red_templete_id,
        deptid: this.$store.state.leftdata.deptid,
        process_id,
        signature_arr,
        word_no,
      });

      if (NoJump != "NoJump") {
        if (data.code == 1) {
          let _obj = {
            8: "/library",
            3: "/library",
            2: "/pending",
          };
          setTimeout(() => {
            this.$router.push({
              path: _obj[data.status],
            });
          }, 1000);
          this.visible = false;
        }
      }
    },

    //叫组件提交数据到vuex
    remind() {
      this.$bus.$emit("get_Uploaded_files"); // 附件
      this.$bus.$emit("Set_content_data_data"); // 正文
    },

    // // 预览头部确定按钮，呈送/分发/传阅
    // onSendOut() {
    //   if (this.Popup.titleTxt == "呈送") {
    //     this.chengsong();
    //   } else {
    //     this.handleOk_ren();
    //   }
    // },
    // 关闭预览公文
    ClosePreview() {
      this.ViewDocument.vis2 = false;
      this.Popup.vis3 = false;
      this.Popup.titleTxt = "";
      this.visiblerange = {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      };
    },
    //获取全部字号
    async get_document_wordno_manager() {
      let { data } = await document_wordno_manager({
        type: this.$route.query.type,
      });
      this.all_word_no = data;
    },

    change(e) {},
    // 权限判断
    powers(text) {
      return this.jurisdiction.includes(text);
    },
    //打印
    dayin(e) {
      this.ViewDocument.condition = true;
      this.ViewDocument.vis2 = true;
      this.tell_other();
      setTimeout(() => {
        this.$print(this.$refs.print);
        this.ViewDocument.vis2 = false;
      });
      printing_add({
        cut: Number(this.$route.query.cut),
        lab: 1,
        id: Number(this.$route.query.id),
      }).then((data) => {
        this.$bus.$emit("incomingexamineXiaZai");
      });
    },
    //下载
    xiazai(e) {
      this.ViewDocument.condition = false;
      this.ViewDocument.vis2 = true;
      this.tell_other();
      setTimeout(() => {
        let data = this.getPdf("#print");
      }, 500);
      setTimeout(() => {
        this.ViewDocument.vis2 = false;
      }, 1000);
      printing_add({
        cut: Number(this.$route.query.cut),
        lab: 2,
        id: Number(this.$route.query.id),
      }).then((data) => {
        this.$bus.$emit("incomingexamineXiaZai");
      });
    },
    //报废
    async baofei(e) {
      this.$confirm({
        title: "提示",
        content: "报废后数据不可恢复,是否继续？",
        okText: "确认",
        cancelText: "取消",
        icon: "info-circle",
        onOk: async () => {
          let res = await approval_scrap({
            data_id: this.get_stata.leftdata.id,
          });
          if (res.code == 1) {
            setTimeout(() => {
              this.$router.push("/wastetank");
            }, 1000);
          }
        },
      });
    },
    //呈送
    async chengsong(e) {
      let res = await document_forward_Send({
        id: this.$route.query.id,
      });
    },
    //发布
    async fabu(e) {
      let _id = this.$route.query.id;
      let a = await document_release({ id: _id });
    },
    //转发文
    zhuanfawen(e) {
      this.TemplatePopup.visibles = true;
    },
    // 关闭转发文模态框
    delNewDoucument() {
      this.TemplatePopup.visibles = false;
    },
    //撤回
    async chehui(e) {
      let res = await approval_revoke({
        where_id: this.get_stata.toexamine.where_id,
      });
      if (res.code == 1) {
        let _obj = {
          1: "/library",
          2: "/getlibrary",
          3: "/signlibrary",
        };
        this.$router.push(_obj[this.$route.query.file_type]);
      }
    },
    // 传阅按钮
    chuanyue() {
      this.ViewDocument.condition = false;
      this.Popup.titleTxt = "传阅";
      this.tag = {
        tab: true,
        bm: true,
        pe: true,
        company: true,
        label: true,
        role: true,
        lately: true,
      };
      this.btn_type = 1;
      this.visible = true;
    },
    // 分发按钮
    fenfa() {
      this.ViewDocument.condition = false;
      this.Popup.titleTxt = "分发";
      this.btn_type = 2;
      this.tag = {
        tab: true,
        bm: true,
        pe: true,
        company: true,
        label: true,
        role: true,
        lately: true,
      };
      this.visible = true;
    },

    //告诉其他页面提交数据（文件数据、富文本）
    tell_other() {
      this.$bus.$emit("Set_content_data_data");
    },
    // 提交
    async approval() {
      // 正常 发文
      if (this.get_stata.is_s_x == 0 && this.get_stata.leftdata.is_fast == 0) {
        // 拿到上传的附件
        this.$bus.$emit("get_Uploaded_files");
        this.tell_other();
        let document_arr = {};
        let fields = this.get_stata.leftdata.fields;
        let _onOff = true;
        for (let key in fields) {
          if (
            fields[key].is_must == 1 &&
            this.DataFiltering(fields[key].value) == ""
          ) {
            this.$message.error(`${fields[key].c_name}为必填项，不能为空`);
            return false;
          }
          // document_arr[fields[key].e_name] = fields[key].value;
        }
        //发文信息数据转换
        for (let key in this.get_leftdata) {
          if (
            this.get_leftdata[key]?.value?.text &&
            typeof this.get_leftdata[key]?.value?.text == "object"
          ) {
            this.get_leftdata[key].value.text = this.get_leftdata[
              key
            ].value.text.join(",");
          }
          if (
            this.get_leftdata[key].input_type == 1 &&
            (this.get_leftdata[key].e_name == "issuer" ||
              this.get_leftdata[key].e_name == "received_delivery")
          ) {
            this.get_leftdata[key].value = this.get_leftdata[key].value.text;
          }
          document_arr[key] = this.get_leftdata[key].value || "";
        }
        document_arr.word_no = this.$store.state.leftdata.word_no.id;
        let word_no = this.$store.state.leftdata.word_no;

        //签章
        let process_signature = JSON.parse(
          JSON.stringify(this.get_stata.use_zhang)
        );
        let signature_arr = [];
        process_signature.forEach((el) => {
          signature_arr.push({
            id: "",
            signature_base: el.signature_base,
            signature_img: el.signature_img,
            signature_id: el.signature_id,
            position: el.position,
          });
        });
        let process_signature_other_s = JSON.parse(
          JSON.stringify(this.get_stata.other_zhang)
        );

        let process_signature_other = process_signature_other_s.map((el, i) => {
          return {
            id: el.id,
            signature_base: el.signature_base,
            signature_img: el.signature_img,
            signature_id: el.signature_id,
            position: el.position,
          };
        });
        // for (let i = 0; i < this.all_data.data.signature.length; i++) {
        //   process_signature_other.forEach((el, index) => {
        //     if (el.id == this.all_data.data.signature[i].id) {
        //       let _position1 = this.all_data.data.signature[i].position;
        //       let _position2 = el.position;
        //       if (
        //         _position1.left == _position2.left &&
        //         _position1.right == _position2.right &&
        //         _position1.width == _position2.width
        //       ) {
        //         process_signature_other.splice(index, 1);
        //       }
        //     }
        //   });
        // }

        signature_arr = [...signature_arr, ...process_signature_other];

        signature_arr.sort(function (a, b) {
          return a.position.zindex - b.position.zindex;
        });
        signature_arr.forEach((el, index) => {
          el.position.zindex = index;
        });
        let data = {
          templete_id: this.get_stata.leftdata.templete_id,
          id: this.get_stata.leftdata.id,
          type: this.get_stata.leftdata.type,
          document_arr,
          content: this.get_stata.leftdata.content,
          enclosure_file: this.get_stata.leftdata.enclosure,
          deptid: this.get_stata.leftdata.deptid,
          process_urgent_level: this.get_stata.leftdata.process_urgent_level,
          approval_data: this.get_stata.toexamine,
          msg_time: this.get_stata.toexamine.time,
          way: this.get_stata.toexamine.way,
          signature_arr,
          approval_file: this.get_stata.toexamine.files,
          word_no,
        };
        if (!this.jurisdiction) {
          this.$router.push("/home");
          return;
        }
        document_add(data).then((r) => {
          if (r.code == 1) {
            if (data.type == 1) {
              this.$router.push("/library");
            } else if (data.type == 2) {
              this.$router.push("/getlibrary");
            } else if (data.type == 3) {
              this.$router.push("/signlibrary");
            }
          }
        });
      }
      if (this.get_stata.toexamine.status == 11) {
        this.$bus.$emit("approval_my_shift_data");
        let a = await approval_my_shift(this.get_stata.is_s_x_data);
        if (a.code == 1) {
          if (this.get_stata.leftdata.type == 1) {
            this.$router.push("/library");
          } else if (this.get_stata.leftdata.type == 2) {
            this.$router.push("/getlibrary");
          } else if (this.get_stata.leftdata.type == 3) {
            this.$router.push("/signlibrary");
          }
        }
      } else {
        if (
          this.get_stata.is_s_x == 1 ||
          this.get_stata.leftdata.is_fast == 1
        ) {
          this.$bus.$emit("get_Uploaded_files");
          this.tell_other();
          this.$bus.$emit("next_approval_node");
          let _infos = this.get_stata.is_s_x_data.document_arr;
          for (let key in _infos) {
            if (this.DataFiltering(_infos[key]) == "") {
              let _obj = {
                title: "发文标题",
                copy_users: "发文单位",
                issuer: "签发人",
                main_delivery: "主送单位",
                reviewer: "接收人",
                secret_level: "密集程度",
                urgent_level: "紧急程度",
              };
              this.$message.error(`${_obj[key]}为必填项，不能为空`);
              return false;
            }
          }
          let a = await document_add_fast(this.get_stata.is_s_x_data);
          if (a.code == 1) {
            if (this.get_stata.leftdata.type == 1) {
              this.$router.push("/library");
            } else if (this.get_stata.leftdata.type == 2) {
              this.$router.push("/getlibrary");
            } else if (this.get_stata.leftdata.type == 3) {
              this.$router.push("/signlibrary");
            }
          }
        }
      }
    },
    // 弹窗提交
    //数据验证
    DataFiltering(info) {
      let _info = "";
      if (info._f) {
        return info;
      } else {
        if (typeof info == "string" || typeof info == "number") {
          return `${info}`;
        } else if (info == null) {
          return "未录入";
        } else if (typeof info == "object") {
          info.select.forEach((item) => {
            if (_info == "") {
              _info = item.name;
            } else {
              _info += `,${item.name}`;
            }
          });
          if (_info != "") {
            if (info.text != "") {
              _info += `,${info.text}`;
            }
          } else {
            if (info.text != "") {
              _info = info.text;
            } else {
              _info = "";
            }
          }
          return _info;
        }
      }
    },
    //提交传阅
    handleOk_rens() {
      this.visiblerange.visual.forEach((el) => {
        switch (el.type) {
          case 1:
            el.flag = 1;
            el.id = el.value;
            break;
          case 2:
            el.flag = 4;
            el.id = el.value;
            break;
          case 3:
            el.flag = 5;
            el.id = el.value;
            break;
          case 4:
            el.flag = 2;
            el.id = el.value;
            break;
          case 5:
            el.flag = 3;
            el.id = el.value;
            break;
          case 6:
            el.flag = 6;
            el.id = el.value;
            break;
        }
      });
      if (this.btn_type == 1) {
        this.go_file_manager_circulation();
      }
      if (this.btn_type == 2) {
        this.go_document_distribute();
      }
    },
    //调用传阅接口
    async go_file_manager_circulation() {
      let { data, code } = await file_manager_circulation({
        document_id: this.$route.query.id,
        type: 0,
        arr: this.visiblerange.visual,
      });
      if (code == 1) {
        this.visible = false;
        this.visiblerange = {
          visible: false, // 可见范围弹窗
          visual: [], // 弹窗
          visuals: [], // 不是弹框
        };
        this.Popup.vis3 = false;
        this.ViewDocument.vis2 = false;
      }
    },
    // 调用分发接口
    async go_document_distribute() {
      let userids = this.visiblerange.visual.map((e) => {
        return e.value;
      });
      let { data, code } = await document_distribute({
        id: this.$route.query.id,
        userids: userids.join(","),
      });
      if (code == 1) {
        this.visible = false;
        this.Popup.vis3 = false;
        this.ViewDocument.vis2 = false;
        this.visiblerange = {
          visible: false, // 可见范围弹窗
          visual: [], // 弹窗
          visuals: [], // 不是弹框
        };
      }
    },
    // 点击取消，返回上一页
    reverts() {
      this.$router.go(-1);
    },
    //预览公文
    preview_document(onOff) {
      this.ViewDocument.condition = false;
      let _text = "";
      if (onOff == 1) {
        this.visiblerange.visual.forEach((info) => {
          if (_text == "") {
            _text += info.title;
          } else {
            _text += "," + info.title;
          }
        });
        this.Popup.usernames = _text;
        this.Popup.vis3 = true;
        this.visible = false;
      }
      if (onOff == 2) {
        this.Popup.titleTxt = "呈送";
        this.$store.state.leftdata?.fields.reviewer?.value?.select.forEach(
          (info) => {
            if (_text == "") {
              _text += info.name;
            } else {
              _text += "," + info.name;
            }
          }
        );
        if (
          this.$store.state.leftdata?.fields.reviewer?.value?.text !=
            undefined &&
          this.$store.state.leftdata?.fields.reviewer?.value?.text != ""
        ) {
          if (_text != "") {
            _text +=
              "," + this.$store.state.leftdata?.fields.reviewer?.value?.text;
          } else {
            _text = this.$store.state.leftdata?.fields.reviewer?.value?.text;
          }
        }
        this.Popup.usernames = _text;
        this.Popup.vis3 = true;
        this.visible = false;
      }
      this.tell_other();
      this.ViewDocument.vis2 = true;
    },
    // 归档
    guidang() {
      this.guidangmodal_cl();
    },
    // 确认归档弹窗
    async guidangmodal_cl() {
      let a = await document_status({
        id: this.$route.query.id,
        status: 9,
      });
      if (a.code == 1) {
        setTimeout(() => {
          this.$router.push("/filingbox");
        }, 1000);
      }
    },
  },
  watch: {},
  components: {
    Maincontent,
    Gendinginfo,
    Conductstatis,
    Bodycontent,
    Attachment,
    Processcontent,
    Accept,
    Summary,
    EnclosureList,
    Framelist,
    Ottree,
    SvgIcon,
    NewDocument,
    ViewDocument,
    CurrentApproval,
  },
};
</script>
<style lang="less" scoped>
.incomingexamine-Maincontent {
  display: flex;
  flex-wrap: wrap;
}
.btn-bg-box {
  width: 100%;
  margin-top: 15px;
  .btn-bg {
    padding: 0 30px;
    width: 100%;
    height: 56px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    .set {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
      width: 88px;
      height: 40px;
      opacity: 1;
      border-radius: 4px;
      background: #1890ff;
      color: white;
      cursor: pointer;
    }
  }
}

.preview-title-box {
  display: flex;
  width: 0px;
  height: 30px;
  background: #ffffff;
  position: fixed;
  transform: translateX(50%);
  border-radius: 4px;
  top: 40px;
  z-index: 1001;
  right: 20%;
  overflow: hidden;
  opacity: 0;
  transition: all 0.1s;
  .preview-box-title {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.preview-title-boxs {
  right: 50.1%;
  width: 793px;
  height: 56px;
  transition: all 0.3s linear;
  padding: 0px 26px 0px 20px;
  opacity: 1;
}
.retuLeft {
  width: 16px;
  height: 12px;
  margin-right: 5px;
}
//  预览公文内容
.preview-modal {
  /deep/ .ant-modal-body {
    min-height: 800px;
    padding: 0;
  }
  /deep/ .ant-modal-content {
    width: 798px;
  }
}

#print {
  width: 750px;
  margin: 0 auto;
}

// 打印需要的css
.maincontent {
  min-height: 600px;
}
.title {
  padding: 0 20px;
  height: 60px;
  background: white;
  margin-bottom: 15px;
  font-size: 18px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.hierarchy {
  z-index: 1;
}
.maincontent {
  background-color: transparent;
  padding: 0;
  display: flex;
  justify-content: space-between;
  overflow: visible;
  .maincontent-box {
    background: white;
  }
  .maincontent-left {
    position: relative;
    background: white;
    margin-right: 10px;
    padding: 10px 20px 20px;
    overflow: hidden;
    .maincontent-left-top {
      position: relative;
      .seefile-link {
        position: absolute;
        top: 8px;
        right: -16px;
      }
    }
    /deep/.ant-tabs-nav .ant-tabs-tab {
      margin: 0 25px 0 0;
      padding: 12px 8px;
    }
  }
  .maincontent-right {
    width: 376px;
    min-height: 764px;
    background: white;
    overflow: hidden;
    /deep/.ant-tabs-bar {
      margin: 0;
    }
    /deep/.ant-tabs-nav {
      width: 100%;
      & > div {
        display: flex;
      }
    }
    /deep/ .ant-tabs-tabpane {
      padding: 0 20px;
    }
    /deep/.ant-tabs-tab {
      font-size: 16px;
      // width: 125px;
      text-align: center;
      flex: 1;
      height: 55px;
      margin: 0;
      padding: 0;
      line-height: 55px;
    }

    /deep/.ant-tabs-ink-bar {
      height: 0;
    }
  }
}
.bcbtn {
  margin-left: 20px;
}
.more {
  margin-right: 5px;
}

.circulation {
  .ant-radio-group {
    .ant-radio-wrapper {
      margin-bottom: 20px;
    }
  }
  .nav {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 110px;
      height: 32px;
      background: rgba(245, 247, 250, 1);
      border: 1px solid rgba(220, 223, 230, 1);
      border-radius: 0px 2px 2px 0px;
      font-size: 16px;
      cursor: pointer;
    }
    .active {
      background: rgba(0, 130, 239, 1);
      border: none;
      color: white;
    }
  }
}
.scrap {
  position: absolute;
  top: 200px;
  right: 500px;
  width: 200px;
  height: 200px;
  background: url("../../../assets/addpostset/scrap.png");
  background-size: 200px 200px;
  z-index: 10000;
}
/deep/ .ant-modal {
  width: 793px !important;
}
</style>