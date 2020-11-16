<template>
  <div class="setting" id="setting">
    <div class="title">
      <span class="text">规则设置</span>
    </div>
    <div class="line processing">
      <div class="s-title">
        <span>流程处理</span>
        <span class="remarks">
          * 呈送/传阅/分发/ 发布的公文不进入 审批流程
        </span>
      </div>
      <div class="s-content">
        <div class="c-title">
          <div class="flex-align-center" v-if="process.that_process">
            当前流程：
            <span class="that-process" v-if="process.that_process.name">{{
              process.that_process.name
            }}</span>
            <span class="that-process" v-else>{{rulesAreNeeded}}</span>
            <span
              class="set-collection hand"
              @click="process_collecting"
              :class="{ collection: process.that_process.line == 1 }"
              v-show="process.that_process && process.that_process.name"
            >
              <i class="collection-no"></i>
              <span>设为我的常用流程</span>
            </span>
          </div>
          <div v-else></div>
          <span class="set-process hand" @click="set_new_process(1)"
            >设置新的流程</span
          >
        </div>
        <div class="c-content">
          <div class="left">
            <a-radio-group
              @change="liucheng_change"
              v-model="get_process.liucheng_id"
            >
              <div class="other_radio">
                <div class="item">
                  <a-radio
                    value="null"
                    :style="
                      get_process.liucheng_id == 'null' ? 'color:#0082ef;' : ''
                    "
                  >
                    <span class="text" title="不需要审批流程"
                      >不需要审批流程</span
                    >
                  </a-radio>
                </div>
                <div class="item">
                  <a-radio
                    value="next"
                    :style="
                      get_process.liucheng_id == 'next' ? 'color:#0082ef;' : ''
                    "
                  >
                    <span class="text" title="指定下一个节点"
                      >指定下一个节点</span
                    >
                  </a-radio>
                </div>
              </div>
              <div>
                <span class="use-liucheng">常用流程：</span>
                <div class="liucheng-box">
                  <div class="ofen-use-list">
                    <a-radio
                      @click="process_change(item)"
                      :value="item.id"
                      v-for="(item, index) in process.ofen_use"
                      :key="index"
                    >
                      <span class="text" :title="item.name">{{
                        item.name
                      }}</span>
                      <span class="ofen-use-icon">常用</span>
                    </a-radio>

                    <div class="more" @click="more_process">
                      <span>更多流程</span>
                      <i
                        class="sanjiao"
                        :class="more_show_liucheng ? 'shang' : 'xia'"
                      ></i>
                    </div>
                  </div>
                  <div class="more-content" v-show="more_show_liucheng">
                    <div class="liucheng-search">
                      <a-input-search
                        placeholder="搜索流程名称"
                        style="width: 279px"
                        @search="liucheng_onSearch"
                        v-model="process.all_process_search"
                      />
                    </div>
                    <div
                      class="radio-list"
                      id="liucheng"
                      @scroll="divscrollFn('#liucheng')"
                    >
                      <div class="other-radio">
                        <a-radio
                          @click="process_change(item)"
                          :value="item.id"
                          v-for="(item, index) in process.all_process"
                          :key="index"
                          :style="
                            get_process.liucheng_id == item.id
                              ? 'color:#0082ef;'
                              : ''
                          "
                        >
                          "{{ item.name }}"
                          <span v-if="item.line == 1" class="ofen-use-icon"
                            >常用</span
                          >
                        </a-radio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-radio-group>
          </div>
          <div class="right">
            <div class="top">
              <div class="person-title">默认审批人</div>
              <div class="person-list" v-show="get_process.liucheng_id">
                <div
                  class="person-item"
                  v-for="(item, index) in approved"
                  :key="index"
                >
                  <div class="msg" @click="add_approval(3, index)">
                    <div class="user-img">
                      <div v-if="item.type == 3" class="head-img">
                        <img
                          :src="
                            item.info[0].avatar ||
                            require('../../../../assets/adddraft/default-head-img.png')
                          "
                          alt
                        />
                      </div>
                      <div v-else class="head-img">
                        <img
                          :src="
                            require('../../../../assets/adddraft/default-head-img.png')
                          "
                          alt
                        />
                      </div>
                      <i
                        class="x hand"
                        v-if="
                          process.process_jurisdiction &&
                          process.process_jurisdiction.edit_cclist == 1
                        "
                        @click.stop="approver_del(index)"
                      ></i>
                    </div>

                    <div
                      class="name"
                      v-if="item.type == 3"
                      :title="item.info[0].name"
                    >
                      {{ item.info[0].name }}
                    </div>
                    <div class="name" v-else :title="item.title">
                      {{ item.title }}
                    </div>

                    <div
                      class="other"
                      v-if="
                        item.type != 3 ||
                        (item.info.length > 1 &&
                          get_process.liucheng_id != 'next')
                      "
                    >
                      {{ item.approver_type == 1 ? "（会签）" : "（或签）" }}
                    </div>
                  </div>

                  <div
                    class="box"
                    v-if="
                      process.process_jurisdiction &&
                      process.process_jurisdiction.edit_approval == 1 &&
                      get_process.liucheng_id != 'next'
                    "
                  >
                    <div
                      class="ellipsis"
                      v-show="index + 1 !== approved.length"
                      @click="add_approval(1, index + 1)"
                    >
                      . . .
                    </div>

                    <div
                      class="add-user insert"
                      v-show="index + 1 !== approved.length"
                      @click="add_approval(1, index + 1)"
                    >
                      +
                    </div>
                  </div>

                  <div
                    v-else-if="get_process.liucheng_id != 'next'"
                    class="ellipsis"
                    v-show="index + 1 !== approved.length"
                  >
                    . . .
                  </div>
                </div>
                <div
                  class="add-user"
                  v-if="
                    process.process_jurisdiction &&
                    process.process_jurisdiction.edit_approval == 1
                  "
                  @click="add_approval(2)"
                >
                  +
                </div>
              </div>

              <div class="next-node" v-show="get_process.liucheng_id == 'next'">
                <div
                  class="line-next"
                  v-show="get_process.approval_where.length > 1"
                >
                  <div class="line-title">审核方式：</div>
                  <div class="line-content">
                    <a-radio-group v-model="get_process.approval_way">
                      <a-radio
                        :value="2"
                        :style="
                          get_process.approval_way == 2 ? 'color:#0082ef;' : ''
                        "
                        >或签</a-radio
                      >
                      <a-radio
                        :value="1"
                        :style="
                          get_process.approval_way == 1 ? 'color:#0082ef;' : ''
                        "
                        >会签</a-radio
                      >
                    </a-radio-group>
                  </div>
                </div>
                <div class="line-next">
                  <div class="line-title">通知方式：</div>
                  <div class="line-content">
                    <a-checkbox-group v-model="get_process.notice_way">
                      <a-checkbox disabled :value="1">待办</a-checkbox>
                      <a-checkbox disabled :value="4">企业微信</a-checkbox>
                      <a-checkbox :value="2">邮箱</a-checkbox>
                      <a-checkbox :value="3">短消息</a-checkbox>
                    </a-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="person-title">默认抄送人</div>
              <div class="person-list" v-show="get_process.liucheng_id">
                <div
                  class="person-item"
                  v-for="(item, index) in CCroved"
                  :key="index"
                >
                  <div class="msg">
                    <div class="user-img">
                      <div class="head-img">
                        <img
                          :src="
                            item.avatar ||
                            require('../../../../assets/adddraft/default-head-img.png')
                          "
                          alt
                        />
                      </div>
                      <i
                        class="x hand"
                        v-if="
                          process.process_jurisdiction &&
                          process.process_jurisdiction.edit_cclist == 1
                        "
                        @click="CCitemClose(index)"
                      ></i>
                    </div>

                    <div class="name">{{ item.title }}</div>
                  </div>
                </div>
                <div
                  class="add-user"
                  v-if="
                    process.process_jurisdiction &&
                    process.process_jurisdiction.edit_cclist == 1
                  "
                  @click="CCperson = true"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="line red-template">
      <div class="s-title">
        <span>套红模板</span>
      </div>
      <div class="s-content">
        <a-radio-group
          style="width: 100%"
          v-model="get_process.red_template_model.id"
        >
          <div class="s-c-title">
            <div class="flex-align-center">
              当前套红模板：
              <span
                class="that-process"
                v-if="red_template.select_red_template"
                >{{ red_template.select_red_template.name }}</span
              >
              <span class="that-process" v-else>不需要套红模板</span>
              <span
                class="set-collection hand"
                @click="set_red_template"
                v-if="red_template.select_red_template"
                :class="{
                  collection: red_template.select_red_template.is_default == 1,
                }"
              >
                <i class="collection-no"></i>
                <span v-if="red_template.select_red_template.is_default == 0"
                  >设为我的常用模板</span
                >
                <span v-else>设为我的常用模板</span>
              </span>
            </div>
            <span @click="set_new_process(2)" class="upload-template">
              <span>上传套红模板</span>
            </span>
          </div>
          <div class="no-template">
            <a-radio
              :value="null"
              @click="red_template_change(null)"
              :style="
                get_process.red_template_model.id == null
                  ? 'color:#0082ef;'
                  : ''
              "
              >不需要套红模板</a-radio
            >
          </div>
          <div class="s-c-content">
            <div class="want" v-if="red_template.all_template">
              <div class="want-title">套红模板：</div>
              <div class="want-content">
                <div
                  class="ofen-use-template"
                  v-if="
                    red_template.all_template &&
                    red_template.all_template.length < 20
                  "
                >
                  <div
                    class="template-item"
                    v-for="(item, index) in red_template.all_template"
                    :key="index"
                  >
                    <a-radio
                      :value="item.id"
                      @click="red_template_change(item)"
                      :style="
                        get_process.red_template_model.id == item.id
                          ? 'color:#0082ef;'
                          : ''
                      "
                      >{{ item.name }}</a-radio
                    >
                    <div class="template-img">
                      <div class="mask">
                        <div
                          class="look"
                          @click="look_red_template(item)"
                        ></div>
                      </div>
                      <img
                        src="../../../../assets/adddraft/red-tepment.png"
                        alt
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="more hand"
                  v-if="red_template.all_template.length > 20"
                  @click="more_red_templete"
                >
                  <span>更多套红模板</span>
                  <i
                    class="sanjiao"
                    :class="more_show_template ? 'shang' : 'xia'"
                  ></i>
                </div>
                <div
                  class="more-template"
                  v-show="
                    more_show_template && red_template.all_template.length > 20
                  "
                >
                  <a-input-search
                    placeholder="搜索模板名称"
                    style="width: 279px"
                    v-model="red_template.keyword"
                    @search="template_onSearch"
                  />
                  <div class="template-list">
                    <div
                      class="template-item"
                      v-for="(item, index) in red_template.all_template"
                      :key="index"
                    >
                      <a-radio
                        :value="item.id"
                        @click="red_template_change(item)"
                        >{{ item.name }}</a-radio
                      >
                      <div class="template-img">
                        <div class="mask">
                          <div
                            class="look"
                            @click="look_red_template(item)"
                          ></div>
                        </div>
                        <img
                          src="../../../../assets/adddraft/red-tepment.png"
                          alt
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-radio-group>
      </div>
    </div>

    <!-- 审批人弹窗 -->
    <a-modal
      class="transfer-modal appvisi-modal"
      title="选择审批人"
      :visible="appvisi"
      :confirm-loading="confirmLoading"
      @ok="apphandleOk"
      @cancel="apphandleCancel"
      cancelText="取消"
      okText="确认"
    >
      <div class="list-box-app">
        <div v-show="get_process.liucheng_id != 'next'" class="list-box-top">
          <a-radio-group
            v-model="appvisiradiovalue"
            @change="appvisiradioonChange"
          >
            <a-radio class="list-box-top-radio" :value="1"
              >上级（自动设置通讯录中的上级领导为抄送人）</a-radio
            >
            <a-radio class="list-box-top-radio" :value="2">标签</a-radio>
            <a-radio class="list-box-top-radio" :value="3">单个成员</a-radio>
            <a-radio class="list-box-top-radio" :value="4">申请人</a-radio>
            <a-radio class="list-box-top-radio" :value="5">部门</a-radio>
          </a-radio-group>
        </div>
        <div class="list-box-bottom">
          <div v-show="appvisiradiovalue == 1">
            <div class="list-box-bottom-title">指定级别</div>
            <a-select
              size="default"
              v-model="appvisiradioone.appvisiselectvalue"
              style="width: 200px"
              @change="handleChange"
            >
              <a-select-option v-for="i in selectO" :key="i.value">{{
                i.title
              }}</a-select-option>
            </a-select>
            <div class="list-box-bottom-title">同级有多个上级时</div>
            <a-radio-group v-model="appvisiradioone.appvisiradiovalue">
              <a-radio class="list-box-top-radio" :value="2"
                >或签（一名上级同意即可）</a-radio
              >
              <a-radio class="list-box-top-radio" :value="1"
                >会签（须所有上级同意）</a-radio
              >
            </a-radio-group>
          </div>
          <div v-show="appvisiradiovalue == 2">
            <div class="list-box-bottom-title">请选择标签审批方式：</div>
            <a-radio-group v-model="appvisiradiotwo.appvisiradiovalue">
              <a-radio class="list-box-top-radio" :value="2"
                >或签（一名上级同意即可）</a-radio
              >
              <a-radio class="list-box-top-radio" :value="1"
                >会签（须所有上级同意）</a-radio
              >
            </a-radio-group>
            <Framelist
              :show_data_flag="appvisi"
              :range="appvisiradiotwo.tagsrange"
              :tag="{ label: true }"
              :transformation="true"
              style="margin-top: 10px"
              :restype="3"
            />
          </div>
          <div v-show="appvisiradiovalue == 3">
            <Framelist
              :show_data_flag="appvisi"
              :range="appvisiradiothree.tagsrange"
              :tag="{ tab: true, pe: true }"
              style="margin-top: 10px"
              :restype="2"
            />
          </div>
          <div v-show="appvisiradiovalue == 4"></div>
          <div v-show="appvisiradiovalue == 5">
            <div class="list-box-bottom-title">请选择标签审批方式：</div>
            <a-radio-group v-model="appvisiradiofive.appvisiradiovalue">
              <a-radio class="list-box-top-radio" :value="2"
                >或签（一名上级同意即可）</a-radio
              >
              <a-radio class="list-box-top-radio" :value="1"
                >会签（须所有上级同意）</a-radio
              >
            </a-radio-group>
            <Framelist
              :show_data_flag="appvisi"
              :range="appvisiradiofive.tagsrange"
              :tag="{ tab: true, pe: false, bm: true }"
              :transformation="true"
              style="margin-top: 10px"
              :restype="1"
            />
          </div>
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
    <!-- 抄送人弹窗 -->
    <a-modal
      class="transfer-modal appvisi-modal"
      title="选择抄送人"
      :visible="CCperson"
      :confirm-loading="confirmLoading"
      @ok="CChandleOk"
      @cancel="CChandleCancel"
      cancelText="取消"
      okText="确认"
    >
      <div>
        <Framelist
          :range="CCpersonradio.tagsrange"
          :tag="{
            tab: true,
            bm: true,
            pe: true,
            company: false,
            label: true,
            role: true,
            lately: true,
          }"
          :restype="4"
        />
      </div>
    </a-modal>

    <!-- 套红预览 -->
    <a-modal
      class="transfer-modal"
      title="套红模板预览"
      :visible="view_template.visible"
      :confirm-loading="confirmLoading"
      @ok="view_template.visible = false"
      @cancel="view_template.visible = false"
      cancelText="取消"
      :footer="null"
      okText="确认"
    >
      <div class="view_template">
        <span class="content" v-html="view_template.content"></span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  approval_before_process,
  approval_my_template,
  approval_collection,
  red_template_list,
  red_set_commonly,
  check_word_wo_re,
} from "@/api/draft";
import Tree from "@/views/sendout/draft/addcompoents/components/setting/tree.vue";
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
export default {
  data() {
    return {
      test: null,
      //流程数据
      data: null,
      //流程选择
      liucheng: null,

      //是否显示更多
      more_show_liucheng: false,
      more_show_template: false,

      //流程相关
      process: {
        ofen_use: [],
        all_process: [],
        all_process_search: "",
        that_process: {
          line: "",
        }, //当前流程
        process_jurisdiction: null, //流程权限
        //动态加载（流程选择）
        page: 1,
        count: 0,
      },
      // 跳转流程页面弹窗控制
      jumpPopup: {
        visible: false, // 弹窗开关
        centenText: "", // 打开的按钮
      },
      //审批人
      appvisi: false,
      //指定上级
      selectO: [
        {
          title: "直接上级",
          value: "1",
        },
        {
          title: "第2上级",
          value: "2",
        },
        {
          title: "第3上级",
          value: "3",
        },
        {
          title: "第4上级",
          value: "4",
        },
        {
          title: "第5上级",
          value: "5",
        },
        {
          title: "第6上级",
          value: "6",
        },
        {
          title: "第7上级",
          value: "7",
        },
        {
          title: "第8上级",
          value: "8",
        },
        {
          title: "第9上级",
          value: "9",
        },
        {
          title: "第10上级",
          value: "10",
        },
      ],

      //---------- 审批人 ----------
      // 前端type 0 个人 1部门 2标签 后端 1部门 2标签 3个人
      appvisi: false,
      appvisiradiovalue: 1,
      approved: [],
      appvisiradioone: {
        appvisiselectvalue: "1",
        appvisiselecttext: "直接上级",
        appvisiradiovalue: 2,
      },
      appvisiradiotwo: {
        appvisiradiovalue: 2,
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      appvisiradiothree: {
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      appvisiradiofour: {},
      appvisiradiofive: {
        appvisiradiovalue: 2,
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      //弹窗动画
      confirmLoading: false,
      //选择的数据
      visiblerange: {
        visible: false, // 可见范围弹窗
        visual: [], // 弹窗
        visuals: [], // 不是弹框
      },
      //审批插入的下标
      what_add: null,

      //---------- 抄送人 ----------
      CCperson: false,
      // CCpersonradiovalue: 1,
      CCroved: [], // 没打开,
      CCpersonradio: {
        tagsrange: {
          visual: [], //打开了
        },
      },
      //---------- 抄送人 ----------

      // 主页传来的数据
      mainData: null,
      // 抄送通知
      radio: null,

      //套红模板
      red_template: {
        keyword: "",
        select_red_template: null, //当前选择的套红模板
        all_template: null, // 所有的套红模板
      },

      //审批人回填数据记录当前选择的人
      backfill_record: null,

      view_template: { visible: false, content: "" },
      // 规则状态text
      rulesAreNeeded:'不需要审批流程'
    };
  },
  components: {
    Framelist,
    Tree,
  },
  props: {
    obj: {
      default: () => {
        return {
          _approved: [],
          _CCroved: [],
          process: {
            id: "",
          },
        };
      },
    },
  },
  computed: {
    get_process() {
      return this.$store.state.quick_draft.process;
    },
    get_model() {
      return this.$store.state.quick_draft.header;
    },
  },
  created() {
    this.get_approval_my_template();
    this.get_red_template_list();
    //当部门改变（footer组件）时更新流程
    this.$bus.$off("updata_approval_quick");
    this.$bus.$on("updata_process_quick", this.get_approval_before_process);

    this.approved = [];
    this.CCroved = [];

    this.$store.commit("SET_QUICK_REDTEMPLATEDATA", {
      content: "",
      id: null,
      name: "",
    });
    this.get_all_approval_my_template();
  },
  mounted() {},
  methods: {
    divscrollFn(e) {
      let el = document.querySelector(e);
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        if (this.process.all_process.length >= this.process.count) {
          return;
        }
        this.process.page++;
        this.get_all_approval_my_template();
      }
    },
    //获取流程信息
    async get_approval_before_process() {
      let { data } = await approval_before_process({
        approval_id: this.get_process.liucheng_id,
        dep_id: this.get_process.department,
      });

      if (data.data) {
        this.data = data;
        data.data.forEach((el) => {
          if (el.info) {
            el.info.forEach((el) => {
              el.id = el.userid;
              el.flag = 3;
            });
          }
          el.users = JSON.parse(JSON.stringify(el.info));
        });
        data.approval_copy.forEach((el) => {
          el.users = [
            {
              flag: 3,
              id: el.value,
            },
          ];
        });

        this.approved = JSON.parse(JSON.stringify(data.data));

        this.CCroved = JSON.parse(JSON.stringify(data.approval_copy));

        this.process.process_jurisdiction = data.explain.root_setting;

        this.process.that_process = data.explain;
        if (this.process.that_process) {
          this.process.that_process.line = data.collect;
        }
      }
      this.updata_approval();
    },
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
    //获取常用流程
    async get_approval_my_template(limit = 3) {
      let { data } = await approval_my_template({
        type: 1,
        more: 1,
      });

      if (data.data && data.data.length > 0) {
        this.process.ofen_use = JSON.parse(JSON.stringify(data.data));
      } else {
        this.process.ofen_use = [];
      }
    },
    //获取全部流程
    async get_all_approval_my_template() {
      let { data } = await approval_my_template({
        limit: 10,
        name: this.process.all_process_search,
        type: 1,
        more: 2,
        page: this.process.page,
      });

      this.process.all_process = [...this.process.all_process, ...data.data];
      this.process.count = data.count;
    },
    //获取流程信息（当流程id改变的额时候）
    async get_approval_before_process_change(approval_id) {
      let { data } = await approval_before_process({
        approval_id,
        dep_id: this.get_process.department,
      });
      data.data.forEach((el) => {
        if (el.info) {
          el.info.forEach((el) => {
            el.id = el.userid;
            el.flag = 3;
          });
        }
        el.users = JSON.parse(JSON.stringify(el.info));
      });
      data.approval_copy.forEach((el) => {
        el.users = [
          {
            flag: 3,
            id: el.value,
          },
        ];
      });
      this.process.process_jurisdiction = data.explain.root_setting;
      this.approved = JSON.parse(JSON.stringify(data.data));
      this.CCroved = JSON.parse(JSON.stringify(data.approval_copy));
    },
    //更多流程
    more_process() {
      this.more_show_liucheng = !this.more_show_liucheng;
    },
    //设置常用流程、反向
    async process_collecting() {
      let collect = null;
      switch (this.process.that_process.line) {
        case 1:
          collect = 0;
          break;
        case 0:
          collect = 1;
          break;
      }

      let { code, data } = await approval_collection({
        collect,
        approval_id: this.process.that_process.id,
      });
      if (code == 1) {
        this.process.that_process = JSON.parse(JSON.stringify(data));
      }
    },
    //流程改变
    liucheng_change(item) {
      if (this.get_process.liucheng_id == "next") {
        this.rulesAreNeeded = '指定下一个节点'
        this.appvisiradiovalue = 3;
        this.process.that_process = {};
        this.approved = [];
        this.CCroved = [];
        this.process.process_jurisdiction = {
          edit_approval: 1,
          edit_cclist: 1,
          revoke: 1,
        };
        return;
      } else if (!this.get_process.liucheng_id) {
        this.process.that_process = null;
      }else{
        this.rulesAreNeeded = '不需要审批流程'
      }
      if (this.get_process.liucheng_id) {
        this.get_approval_before_process_change(this.get_process.liucheng_id);
      } else {
        this.approved = [];
        this.CCroved = [];
      }
    },

    //设置当前流程
    process_change(item) {
      this.process.that_process = item;
    },

    //套红模板列表获取
    async get_red_template_list() {
      let { data } = await red_template_list({
        limit: 99999,
        keyword: this.red_template.keyword,
        type: 1,
      });
      this.red_template.all_template = data.data;
    },
    //更多套红模板
    more_red_templete() {
      more_show_template = !more_show_template;
      this.get_red_template_list();
    },

    //套红模板搜索
    template_onSearch() {},
    //套红模板预览
    look_red_template(item) {
      this.view_template.visible = true;
      this.view_template.content = item.content;
    },
    //设置常用套红模板、反向
    async set_red_template() {
      let collect = null;
      switch (this.red_template.select_red_template.is_default) {
        case 0:
          collect = 1;
          break;
        case 1:
          collect = 0;
          break;
      }
      let { data, code } = await red_set_commonly({
        id: this.red_template.select_red_template.id,
        status: collect,
        type: 1,
      });
      if (code == 1) {
        let { data } = await red_template_list({
          limit: 99999,
          keyword: this.red_template.keyword,
          type: 1,
        });
        this.red_template.all_template = data.data;

        data.data.forEach((el) => {
          if (this.red_template.select_red_template.id === el.id) {
            this.red_template.select_red_template.is_default = el.is_default;
          }
        });
      }
    },
    //选择套红模板的事件
    red_template_change(item) {
      if (item) {
        this.red_template.select_red_template = {};
        for (let key in item) {
          this.red_template.select_red_template[key] = item[key];
        }

        this.$emit(
          "GetRedTemplet",
          this.red_template.select_red_template["name"]
        );
        this.$store.commit(
          "SET_QUICK_DOCUMENT_red_template",
          this.red_template.select_red_template["content"]
        );
        this.$store.commit("SET_QUICK_REDTEMPLATEDATA", {
          content: this.red_template.select_red_template["content"],
          id: this.red_template.select_red_template["name"],
          name: this.red_template.select_red_template["id"],
        });
      } else {
        this.red_template.select_red_template = null;
      }
    },

    //提交数据到vuex
    updata_approval() {
      this.$store.commit("SET_QUICK_DOCUMENT_approval_where", this.approved);
      this.$store.commit("SET_QUICK_DOCUMENT_approval_copy", this.CCroved);
    },
    //流程搜索
    async liucheng_onSearch() {
      let type = null;
      if ([1, 2, 3].includes(parseInt(this.$route.query.type))) {
        type = this.$route.query.type;
      } else if (parseInt(this.$route.query.type) === 5) {
        type = 1;
      } else if (parseInt(this.$route.query.type) === 6) {
        type = 2;
      }
      let { data } = await approval_my_template({
        name: this.process.all_process_search,
        type,
        more: 2,
        limit: 10,
        page: this.process.page,
      });
      this.process.all_process = data.data;
      this.process.count = data.count;
    },

    // 审批人
    // 弹窗 确认
    // 前端type  1上级 2标签 3单个成员 4自己 5部门
    //自定义type   1组织架构(部门)，2组织架构(人)，3发文收文单位，4标签，5角色，6最近选择
    apphandleOk() {
      let a = this.appvisiradiovalue;
      //   分插入和添加
      if (this.what_add || this.what_add == 0) {
        if (a == 1) {
          let b = this.appvisiradioone.appvisiselectvalue;
          let c = this.appvisiradioone.appvisiselecttext;
          this.approved.splice(this.what_add, 0, {
            title: c,
            approver_type: this.appvisiradioone.appvisiradiovalue,
            avatar: "",
            users: [{ flag: 4, id: b }],
            info: [{ avatar: "" }],
            backfill_type: a,
          });
        } else if (a == 2) {
          let b = this.appvisiradiotwo;
          let _flag = true;
          if (this.backfill_record) {
            for (let vel of b.tagsrange.visual) {
              // 判断是否在弹窗把点击的那个节点删除了
              if (vel.id == this.backfill_record.users[0].id) {
                _flag = false;
              }
            }
            if (_flag) {
              this.approved.forEach((el, index) => {
                if (
                  el.type == 2 &&
                  el.users[0].id == this.backfill_record.users[0].id
                ) {
                  this.approved.splice(index, 1);
                  this.what_add = this.what_add - 1;
                }
              });
            }
          }

          for (let vel of b.tagsrange.visual) {
            this.approved.splice(this.what_add, 0, {
              title: vel.title,
              approver_type: b.appvisiradiovalue,
              avatar: vel.avatar,
              users: [{ flag: a, id: vel.value }],
              id: 0,
              info: [{ avatar: vel.avatar }],
              backfill_type: a,
              type: 2,
              value: vel.value,
            });
            if (this.backfill_record) {
              this.what_add++;
            }
          }
        } else if (a == 3) {
          let b = this.appvisiradiothree;
          let _flag = true;

          if (this.backfill_record) {
            for (let vel of b.tagsrange.visual) {
              // 判断是否在弹窗把点击的那个节点删除了
              if (vel.id == this.backfill_record.users[0].id) {
                _flag = false;
              }
            }

            if (_flag) {
              this.approved.forEach((el, index) => {
                if (
                  el.type == 3 &&
                  el.users[0].id == this.backfill_record.users[0].id
                ) {
                  this.approved.splice(index, 1);
                  this.what_add = this.what_add - 1;
                }
              });
            }
          }

          for (let vel of b.tagsrange.visual) {
            this.approved.splice(this.what_add, 0, {
              title: "单个成员",
              approver_type: 2,
              avatar: vel.avatar,
              users: [
                {
                  flag: a,
                  avatar: vel.avatar,
                  id: vel.value,
                  name: vel.title,
                  dname: vel.dname,
                },
              ],
              id: 0,
              info: [
                {
                  avatar: vel.avatar,
                  id: vel.value,
                  name: vel.title,
                  dname: vel.dname,
                },
              ],
              type: 3,
              backfill_type: a,
              num_id: vel.id,
            });
            if (this.backfill_record) {
              this.what_add++;
            }
          }
        } else if (a == 4) {
          this.approved.splice(this.what_add, 0, {
            title: "申请人",
            approver_type: 2,
            avatar: "",
            users: [
              {
                flag: 5,
                id: JSON.parse(sessionStorage.getItem("userinfo")).userid,
              },
            ],
            id: 0,
            info: [{ avatar: "" }],
            backfill_type: a,
          });
        } else if (a == 5) {
          let b = this.appvisiradiofive;
          let _flag = true;
          if (this.backfill_record) {
            for (let vel of b.tagsrange.visual) {
              // 判断是否在弹窗把点击的那个节点删除了
              if (vel.id == this.backfill_record.users[0].id) {
                _flag = false;
              }
            }
            if (_flag) {
              this.approved.forEach((el, index) => {
                if (el.type == 5 && el.id == this.backfill_record.id) {
                  this.approved.splice(index, 1);
                  this.what_add = this.what_add - 1;
                }
              });
            }
          }

          for (let vel of b.tagsrange.visual) {
            this.approved.splice(this.what_add, 0, {
              title: vel.title,
              approver_type: b.appvisiradiovalue,
              avatar: vel.avatar,
              users: [{ flag: 1, id: vel.value }],
              id: 0,
              info: [{ avatar: vel.avatar }],
              backfill_type: a,
              type: 5,
            });
            if (this.backfill_record) {
              this.what_add++;
            }
          }
        }
      } else {
        if (a == 1) {
          let b = this.appvisiradioone.appvisiselectvalue;
          let c = this.appvisiradioone.appvisiselecttext;
          this.approved.push({
            title: c,
            approver_type: this.appvisiradioone.appvisiradiovalue,
            avatar: "",
            id: 0,
            users: [{ flag: 4, id: b }],
            info: [{ avatar: "" }],
            backfill_type: a,
          });
        } else if (a == 2) {
          let b = this.appvisiradiotwo;
          for (let vel of b.tagsrange.visual) {
            this.approved.push({
              title: vel.title,
              approver_type: b.appvisiradiovalue,
              avatar: vel.avatar,
              users: [{ flag: a, id: vel.value }],
              id: 0,
              info: [{ avatar: vel.avatar }],
              type: 2,
              backfill_type: a,
              value: vel.value,
            });
          }
        } else if (a == 3) {
          let b = this.appvisiradiothree;

          for (let vel of b.tagsrange.visual) {
            this.approved.push({
              title: "单个成员",
              approver_type: 2,
              avatar: vel.avatar,
              users: [
                {
                  flag: a,
                  avatar: vel.avatar,
                  id: vel.value,
                  name: vel.title,
                  dname: vel.dname,
                },
              ],
              id: 0,
              num_id: vel.id,
              info: [
                {
                  avatar: vel.avatar,
                  id: vel.value,
                  name: vel.title,
                  dname: vel.dname,
                },
              ],
              type: 3,
              backfill_type: a,
            });
          }
        } else if (a == 4) {
          this.approved.push({
            title: "申请人",
            approver_type: 2,
            avatar: "",
            users: [
              {
                flag: 5,
                id: JSON.parse(sessionStorage.getItem("userinfo")).userid,
              },
            ],
            id: 0,
            info: [{ avatar: "" }],
            backfill_type: a,
          });
        } else if (a == 5) {
          let b = this.appvisiradiofive;
          for (let vel of b.tagsrange.visual) {
            this.approved.push({
              title: vel.title,
              approver_type: b.appvisiradiovalue,
              avatar: vel.avatar,
              users: [{ id: vel.value, flag: 1 }],
              id: 0,
              info: [{ avatar: vel.avatar }],
              backfill_type: a,
              type: 5,
            });
          }
        }
      }

      // let obj = {};
      // let peon = this.approved.reduce((cur, next) => {
      //   const findIndex = cur.findIndex((item) => {
      //     if (item.type == 3) {
      //       return item.users[0].id == next.users[0].id;
      //     } else {
      //       return false;
      //     }
      //   });
      //   if (findIndex == -1) {
      //     cur.push(next);
      //   } else {
      //     cur.splice(findIndex, 1);
      //     cur.push(next);
      //   }
      //   return cur;
      // }, []); //设置cur默认类型为数组，并且初始值为空的数组

      // this.approved = peon;
      this.appvisi = false;

      this.cloerRen(this.appvisiradiotwo);
      this.cloerRen(this.appvisiradiothree);
      this.cloerRen(this.appvisiradiofive);
    },
    // 弹窗 取消
    apphandleCancel(e) {
      this.appvisi = false;
      this.cloerRen(this.appvisiradiotwo);
      this.cloerRen(this.appvisiradiothree);
      this.cloerRen(this.appvisiradiofive);
    },
    //删除
    approver_del(index) {
      if (this.process.process_jurisdiction.edit_approval == 1) {
        this.approved.splice(index, 1);
      }
    },
    // 下拉级别
    handleChange(value, a) {
      this.appvisiradioone.appvisiselecttext =
        a.componentOptions.children[0].text;
    },
    //审批人插入
    insert_approval(inx) {},
    // 审批人添加
    add_approval(inx, val) {
      //inx=1为插入，2为添加,3为点击头像数据回填
      // what_add=>在某个后面插入
      if (this.process.process_jurisdiction.edit_approval == 1) {     
        //权限判断
        this.backfill_record = null;
        if (inx == 1) {
          this.appvisiradiovalue = 1;
          this.what_add = val;
        } else if (inx == 2) {
          if (this.get_process.liucheng_id != "next") {
            this.appvisiradiovalue = 1;
          }
          this.what_add = null;
        } else if (inx == 3) {
          this.what_add = val + 1;
          // 数据回填
          this.backfill_record = JSON.parse(JSON.stringify(this.approved[val]));

          if (
            this.approved[val] &&
            [2, 3, 5].includes(this.approved[val].type)
          ) {
            let type = null;
            let key = null;
            if (this.approved[val].type == 2) {
              this.appvisiradiovalue = 2;
              // avatar: ""
              // dname: undefined
              // id: 2
              // title: "公文处理-分管院领导"
              // type: 2
              // value: "tag2"
              let _data = {};
              _data.type = 2;
              _data.avatar = "";
              _data.dname = "";
              _data.id = this.approved[val].users[0].id;
              _data.title = this.approved[val].title;
              _data.value = this.approved[val].value;

              this.appvisiradiotwo.tagsrange.visual.push(
                JSON.parse(JSON.stringify(_data))
              );

              //人
            } else if (this.approved[val].type == 3) {
              this.appvisiradiovalue = 3;
              // avatar: "https://wework.qpic.cn/bizmail/ZITwXmaFafVV98JrPkOoXZT0xndgT93gD0s3WGLYmTyEmnEY3jE3AA/0"
              // dname: ["研发部"]
              // id: 1457
              // title: "张强"
              // type: 0
              // value: "15808442776"
              let _data = {};
              _data.avatar = this.approved[val].users[0].avatar;
              _data.dname = this.approved[val].users[0].dname;
              _data.title = this.approved[val].users[0].name;
              _data.type = 0;
              _data.value = this.approved[val].users[0].id;
              _data.id = this.approved[val].num_id;

              this.appvisiradiothree.tagsrange.visual.push(_data);
              // 部门
            } else if (this.approved[val].type == 5) {
              this.appvisiradiovalue = 5;
              // avatar: ""
              // dname: undefined
              // id: 80
              // title: "行政部门"
              // type: 1
              // value: 80

              let _data = {};
              _data.avatar = "";
              _data.dname = "";
              _data.id = this.approved[val].users[0].id;
              _data.title = this.approved[val].title;
              _data.type = 1;
              _data.value = this.approved[val].users[0].id;
              this.appvisiradiofive.tagsrange.visual.push(_data);
            }
          }
        }

        this.appvisi = true;
      }
    },

    // 切换类型
    appvisiradioonChange(e) {},
    // 清除弹窗勾选审批人
    cloerRen(e) {
      e.tagsrange.visual = [];
    },

    //------------ 抄送人  ------------
    // 弹窗 确认
    CChandleOk() {
      for (let vel of this.CCpersonradio.tagsrange.visual) {
        // 前端type 0 个人 1部门 2标签 后端 1部门 2标签 3个人
        let type = vel.type == 0 ? 3 : vel.type;
        this.CCroved.push({
          type,
          title: vel.title,
          avatar: vel.avatar,
          id: vel.value,
          users: [
            {
              id: vel.value,
              flag: 3,
            },
          ],
        });
      }
      let peon = this.CCroved.reduce((cur, next) => {
        const findIndex = cur.findIndex(
          (item) => item.users[0].id == next.users[0].id
        );
        if (findIndex == -1) {
          cur.push(next);
        } else {
          cur.splice(findIndex, 1);
          cur.push(next);
        }

        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组
      this.CCroved = peon;
      this.CCperson = false;
      this.cloerRen(this.CCpersonradio);
    },
    // 弹窗 取消
    CChandleCancel(e) {
      this.CCperson = false;
      this.cloerRen(this.CCpersonradio);
      // this.cloerRen(this.CCpersonradiofive);
    },
    // 切换类型
    CCvisiradioonChange(e) {},
    // 下拉级别
    CChandleChange(value, a) {
      this.CCpersonradioone.appvisiselecttext =
        a.componentOptions.children[0].text;
    },
    // 删除标签
    CCitemClose(e) {
      this.CCroved.splice(e, 1);
    },
    //------------ 抄送人  ------------
    // 抄送通知
    onRadio(e) {
      this.radio = e.target.value;
    },
    // 接收点击编辑之后传来的参数
    GetMaindata() {
      this.$bus.$off("postflowpathsetSetdata_quick");
      this.$bus.$on("postflowpathsetSetdata_quick", (val) => {
        this.mainData = val;
        this.form.name = val.name;
      });
    },
    // 获取发送ajax的数据
    GetajaxData() {
      let group_id = this.mainData.id;
      let name = this.form.name;
      let explain = this.form.desc;
    },
    //设置新流程
    set_new_process(num) {
      // 1是点击新建流程模板 2 是新建套红模板
      if (num == 1) {
        this.jumpPopup.centenText = "流程";
      } else {
        this.jumpPopup.centenText = "套红";
      }
      this.jumpPopup.visible = true;
    },
    // 跳转函数
    JumpFunction() {
      if (this.jumpPopup.centenText == "流程") {
        this.$router.push("/postflowpathset/postflowpathadd");
      } else {
        this.$router.push("/postcrimsonset/crimsonadd?type=1");
      }
    },
  },
  watch: {
    approved() {
      this.updata_approval();
    },
    obj: {
      handler(nval) {
        if (this.obj.process && this.obj.process.id == "") {
          if (this.obj._approved) {
            this.approved = JSON.parse(JSON.stringify(this.obj._approved));
          }
          if (this.obj._CCroved) {
            this.CCroved = JSON.parse(JSON.stringify(this.obj._CCroved));
          }
          this.appvisiradiovalue = 3;
          this.process.that_process = {};
          this.process.process_jurisdiction = {
            edit_approval: 1,
            edit_cclist: 1,
            revoke: 1,
          };
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../../css/setting.less");
.appvisi-modal {
  /deep/.ant-modal {
    width: 793px !important;
  }
}
</style>