<template>
  <div class="accept">
    <!-- 紧急程度 -->
    <div class="urgency">
      <h3 class="title">审批紧急程度</h3>
      <div class="r-content">
        <span class="content-active" :class="jj[process_urgent_level].color">{{
          jj[process_urgent_level].text
        }}</span>
      </div>
    </div>
    <!-- 处理意见 -->
    <div class="opinion">
      <h3 class="title">处理意见</h3>
      <div class="r-content two_s">
        <a-radio-group
          name="opinion"
          v-show="show_op"
          v-model="get_toexamine.status"
          @change="change_toexamine"
        >
          <a-radio :value="3" :disabled="show_nextnode">同意</a-radio>
          <a-radio :value="4" :disabled="show_nextnode">驳回</a-radio>
          <a-radio :value="6" :disabled="show_nextnode">暂放</a-radio>
          <a-radio :value="11" :disabled="show_nextnode">转审</a-radio>
        </a-radio-group>
        <div class="r-textarea">
          <a-textarea
            :maxLength="400"
            v-model="get_toexamine.explain"
            placeholder="请输入处理意见"
          />
          <span class="box-textnum">{{ inputLength }}/400</span>

          <div class="flex-col">
            <div class="textarea-btn one hand" @click="QuickResponse">
              快捷回复
              <a-icon
                :type="show_s ? 'caret-up' : 'caret-down'"
                style="color: #b4bccc; font-size: 12px"
              />
            </div>
            <a-modal
              title="快捷回复"
              :visible="show_s"
              @cancel="show_s_handleCancel"
              dialogClass="show_s"
            >
              <div class="show_s_content">
                <template v-for="item in nimble_list">
                  <div
                    class="show_s_content-list hand"
                    @click="choice_nimble_list(item.content)"
                    :key="item.id"
                  >
                    <div class="show_s_content-left">{{ item.content }}</div>
                    <div class="bianji" @click="bianji(item)"></div>
                    <div
                      class="show_s_content-right"
                      @click.stop="del_nimble_list(item.id)"
                    >
                      <SvgIcon :item="'del'" />
                    </div>
                  </div>
                </template>
              </div>
              <div
                class="show_s_content_addbtn hand"
                v-show="nimble_list.length < 10"
                @click="
                  show_s_t = true;
                  show_s = false;
                "
              >
                <SvgIcon :item="'adds'" />添加快捷回复
              </div>
            </a-modal>
            <a-modal
              title="添加快捷回复"
              :visible="show_s_t"
              :confirm-loading="confirmLoading"
              @ok="show_st_handleOk"
              @cancel="show_st_handleCancel"
              dialogClass="show_st"
              cancelText="取消"
              okText="确认"
            >
              <div class="show_st_content">
                <div class="show_st_content_title">回复内容</div>
                <a-textarea
                  v-model="nimble_add"
                  :maxLength="200"
                  placeholder="请输入"
                />
              </div>
            </a-modal>
            <div class="textarea-btn two hand" @click="show_pass = true">
              使用电子签章
            </div>
            <a-modal
              title="输入使用密码"
              :visible="show_d"
              :confirm-loading="confirmLoading"
              @ok="show_d_handleOk"
              @cancel="show_d_handleCancel"
              dialogClass="show_d"
              cancelText="取消"
              okText="确定"
            >
              <div class="show_d_content">
                <a-form-model>
                  <a-form-model-item label="签章密码">
                    <a-input v-model="password" type="password" />
                  </a-form-model-item>
                </a-form-model>
              </div>
            </a-modal>
            <a-modal
              title="选择签章"
              :visible="show_pass"
              @ok="show_pass_handleOk"
              @cancel="show_pass_handleCancel"
              dialogClass="show_pass"
              cancelText="取消"
              okText="确定"
            >
              <div class="show_pass_content">
                <div class="show_pass_content_top">
                  <a-tabs v-model="show_pass_key" @change="sel_show_pass_key">
                    <a-tab-pane :key="3" tab="我的常用签章"></a-tab-pane>
                    <a-tab-pane
                      :key="1"
                      tab="所有签章"
                      force-render
                    ></a-tab-pane>
                    <a-tab-pane :key="2" tab="我创建的"></a-tab-pane>
                    <a-tab-pane :key="4" tab="授权给我的"></a-tab-pane>
                  </a-tabs>
                  <div
                    class="show_pass_content_rt hand"
                    @click="onUploadSignature"
                  >
                    <SvgIcon :item="'adds'" />上传签章
                  </div>
                </div>
                <div class="show_pass_content_content">
                  <div class="show_pass_content_content_top">
                    <a-select
                      style="width: 120px"
                      v-model="select_value"
                      @change="sel_select_value"
                    >
                      <a-select-option :value="2">个人签字</a-select-option>
                      <a-select-option :value="1">公司印章</a-select-option>
                      <a-select-option :value="3">私人印章</a-select-option>
                    </a-select>
                    <a-input-search
                      placeholder="搜索签章"
                      v-model="select_name"
                      style="width: 240px"
                      @search="onSearch"
                    />
                  </div>
                  <div class="show_pass_content_content_two">
                    <template v-for="item in show_data">
                      <div
                        class="pass_cell hand"
                        :key="item.id"
                        @click="pass_cell_click(item)"
                      >
                        <div class="pass_cell_img">
                          <img :src="item.img | img(HttpUrl)" alt />
                        </div>
                        <div class="pass_cell_text">{{ item.name }}</div>
                        <div
                          class="pass_cell_show"
                          v-if="item.id == actindex.id"
                        >
                          <div class="pass_cell_show_top">
                            <div class="pass_cell_show_top_s">
                              <a-icon type="check" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <notFound v-show="!show_data || show_data.length <= 0" />
                  </div>
                  <Pagination
                    @pageChange="pagechangepathset"
                    @currentchange="currentchangepathset"
                    :paging="paging"
                    class="Page"
                  />
                </div>
              </div>
            </a-modal>
          </div>
        </div>
        <div class="r-node">
          <div class="r-node-top">
            <!-- <div class="trial">
              <div class="trial_show" v-show="xz_type==1"></div>
              <div class="hand" :class="xz_type==1?'active_t':'active_s'" @click="trans_open(2)">
                <SvgIcon :item="'TransferToTrial'" style="margin-right:4px" />转审
              </div>
            </div>-->
            <div class="strial trial" v-if="get_leftdata.button.next">
              <div class="trial_show" v-show="xz_type == 2"></div>
              <div
                class="hand"
                :class="xz_type == 2 ? 'active_t' : 'active_s'"
                @click="trans_open(1)"
              >
                <SvgIcon
                  :item="'nextnode'"
                  style="margin-right: 4px"
                />指定下一节点
              </div>
            </div>
            <a-modal
              class="transfer-modal"
              title="选择人"
              :visible="appvisiradio"
              @ok="handleOk"
              @cancel="handleCancel"
              cancelText="取消"
              okText="确认"
            >
              <div>
                <Framelist
                  :show_data_flag="appvisiradio"
                  :range="people.tagsrange"
                  :tag="tags"
                  :restype="2"
                />
              </div>
            </a-modal>
            <a-modal
              title="转审"
              :visible="trans_show"
              @ok="trans_show_handleOk(2)"
              @cancel="trans_show_handleCancel(2)"
              dialogClass="nextnode_show"
              cancelText="取消"
              okText="确定"
            >
              <div class="nextnode_show_box">
                <div>审批人</div>
                <div class="items">
                  <template v-if="trans.a != ''">
                    <div
                      class="item"
                      v-for="(item, index) in trans.a"
                      :key="index"
                    >
                      <div class="item-top">
                        <img
                          v-if="item.avatar != ''"
                          class="item-top-img"
                          :src="item.avatar | img(HttpUrl)"
                          alt
                          srcset
                        />
                        <a-icon
                          type="close-circle"
                          class="item-close"
                          theme="filled"
                          @click="appitemClose(3, item.value)"
                        />
                      </div>
                      <div class="item-bottom">{{ item.title }}</div>
                    </div>
                  </template>
                  <a-button
                    type="dashed"
                    class="labeladd"
                    @click="addapproved(3)"
                  >
                    <a-icon type="plus" />
                  </a-button>
                </div>
                <div>
                  <span style="margin-right: 10px">通知方式：</span>
                  <a-checkbox-group v-model="trans.b">
                    <a-checkbox :value="1">待办</a-checkbox>
                    <a-checkbox :value="4" disabled>企业微信</a-checkbox>
                    <a-checkbox
                      :value="2"
                      :disabled="get_leftdata.button.youxiang == 0"
                      >邮箱</a-checkbox
                    >
                    <a-checkbox
                      :value="3"
                      :disabled="get_leftdata.button.duanxin == 0"
                      >短消息</a-checkbox
                    >
                  </a-checkbox-group>
                </div>
                <a-divider dashed />
                <div style="margin-bottom: 16px">附件内容</div>
                <!-- 已上传列表 -->
                <ul class="file-list" v-show="trans.c.length > 0">
                  <li
                    class="file-item"
                    v-for="(item, index) in trans.c"
                    :key="index"
                  >
                    <div class="file-item-left">
                      <i></i>
                      <span>{{ item.name }}</span>
                    </div>
                    <div class="file-item-right">
                      <i
                        class="eye"
                        v-if="
                          [
                            'txt',
                            'doc',
                            'docx',
                            'pdf',
                            'png',
                            'jpg',
                            'jpe',
                          ].includes(get_suffix(item))
                        "
                        @click="look(item)"
                      ></i>
                      <i class="delete" @click="trans_del_file(index)"></i>
                    </div>
                  </li>
                </ul>
                <!-- 正在上传 -->
                <div class="uploading" v-show="trans_reFreshing">
                  <div class="up-title">
                    <span>{{ trans_that_percent.name }}</span>
                    <span>{{ upload_state }}</span>
                  </div>
                  <div class="speed">
                    <a-progress
                      :percent="trans_progress"
                      strokeColor="#75D25EFF"
                    />
                    <span class="gray" v-show="!trans_that_reFresh">取消</span>
                  </div>
                </div>
                <!-- 点击上传 -->
                <div class="add-upload">
                  <a-upload
                    name="avatar"
                    :showUploadList="false"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :beforeUpload="trans_beforeUpload"
                    :customRequest="trans_customRequest"
                  >
                    <div>
                      <SvgIcon :item="'upload'" />
                      <span>上传附件</span>
                      <span style="color: #0082ef; margin-left: 10px"
                        >点击上传</span
                      >
                    </div>
                  </a-upload>
                </div>
              </div>
            </a-modal>
            <a-modal
              title="指定下一节点"
              :visible="nextnode_show"
              @ok="trans_show_handleOk(1)"
              @cancel="trans_show_handleCancel(1)"
              dialogClass="nextnode_show"
              cancelText="取消"
              okText="确定"
            >
              <div class="nextnode_show_box">
                <div>审批人</div>
                <div class="items">
                  <template v-if="nextnodes.a != ''">
                    <div
                      class="item"
                      v-for="(item, index) in nextnodes.a"
                      :key="index"
                    >
                      <div class="item-top">
                        <img
                          v-if="item.avatar != ''"
                          class="item-top-img"
                          :src="item.avatar | img(HttpUrl)"
                          alt
                          srcset
                        />
                        <a-icon
                          type="close-circle"
                          class="item-close"
                          theme="filled"
                          @click="appitemClose(1, item.value)"
                        />
                      </div>
                      <div class="item-bottom">{{ item.title }}</div>
                    </div>
                  </template>
                  <a-button
                    type="dashed"
                    class="labeladd"
                    @click="addapproved(1)"
                  >
                    <a-icon type="plus" />
                  </a-button>
                </div>
                <div style="margin: 10px 0 15px">
                  <span style="margin-right: 10px">审核方式：</span>
                  <a-radio-group v-model="nextnodes.c">
                    <a-radio :value="2">或签</a-radio>
                    <a-radio :value="1">会签</a-radio>
                  </a-radio-group>
                </div>
                <div>
                  <span style="margin-right: 10px">通知方式：</span>
                  <a-checkbox-group v-model="nextnodes.d">
                    <a-checkbox :value="1">代办</a-checkbox>
                    <a-checkbox :value="4" disabled>企业微信</a-checkbox>
                    <a-checkbox
                      :value="2"
                      :disabled="get_leftdata.button.youxiang == 0"
                      >邮箱</a-checkbox
                    >
                    <a-checkbox
                      :value="3"
                      :disabled="get_leftdata.button.duanxin == 0"
                      >短消息</a-checkbox
                    >
                  </a-checkbox-group>
                </div>
                <a-divider dashed />
                <div>默认抄送人</div>
                <div class="items">
                  <template v-if="nextnodes.b != ''">
                    <div
                      v-for="(item, index) in nextnodes.b"
                      class="item"
                      :key="index"
                    >
                      <div class="item-top">
                        <img
                          v-if="item.avatar != ''"
                          class="item-top-img"
                          :src="item.avatar | img(HttpUrl)"
                          alt
                          srcset
                        />
                        <a-icon
                          type="close-circle"
                          class="item-close"
                          theme="filled"
                          @click="appitemClose(2, item.value)"
                        />
                      </div>
                      <div class="item-bottom">{{ item.title }}</div>
                    </div>
                  </template>
                  <a-button
                    type="dashed"
                    class="labeladd"
                    @click="addapproved(2)"
                  >
                    <a-icon type="plus" />
                  </a-button>
                </div>
              </div>
            </a-modal>
          </div>
          <div class="r-node-bottom hand" v-show="show_nextnode">
            <div class="r-node-bottom-top">
              <span>
                {{ nodeText }}：
                <span
                  style="
                    padding: 2px 6px;
                    font-size: 12px;
                    color: #0082ef;
                    border: 1px solid #42a2f3;
                    border-radius: 3px;
                  "
                  >{{ appvisiradiovalue == 1 ? "会签" : "或签" }}</span
                >
              </span>
              <div style="color: #c0c4cc">
                <span @click="Updatenext">修改</span>
                <span @click="Cancelnext" style="margin-left: 15px">取消</span>
              </div>
            </div>
            <div class="r-node-bottom-bottom-s">
              <template
                v-for="(item, index) in xz_type == 1
                  ? nextnode_approved
                  : trans_approved"
              >
                <div class="r-node-bottom-bottom" :key="index">
                  <img :src="item.avatar" alt />
                  <div>{{ item.title }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 附件 -->
    <div class="opinion opinion-file">
      <h3 class="title">
        附件
        <span style="font-size: 12px; color: #c0c6cc">(非正文附件)</span>
      </h3>
      <!-- 已上传列表 -->
      <ul class="file-list" v-show="percent.length > 0">
        <li class="file-item" v-for="(item, index) in percent" :key="index">
          <div class="file-item-left">
            <i
              :class="
                get_file_img(
                  item.path.split('.')[item.path.split('.').length - 1]
                )
              "
            ></i>
            <span>{{ item.name }}</span>
          </div>
          <div class="file-item-right">
            <i class="eye" @click="look(item)"></i>
            <i class="delete" @click="del_file(index)"></i>
          </div>
        </li>
      </ul>
      <!-- 正在上传 -->
      <div class="uploading" v-show="reFreshing">
        <div class="up-title">
          <span>{{ that_percent.name }}</span>
          <span>{{ upload_state }}</span>
        </div>
        <div class="speed">
          <a-progress :percent="progress" strokeColor="#75D25EFF" />
          <span class="gray" v-show="!that_reFresh">取消</span>
        </div>
      </div>
      <!-- 点击上传 -->
      <div class="add-upload">
        <a-upload
          name="avatar"
          :showUploadList="false"
          list-type="picture-card"
          class="avatar-uploader"
          :beforeUpload="trans_beforeUpload"
          :customRequest="customRequest"
        >
          <div>
            <SvgIcon :item="'upload'" />
            <span>上传附件</span>
            <span style="color: #0082ef; margin-left: 10px">点击上传</span>
          </div>
        </a-upload>
      </div>
    </div>
    <!-- 查看更多 -->
    <div class="more" @click="more_flag = !more_flag">
      <h3 class="title2">
        <span>{{ more_flag ? "收起" : "展开更多" }}</span>

        <i class="sanjiao" :class="more_flag ? 'xia' : 'shang'"></i>
      </h3>
    </div>
    <div class="more-content" v-show="more_flag">
      <!-- 通知选项 -->
      <div class="notification-option" v-show="get_toexamine.status == 3">
        <h3 class="title">通知选项</h3>
        <div class="r-content">
          <p class="r-content-p">
            流程启动后
            <a-input
              v-model="notice.day"
              @change="time_set"
              placeholder="0"
              :maxLength="2"
            />天
            <a-input
              v-model="notice.hour"
              @change="time_set"
              placeholder="0"
              :maxLength="2"
            />时
            <a-input
              v-model="notice.minute"
              @change="time_set"
              placeholder="0"
              :maxLength="2"
            />分 &nbsp; <br />后仍无结束通知我
          </p>
          <a-checkbox
            :defaultChecked="get_toexamine.notice == 1 ? false : true"
            @change="checkboxchange"
            >流程结束后通知我</a-checkbox
          >
          <div
            style="margin-top: 20px"
            v-show="get_toexamine.notice == 1 ? false : true"
          >
            <div>通知方式</div>
            <div style="margin-top: 10px">
              <a-checkbox-group v-model="ways" @change="wayschange">
                <a-checkbox disabled :value="1">代办</a-checkbox>
                <a-checkbox :value="4" disabled>企业微信</a-checkbox>
                <a-checkbox
                  :value="2"
                  :disabled="get_leftdata.button.youxiang == 0"
                  >邮箱</a-checkbox
                >
                <a-checkbox
                  :value="3"
                  :disabled="get_leftdata.button.duanxin == 0"
                  >短消息</a-checkbox
                >
              </a-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <!-- 提交人 -->
      <div class="submitter">
        <h3 class="title">提交人</h3>
        <div class="r-content">
          <div class="r-content-pre flex-col">
            <div class="head-img">
              <img :src="applicant.avatar" alt />
            </div>
            <span class="name">
              {{ applicant.name }}
              <span class="name-text">{{ `(${applicant.dname.join()})` }}</span>
            </span>
          </div>
        </div>
      </div>
      <!-- 上下处理节点 -->
      <div class="switch">
        <h3 class="title">上下处理节点</h3>
        <div class="r-content">
          <div class="r-content-pre">
            <div class="before" v-if="prv.status || prv.status == 0">
              <h4 class="sec-title" style="color: #0082ef">上一节点：</h4>
              <template v-if="prv != ''">
                <div
                  class="flex-col mb10"
                  v-for="(item, index) in prv.username"
                  :key="index"
                >
                  <div class="head-img">
                    <img :src="item.avatar" alt />
                  </div>
                  <span class="name">{{ item.name }} {{ item.position }}</span>
                </div>
              </template>
            </div>
            <div
              class="after"
              v-if="next.name || (next.length && next.length > 0)"
            >
              <h4 class="sec-title" style="color: #62c232">即将流向：</h4>
              <template v-if="next != ''">
                <div
                  class="flex-col mb10"
                  v-for="(item, index) in next.username"
                  :key="index"
                >
                  <div class="head-img">
                    <img :src="item.avatar" alt />
                  </div>
                  <span class="name">{{ item.name }} {{ item.position }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- 通知方式 -->
      <a-modal
        v-model="visible"
        title="预览公文内容"
        ok-text="确认"
        cancel-text="取消"
      >
        <iframe
          :src="look_path"
          width="100%"
          height="400px"
          frameborder="0"
        ></iframe>
      </a-modal>
      <!-- 文件预览 -->
      <div class="file_preview">
        <a-modal
          v-model="vis_path"
          title="预览附件内容"
          ok-text="确认"
          cancel-text="取消"
          @ok="vis_path = false"
        >
          <pre class="view-file-box" v-html="that_view_file_text"></pre>
        </a-modal>
      </div>
      <!-- <a-button type="primary" @click="btnclick">Primary</a-button> -->
    </div>
  </div>
</template>

<script>
import {
  randomnumber,
  public_data_files,
  preview_url,
  HttpUrl,
  get_file_img,
} from "@/js/public.js";
import Framelist from "@/views/sendout/draft/addcompoents/components/organization/framelist.vue";
import { get_approval_around_info } from "@/api/incoming.js";
import { getEle, myEleList, ele_check } from "@/api/allsignatrue.js";
import {
  approval_get_nimble,
  approval_nimble_add,
  approval_nimble_delete,
} from "@/api/draft.js";
import SvgIcon from "@/views/components/svgicon.vue";
import Pagination from "@/views/components/Pagination.vue";
import { get_word } from "@/api/public";
import notFound from "@/views/components/notFound.vue";
const Timestransfor = {
  dayTos: 24 * 60 * 60, // 天转秒
  hourTos: 60 * 60, // 小时转秒
  minuteTos: 60, // 分转秒
};
export default {
  props: {
    manager: {
      default: null,
    },
    id: {
      default: null,
    },
  },
  data() {
    return {
      ways: [1, 4],
      j_img: require("@/assets/pic.png"),
      HttpUrl, // 后端域名
      // 审批紧急程度
      jj: {
        1: {
          color: "normal",
          text: "普通",
        },
        2: {
          color: "urgent",
          text: "紧急",
        },
        3: {
          color: "so-urgent",
          text: "加急",
        },
      },
      // 通知方式
      checkedList: [],
      srcs: require("@/assets/logo.png"),
      // 浏览弹窗
      visible: false,
      // 当前预览的文件的路径
      look_path: null,
      //更多内容标杆
      more_flag: false,
      //紧急程度
      process_urgent_level: 1,
      //处理意见
      opinions: null,
      //提交人信息
      applicant: {
        name: "不是吧",
        position: "1324654",
        avatar: "",
        dname: [],
      },
      //通知文本
      notice: { day: null, hour: null, minute: null },

      //上一节点
      prv: [],
      next: [],

      //通知时间
      notice: {
        day: 0,
        hour: 0,
        minute: 0,
      },

      //上传状态
      upload_state: "上传中...",
      vis_path: false,

      //----------------------------------
      //文件上传进度
      progress: 0,
      reFreshing: false, //正在上传显示
      that_reFresh: false, //当前文件是否上传成功
      that_percent: {}, //当前文件数据
      // percent: this.$store.state.percent, // 上传文件的数据
      setInt: "", // 关闭倒计时的变量
      uids: "", // 当前上传文件的id
      // 快速回复
      show_s: false,
      confirmLoading: false,
      show_s_t: false,
      nimble_list: [],
      nimble_add: "",
      that_reply: {
        id: "",
      },
      // 电子签章
      show_d: false,
      // 选择电子签章页面
      show_pass: false,
      // 签章密码
      password: "",
      // 选择电子签章页面tab
      show_pass_key: 3,
      // 默认下来选中项
      select_value: 1,
      select_name: "",
      actindex: {
        id: -1,
      },
      // 传送给分页的数据
      show_data: [],
      paging: {
        total: null,
        current: 1,
        pageSize: 6,
      },
      // --------- 选择 ------------
      tags: { tags: true, tab: true, pe: true, bm: true },
      xz_type: -1, // 1 转审  2 下一个
      people: {
        // 1 审批人 2 默认抄送人 3 转审人
        type: 1,
        tagsrange: {
          visual: [], // 弹窗
        },
      },
      // 控制下个审批节点
      show_nextnode: false, // 是否可以点击
      nextnodes: {
        a: [],
        b: [],
        c: 2,
        d: [1, 4],
      }, // 确认取消
      // 下个审批节点
      nextnode_show: false,
      nextnode_approved: [],
      nextnode_cc: [],
      appvisiradio: false,
      // 审核方式
      appvisiradiovalue: 2,
      // 通知方式
      appcheckedList: [1, 4],
      // 转审
      trans: {
        a: [],
        b: [1, 4],
        c: [],
      },
      trans_show: false,
      trans_approved: [],
      transcheckedList: [1, 4],
      //转审_文件上传进度
      trans_progress: 0,
      trans_reFreshing: false, //正在上传显示
      trans_that_reFresh: false, //当前文件是否上传成功
      trans_that_percent: {}, //当前文件数据
      trans_percent: [], // 上传文件的数据
      trans_setInt: "", // 关闭倒计时的变量
      trans_uids: "", // 当前上传文件的id
      nodeText: "", // 节点状态，是转审还是指定下一节点

      that_view_file_text: "",
    };
  },
  watch: {
    manager() {
      this.process_urgent_level = this.manager.data.process_urgent_level;
    },
  },
  filters: {
    img(urls, url) {
      let text = String(urls).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = urls;
      } else {
        imgurl = url + urls;
      }
      return imgurl;
    },
  },
  created() {
    this.get_approval_around();
    this.$bus.$on("get_Uploaded_files", this.submitstate);
    this.$bus.$on("approval_my_shift_data", this.approval_my_shift_datas);
    this.$bus.$on("next_approval_node", this.next_approval_nodes);
    // 获取快捷回复列表
    this.get_approval_get_nimble();
    // 获取电子签章列表
    this.get_getEle();
    this.ways = this.get_toexamine.way.split(",").map(Number);
  },
  components: {
    SvgIcon,
    Framelist,
    Pagination,
    notFound,
  },
  computed: {
    get_state() {
      return this.$store.state;
    },
    get_toexamine() {
      return this.$store.state.toexamine;
    },
    get_leftdata() {
      return this.$store.state.leftdata;
    },
    is_show_s() {
      return this.get_leftdata.is_fast;
    },
    percent() {
      return this.$store.state.percent;
    },
    show_op() {
      // return !this.show_nextnode || this.$store.state.is_s_x == 1;
      return true;
    },
    inputLength() {
      return this.get_toexamine.explain.length || 0;
    },
  },
  methods: {
    get_file_img,
    //获取前缀
    get_suffix(item) {
      let suffix = null;
      suffix = item.name.split(".")[item.name.split(".").length - 1];
      return suffix;
    },
    // 点击上传签章跳转到签章页面
    onUploadSignature() {
      this.$router.push({ path: "/allsignature/allsignatureadd" });
    },
    // 深拷贝
    JtoJ(a) {
      return JSON.parse(JSON.stringify(a));
    },
    // 查看
    async look(item) {
      let suffix = item.name.split(".")[item.name.split(".").length - 1];

      this.look_path = item.url + "/" + item.data.key;
      if (["jpg", "png", "jpeg", "bmp", "pdf"].includes(suffix)) {
        window.open(this.look_path);
      } else if (suffix == "doc" || suffix == "docx") {
        window.open(preview_url + "?src=" + this.look_path);
      } else {
        let data = await get_word({
          path: this.look_path,
          file_type: 1,
        });
        this.that_view_file_text = data.data;
        this.vis_path = true;
      }
    },
    //数据获取
    async get_approval_around() {
      let { data } = await get_approval_around_info({
        data_id: this.$route.query.id,
        details: 2,
      });
      //空数据处理
      if (data && data.current) {
        //当前用户id
        let that_user_id = data.current.login;
        //当前用户暂存留言
        let that_message = "";
        data.current.username.forEach((el) => {
          if (that_user_id == el.userid) {
            that_message = el.explain == undefined ? "" : el.explain;
          }
        });
        this.$store.commit("SET_TOEXAMINE_explain", that_message);
        if (data.current.process_urgent_level) {
          this.process_urgent_level = data.current.process_urgent_level;
        }
        if (data.current.process_urgent_level) {
          this.applicant = data.current.applicant;
        }
      }
      if (data && data.next) {
        this.next = data.next;
      }
      if (data && data.prv) {
        this.prv = data.prv;
      }
    },
    //通知选项输入验证
    time_set() {
      for (let key in this.notice) {
        if (!parseInt(this.notice[key])) {
          this.notice[key] = 0;
        } else {
          this.notice[key] = parseInt(this.notice[key]);
        }
      }

      if (this.notice.hour > 24) {
        this.notice.hour = 24;
      }
      if (this.notice.minute > 59) {
        this.notice.minute = 59;
      }

      // 修改SET_TOEXAMINE_files
      let times = "";
      let time =
        this.notice.day * Timestransfor.dayTos +
        this.notice.hour * Timestransfor.hourTos +
        this.notice.minute * Timestransfor.minuteTos;
      if (time > 0) {
        times = time;
      }
      this.$store.commit("SET_TOEXAMINE_time", times);
    },
    //通知选项勾选
    checkboxchange(val) {
      this.$store.commit("SET_TOEXAMINE_notice", val.target.checked ? 2 : 1);
    },
    // 判断上传文件是否符合要求
    trans_beforeUpload(file) {
      let type = [
        // 支持上传文件类型
        "txt",
        "docx",
        "pptx",
        "ppt",
        "pdf",
        "xls",
        "xlsx",
        "mp3",
        "mp4",
        "zip",
        "rar",
        "png",
        "jpg",
        "jpeg",
        "bmp",
      ];
      return public_data_files(file, type);
    },
    // 获取上传文件信息以及从后端获取token
    trans_customRequest(files) {
      this.reset();
      this.trans_reFreshing = true;
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      let timer = setInterval(() => {
        if (this.trans_progress < nums) {
          this.trans_progress += 1;
        } else {
          this.trans_reFreshing = false;
          clearInterval(timer);
        }
      }, 100);

      let { file } = files;
      // this.uid = file.uid;
      randomnumber(files, this.trans_saveFile);
    },
    // callback获取七牛云返回的数据
    trans_saveFile(data) {
      this.trans_progress = 100;
      this.upload_state = "上传成功";
      this.trans_that_reFresh = true;
      // this.$store.commit("SET_TOEXAMINE_files",data);
      let path = data.url + "/" + data.data.key;
      this.trans.c.push({ ...data, path });
      this.trans_that_percent = data;
    },
    //删除文件
    trans_del_file(key) {
      this.$confirm({
        icon: "info-circle",
        title: "提示",
        content: "是否删除该文件？",
        okText: "确认",
        cancelText: "取消",
        onOk: function () {
          this.trans.c.splice(key, 1);
          this.reset();
        }.bind(this),
        onCancel() {},
      });
    },
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      let type = ["docx", "pdf", "word"];
      return public_data_files(file, type);
    },
    // 获取上传文件信息以及从后端获取token
    customRequest(files) {
      this.reset();
      this.reFreshing = true;
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      let timer = setInterval(() => {
        if (this.progress < nums) {
          this.progress += 1;
        } else {
          this.reFreshing = false;
          clearInterval(timer);
        }
      }, 100);

      let { file } = files;
      // this.uid = file.uid;
      randomnumber(files, this.saveFile);
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.progress = 100;
      this.upload_state = "上传成功";
      this.that_reFresh = true;
      let path = data.url + "/" + data.data.key;
      this.percent.push({ ...data, path });
      this.that_percent = data;
    },
    //删除文件
    del_file(key) {
      this.$confirm({
        icon: "info-circle",
        title: "提示",
        content: "是否删除该文件？",
        okText: "确认",
        cancelText: "取消",
        onOk: function () {
          this.percent.splice(key, 1);
          this.reset();
        }.bind(this),
        onCancel() {},
      });
    },
    //上传属性重置
    reset() {
      this.reFreshing = false;
      this.that_reFresh = false;
      this.progress = 0;
      this.that_percent.name = "";
    },
    //看更多
    see_more() {
      this.more_flag = true;
    },
    // 紧急程度
    onradioChange() {},
    btnclick() {},
    // 提交 数据到state
    submitstate() {
      // 修改SET_TOEXAMINE_files
      let data = "";
      if (this.percent.length > 0) {
        data = this.percent.map((v) => {
          return {
            size: v.size,
            old_name: v.name,
            path: v.path,
          };
        });
      }
      this.$store.commit("SET_TOEXAMINE_files", data);
    },
    // 获取快捷回复
    async get_approval_get_nimble() {
      let a = await approval_get_nimble();
      if (a.code == 1) {
        this.nimble_list = a.data;
      }
    },
    // 选择快捷回复语
    choice_nimble_list(v) {
      let _length = 0;

      if (v.length + this.get_toexamine.explain.length >= 400) {
        if (this.get_toexamine.explain.length >= 400) {
          return;
        }

        for (let i = 0; i < v.length; i++) {
          if (this.get_toexamine.explain.length < 400) {
            this.get_toexamine.explain += v[i];
          }
        }
        this.get_toexamine.explain += "\n";
      } else {
        this.get_toexamine.explain += v + "\n";
      }
    },

    // 编辑快捷回复
    bianji(item) {
      this.that_reply = item;
      this.show_s_t = true;
      this.show_s = false;
      if (this.that_reply.id) {
        this.nimble_add = item.content;
      }
    },
    // 删除快捷回复按钮
    async del_nimble_list(id) {
      let a = await approval_nimble_delete({ id });
      if (a.code == 1) {
        this.get_approval_get_nimble();
      }
    },
    // 快速回复弹窗
    QuickResponse() {
      this.show_s = !this.show_s;
    },
    // 自定义ok
    async show_st_handleOk() {
      this.confirmLoading = true;
      let a = await approval_nimble_add({
        id: this.that_reply.id || "",
        content: this.nimble_add,
      });
      if (a.code == 1) {
        this.get_approval_get_nimble();
        setTimeout(() => {
          this.show_s_t = false;
          this.confirmLoading = false;
          this.show_s = true;
          this.nimble_add = "";
        }, 2000);
      }
      this.that_reply.id = "";
    },
    show_st_handleCancel() {
      this.show_s_t = false;
      this.show_s = true;
      this.nimble_add = "";
    },
    show_s_handleCancel() {
      this.show_s = false;
    },
    // 获取电子签章
    async get_getEle() {
      let res;
      if (this.show_pass_key == 4) {
        res = await myEleList({
          name: this.select_name,
          type: this.select_value,
          limit: this.paging.pageSize,
          page: this.paging.current,
        });
      } else {
        res = await getEle({
          name: this.select_name,
          type: this.select_value,
          status: this.show_pass_key,
          limit: this.paging.pageSize,
          page: this.paging.current,
        });
      }
      if (res.code == 1) {
        res.data.datas.map((v) => {
          v.key = v.id;
        });
        this.paging.total = res.data.count;
        this.show_data = res.data.datas;
        this.actindex = -1;
      }
    },
    // 页数发生变化
    pagechangepathset(val) {
      this.paging.current = val;
      this.get_getEle();
    },
    // 每页条数发生变化
    currentchangepathset(val) {
      this.paging.pageSize = val;
      this.paging.current = 1;
      this.get_getEle();
    },
    //搜索电子签章
    onSearch() {
      this.paging.current = 1;
      this.get_getEle();
    },
    //电子签章tab切换
    sel_show_pass_key() {
      this.get_getEle();
    },
    //下拉事件
    sel_select_value(e) {
      this.get_getEle();
    },
    // 确认密码
    async show_d_handleOk() {
      let a = await ele_check({
        id: this.actindex.id,
        pwd: btoa(this.password),
      });
      if (a.code == 1) {
        this.show_d = false;
        this.$bus.$emit("tabs_change");
        let text_H = document.querySelector(".w-e-text-container").clientHeight;
        this.get_state.use_zhang.push({
          signature_id: this.actindex.id,
          signature_img: this.actindex.img_data,
          signature_base: this.actindex.img_data,
          id: this.actindex.id,
          img_data: this.actindex.img_data,
          img: this.actindex.img_data,
          position: {
            top: text_H - 1.5 * 142,
            left: 426,
            width: 142,
            zindex: this.get_state.use_zhang.length + 1,
          },
        });
      } else {
        this.password = "";
      }
    },
    show_d_handleCancel() {
      this.show_pass = true;
      this.show_d = false;
    },
    // 确认电子签章弹窗
    async show_pass_handleOk() {
      if (this.actindex == -1) {
        this.$message.error("请先选择签章后再确认");
      } else {
        // 免密使用
        if (this.actindex.is_pwd == 0) {
          let a = await ele_check({
            id: this.actindex.id,
            pwd: btoa(this.password),
          });
          if (a.code == 1) {
            this.$bus.$emit("tabs_change");
            let text_H = document.querySelector(".w-e-text-container")
              .clientHeight;
            this.get_state.use_zhang.push({
              signature_id: this.actindex.id,
              signature_img: this.actindex.img_data,
              signature_base: this.actindex.img_data,
              id: this.actindex.id,
              img_data: this.actindex.img_data,
              img: this.actindex.img_data,
              position: {
                top: text_H - 1.5 * 142,
                left: 426,
                width: 142,
                zindex: this.get_state.use_zhang.length + 1,
              },
            });
            this.show_pass = false;
          }
        } else {
          this.show_d = true;
          this.show_pass = false;
        }
      }
    },
    // 取消电子签章弹窗
    show_pass_handleCancel() {
      this.actindex = -1;
      this.show_pass = false;
    },
    // 选择电子章
    pass_cell_click(v) {
      this.actindex = v;
    },
    // 修改节点
    Updatenext() {
      this.xz_type == 1
        ? (this.nextnode_show = true)
        : (this.trans_show = true);
    },
    // 取消下一个审批节点
    Cancelnext() {
      // 初始化
      this.nextnode_approved = [];
      this.nextnode_cc = [];
      // 审核方式
      this.appvisiradiovalue = 2;
      // 通知方式
      this.appcheckedList = [1, 4];
      // 初始化
      this.trans_approved = [];
      // 通知方式
      this.transcheckedList = [1, 4];
      // 上传文件
      this.trans_percent = [];
      this.xz_type = -1;
      this.show_nextnode = false;
      this.$store.state.is_s_x = 0;
      this.get_toexamine.status = 6;
    },
    // 取消下一个审批节点弹窗
    nextnode_show_handleCancel() {
      this.nextnode_show = false;
    },
    // 添加
    addapproved(v) {
      v == 3
        ? (this.tags = {
            tags: false,
            tab: true,
            pe: true,
            bm: true,
            radio: true,
          })
        : (this.tags = {
            tags: true,
            tab: true,
            pe: true,
            bm: true,
            radio: true,
          });
      this.people.type = v;
      this.appvisiradio = true;
      this.people.tagsrange.visual =
        v == 1
          ? this.JtoJ(this.nextnodes.a)
          : v == 2
          ? this.JtoJ(this.nextnodes.b)
          : this.JtoJ(this.trans.a);
      v == 1 || v == 2
        ? (this.nextnode_show = false)
        : (this.trans_show = false);
    },
    // 确认审批人
    handleOk() {
      if (this.people.type == 3 && this.people.tagsrange.visual.length > 1) {
        this.$message.warning("只能选择一个转审人");
        return;
      }
      this.appvisiradio = false;
      this.people.type == 1
        ? (this.nextnodes.a = this.JtoJ(this.people.tagsrange.visual))
        : this.people.type == 2
        ? (this.nextnodes.b = this.JtoJ(this.people.tagsrange.visual))
        : (this.trans.a = this.JtoJ(this.people.tagsrange.visual));
      this.people.type == 1 || this.people.type == 2
        ? (this.nextnode_show = true)
        : (this.trans_show = true);

      this.people.tagsrange.visual = [];
    },
    handleCancel() {
      this.appvisiradio = false;
      this.people.type == 1 || this.people.type == 2
        ? (this.nextnode_show = true)
        : (this.trans_show = true);
      this.people.tagsrange.visual = [];
    },
    // 删除审批人
    appitemClose(v, e) {
      if (v == 1) {
        for (let i in this.nextnodes.a) {
          if (this.nextnodes.a[i].value == e) {
            this.nextnodes.a.splice(i, 1);
            return true;
          }
        }
      } else if (v == 2) {
        for (let i in this.nextnodes.b) {
          if (this.nextnodes.b[i].value == e) {
            this.nextnodes.b.splice(i, 1);
            return true;
          }
        }
      } else {
        for (let i in this.trans.a) {
          if (this.trans.a[i].value == e) {
            this.trans.a.splice(i, 1);
            return true;
          }
        }
      }
    },
    // 打开转审/下一节点页面
    trans_open(a) {
      if (a == 2) {
        this.trans.a = this.JtoJ(this.trans_approved);
        this.trans.b = this.JtoJ(this.transcheckedList);
        this.trans.c = this.JtoJ(this.trans_percent);
        this.trans_show = true;
      } else {
        this.nextnodes.a = this.JtoJ(this.nextnode_approved);
        this.nextnodes.b = this.JtoJ(this.nextnode_cc);
        this.nextnodes.c = this.JtoJ(this.appvisiradiovalue);
        this.nextnodes.d = this.JtoJ(this.appcheckedList);
        this.nextnode_show = true;
      }
    },
    // 转审/下一节点 确认
    trans_show_handleOk(a) {
      if (a == 1) {
        if (this.nextnodes.a.length < 1) {
          this.$message.warning("请先选择审批人");
        } else {
          this.xz_type = a;
          this.nextnode_approved = this.JtoJ(this.nextnodes.a);
          this.nextnode_cc = this.JtoJ(this.nextnodes.b);
          this.appvisiradiovalue = this.JtoJ(this.nextnodes.c);
          this.appcheckedList = this.JtoJ(this.nextnodes.d);

          this.nextnode_show = false;
          this.show_nextnode = true;
          this.get_state.is_s_x = a;
          this.nodeText = "指定下一节点";
        }
      } else {
        if (this.trans.a.length < 1) {
          this.$message.warning("请先选择转审人");
        } else if (this.trans.a.length > 1) {
          this.$message.warning("只能选择一个转审人");
        } else {
          this.xz_type = a;
          this.trans_approved = this.JtoJ(this.trans.a);
          this.transcheckedList = this.JtoJ(this.trans.b);
          this.trans_percent = this.JtoJ(this.trans.c);
          this.trans_show = false;
          this.show_nextnode = true;
          this.get_state.is_s_x = a;
          this.nodeText = "转审审核人";
        }
      }
    },
    // 转审/下一节点 弹窗取消
    trans_show_handleCancel(a) {
      if (a == 1) {
        this.nextnode_show = false;
      } else {
        this.trans_show = false;
        this.get_toexamine.status = 6;
      }
      this.get_state.is_s_x = 0;
    },
    //获取转审需要的数据
    approval_my_shift_datas() {
      let where_id = this.get_toexamine.where_id;

      let user = this.trans_approved.map((v) => {
        return { userid: v.value, username: v.title, avatar: v.avatar };
      });

      let urgent_obj = this.get_leftdata.fields.urgent_level.child.find(
        (obj) => {
          return obj.id === this.get_leftdata.fields.urgent_level.value;
        }
      );
      let secret_obj = this.get_leftdata.fields.secret_level.child.find(
        (obj) => {
          return obj.id === this.get_leftdata.fields.secret_level.value;
        }
      );
      let document = {
        title: this.get_leftdata.fields.title.value,
        urgent: urgent_obj.name,
        secret: secret_obj.name,
        word_no: this.get_leftdata.fields.word_no.value,
        dept_id: this.get_leftdata.deptid,
      };
      let files = this.trans_percent.map((v) => {
        return {
          path: v.path,
          old_name: v.name,
          size: v.size,
        };
      });
      let handle = {
        explain: this.get_toexamine.explain,
        files,
        time: this.get_toexamine.time,
        way: this.transcheckedList,
        notice: this.get_toexamine.notice,
        process_urgent_level: this.get_toexamine.process_urgent_level,
      };
      this.get_state.is_s_x_data = {
        where_id,
        user: user[0],
        document,
        handle,
      };
    },
    //获取下个节点需要的数据
    next_approval_nodes() {
      //签章
      let process_signature = JSON.parse(
        JSON.stringify(this.get_state.use_zhang)
      );
      let signature_arr = [];
      process_signature.forEach((el) => {
        signature_arr.push({
          id:"",
          signature_base: el.signature_base,
          signature_img: el.signature_img,
          signature_id: el.signature_id,
          position: el.position,
        });
      });
      let process_signature_other = JSON.parse(
        JSON.stringify(this.get_state.other_zhang)
      );
      // signature_arr = [...signature_arr, ...process_signature_other];
      process_signature_other.forEach((el) => {
        signature_arr.push({
          id:el.id,
          signature_base: el.signature_base,
          signature_img: el.signature_img,
          signature_id: el.signature_id,
          position: el.position,
        });
      });
      signature_arr.sort(function (a, b) {
        return a.position.zindex - b.position.zindex;
      });
      signature_arr.forEach((el, index) => {
        el.position.zindex = index;
      });
      let approval_where = [];
      if (this.nextnode_approved.length != 0) {
        approval_where = [
          {
            // 前端type 2 个人 1部门 3发文收文单位，4标签，5角色，6最近选择 后端 3个人 1部门 2标签
            users: this.nextnode_approved.map((x) => {
              let id = x.value;
              let flag = null;
              switch (x.type) {
                //部门
                case 1:
                  flag = 1;
                  break;
                //人
                case 2:
                  flag = 3;
                  break;
                //标签
                case 4:
                  flag = 2;
                  break;
                //角色
                case 5:
                  flag = 3;
                  break;
                //发文收文单位
                case 3:
                  flag = 5;
                  break;
                //最近选择
                case 6:
                  flag = 4;
                  break;
              }
              return { id, flag };
            }),
            approver_type: this.appvisiradiovalue,
            id: this.get_toexamine.where_id,
          },
        ];
      }
      let approval_copy = [];
      if (this.nextnode_cc.length != 0) {
        approval_copy = [
          {
            users: this.nextnode_cc.map((x) => {
              let id = x.value;
              let flag = null;
              switch (x.type) {
                //部门
                case 1:
                  flag = 1;
                  break;
                //人
                case 2:
                  flag = 4;
                  break;
                //标签
                case 4:
                  flag = 2;
                  break;
                //角色
                case 5:
                  flag = 3;
                  break;
                //发文收文单位
                case 3:
                  flag = 5;
                  break;
                //最近选择
                case 6:
                  flag = 4;
                  break;
              }
              return { id, flag };
            }),
          },
        ];
      }
      let document_arr = {
        title: this.get_leftdata.fields.title.value,
        secret_level: this.get_leftdata.fields.secret_level.value,
        urgent_level: this.get_leftdata.fields.urgent_level.value,
        main_delivery: this.get_leftdata.fields.main_delivery.value,
        copy_users: this.get_leftdata.fields.copy_users.value,
        reviewer: this.get_leftdata.fields.reviewer.value,
        issuer: this.get_leftdata.fields.issuer.value,
      };
      for (let key in this.get_leftdata.fields) {
        if (
          this.get_leftdata.fields[key]?.value?.text &&
          typeof this.get_leftdata.fields[key]?.value?.text == "object"
        ) {
          this.get_leftdata.fields[key].value.text = this.get_leftdata.fields[
            key
          ].value.text.join(",");
        }
        document_arr[key] = this.get_leftdata.fields[key].value || "";
      }
      document_arr.word_no = this.get_leftdata.word_no.id;
      this.get_state.is_s_x_data = {
        content: this.get_leftdata.content,
        status: this.get_toexamine.status,
        button: 1,
        handles: this.get_toexamine,
        deptid: this.get_leftdata.deptid,
        process_id: this.get_leftdata.process_id,
        approval_where,
        approval_copy,
        document_arr,
        enclosure_file: this.get_leftdata.enclosure,
        red_templete_id: this.get_leftdata.templete_id,
        id: this.get_leftdata.id,
        signature: signature_arr,
        word_no: this.get_leftdata.word_no,
      };
    },
    // 通知方式
    wayschange(e) {
      this.get_toexamine.way = this.ways.join(",");
    },
    change_toexamine() {
      if (this.get_toexamine.status == 11) {
        this.trans_open(2);
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-modal {
  width: 700px !important;
}
//接受审批
.accept {
  .urgency,
  .opinion,
  .notification-method {
    margin-top: 30px;
    .r-content {
      .ant-radio-group {
        width: 100%;
        display: flex;
      }
      .ant-radio-wrapper {
        flex: 1;
      }
      .r-textarea {
        margin-top: 15px;
        border: 1px solid #dcdfe6;
        border-bottom: none;
        position: relative;
        .textarea-btn {
          flex: 1;
          text-align: center;
          height: 36px;
          line-height: 36px;
          background-color: #eff8ff;
          color: #4aaeff;
        }
        .one {
          border-top: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
        }
        .two {
          border: 1px solid #dcdfe6;
          border-right: none;
        }
        textarea {
          width: 100%;
          height: 140px;
          resize: none;
          border: none;
          box-shadow: none;
        }
      }
      .r-node {
        .r-node-top {
          padding: 12px 0;
          display: flex;
          flex-direction: row-reverse;
          line-height: 1em;
          .active_s {
            color: #0082ef;
          }
          .active_t {
            color: #dcdfe6;
          }
          .strial {
            border-right: 1px solid #dcdfe6;
            padding-right: 12px;
            margin-right: 12px;
          }
          .trial {
            position: relative;
            font-size: 1em;
            .trial_show {
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
            }
          }
        }
        .r-node-bottom {
          padding: 12px 16px;
          background-color: #f9fcff;
          .r-node-bottom-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .r-node-bottom-bottom-s {
            display: flex;
            flex-wrap: wrap;
            .r-node-bottom-bottom {
              margin: 16px 8px 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              img {
                width: 32px;
                border-radius: 3px;
              }
            }
          }
        }
      }
      .content-active {
        font-weight: 500;
        padding: 5px 20px;
        font-size: 16px;
      }
    }
    .file-list {
      max-height: 200px;
      overflow-y: auto;
      margin-top: 20px;
      .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 36px;
        background: rgba(251, 251, 251, 1);
        margin-bottom: 15px;
        padding: 10px;
        transition: all 0.3s;
        &:hover {
          background: rgba(240, 242, 245, 1);
        }
        div {
          display: flex;
          height: 100%;
          align-items: center;
        }
        i {
          display: block;
        }
        .file-item-left {
          display: flex;

          span {
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 8px;
          }
        }
        .file-item-right {
          .delete {
            cursor: pointer;
            width: 11px;
            height: 16px;
            background: url("../../../../../assets/addpostset/delete.png")
              no-repeat center;
            background-size: 11px 16px;
          }
          .eye {
            cursor: pointer;
            width: 16px;
            height: 11px;
            background: url("../../../../../assets/addpostset/eye.png")
              no-repeat center;
            background-size: 16px 11px;
            margin-right: 20px;
          }
        }
      }
    }
    .uploading {
      margin-top: 20px;
      .up-title {
        display: flex;
        justify-content: space-between;
        span {
          font-size: 14px;
          &:last-child {
            color: #0082efff;
          }
        }
      }
      .speed {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        /deep/.ant-progress-line {
          width: 190px;
        }
        /deep/ .ant-progress-inner {
          background: #dcf3d6ff;
        }
        /deep/.ant-progress-text {
          color: #303133ff;
        }
        span {
          cursor: pointer;
          margin-right: 35px;
        }
      }
    }
    .add-upload {
      /deep/ .ant-upload {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        background: white;
        .anticon {
          margin-right: 10px;
          color: #c0c6ccff;
        }
      }
    }
    .two_s {
      padding-bottom: 20px;
    }
  }
  .opinion-file {
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 20px;
  }
  .urgency {
    .ant-radio-button-wrapper {
      width: 62px;
      height: 30px;
      margin-right: 30px;
      background: rgba(236, 236, 236, 1);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
      border-radius: 0;
      border: none;
    }
    .active1 {
      background: rgba(98, 194, 50, 1);
      color: white;
      box-shadow: none;
    }
    .active2 {
      background: #f5ac40;
      color: white;
      box-shadow: none;
    }
    .active3 {
      background: #f56c6c;
      color: white;
      box-shadow: none;
    }
  }

  // 更多
  .more {
    cursor: pointer;
    margin: 20px 0;
    font-size: 12px;
    color: #606266;
    .title2 {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: center;
      color: #b4bcccff;
      padding-left: 0;
    }
  }

  .more-content {
    transition: all 0.3s;
  }
  // 通知选项
  .notification-option {
    .r-content {
      p {
        line-height: 2.5;
        /deep/.ant-input {
          color: #0082ef;
        }
      }
    }
    .ant-input {
      width: 24px;
      height: 24px;
      color: #c0c4ccff;
      padding: 0;
      text-align: center;
      margin: 0 10px;
    }
  }
  //处理人
  .submitter {
    .r-content {
      display: flex;
      align-items: center;
    }
  }
  // 上下处理节点
  .switch {
    .r-content {
      .before {
        margin-bottom: 20px;
      }
      p {
        display: flex;
        align-items: center;
        span {
          cursor: pointer;
          margin: 0 10px;
          &:first-child {
            margin-left: 0;
          }
        }
      }

      .sec-title {
        color: #909399ff;
      }
    }
  }

  //通知方式
  .notification-method {
    .r-content {
      border: none;
    }
  }

  .title {
    line-height: 16px;
    padding-left: 10px;
    border-left: 3px solid #0082ef;
    font-size: 16px;
    color: #303133;
  }
  .switch {
    .r-content {
      max-height: 400px;
      overflow-y: scroll;
    }
  }
  .r-content {
    margin: 20px auto;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(228, 231, 237, 1);
    box-sizing: border-box;
    .r-content-pre {
      margin: 0 10px;
    }
    .head-img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      background-color: coral;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      margin-left: 10px;
      .name-text {
        margin-left: 10px;
        color: #909399;
      }
    }
  }
}
.gray {
  color: #b4bcccff;
}
.bianji {
  width: 15px;
  height: 15px;
  background: url("../../../../../assets/adddraft/bianji.png");
  background-size: 15px 15px;
}
.mb {
  margin-bottom: 10px;
}
.file_preview {
  /deep/.ant-modal-body {
    overflow-y: scroll;
  }
  /deep/ .ant-modal-content {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 680px;
    height: 600px;
  }
}
/deep/.show_pass {
  .ant-modal-content {
    width: 725px;
    .ant-modal-body {
      padding: 0;

      .show_pass_content_top {
        position: relative;
        .ant-tabs-bar,
        .ant-tabs-top-bar {
          margin: 0;
        }
        .show_pass_content_rt {
          color: #0082ef;
          position: absolute;
          right: 20px;
          top: 12px;
        }
      }
      .show_pass_content_content {
        padding: 20px 15px;
        .show_pass_content_content_top {
          margin: 0 15px;
          .ant-input {
            margin-left: 10px;
          }
        }
        .show_pass_content_content_two {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          max-height: 400px;
          margin: 10px 0;
          overflow-y: scroll;
          .pass_cell {
            margin: 10px 15px;
            width: 200px;
            height: 192px;
            position: relative;
            .pass_cell_img {
              width: 100%;
              height: 150px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                height: 80%;
              }
            }
            .pass_cell_text {
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 16px;
            }
            .pass_cell_show {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              border: 1px solid #41aaff;
              .pass_cell_show_top {
                width: 44px;
                height: 44px;
                position: absolute;
                top: 0;
                right: 0;
                border-top: 44px solid #41aaff;
                border-left: 44px solid transparent;
                .pass_cell_show_top_s {
                  color: white;
                  position: absolute;
                  top: -44px;
                  right: 4px;
                }
              }
            }
          }
        }
        .Page {
          padding-bottom: 0;
        }
      }
    }
  }
}
/deep/.show_s {
  .ant-modal-footer {
    display: none;
  }
  .ant-modal-body {
    padding: 10px 20px;
  }
  .show_s_content {
    max-height: 280px;
    overflow: auto;
    .show_s_content-list {
      height: 48px;
      border-bottom: 1px solid #f6f7f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      .show_s_content-left {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .show_s_content-right {
        text-align: right;
        margin-left: 20px;
        width: 16px;
        color: #b7b7b7;
      }
      &:hover {
        background-color: #f6f7f9;
      }
    }
  }
  .show_s_content_addbtn {
    color: #0082ef;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
/deep/.show_st {
  .ant-modal-body {
    padding: 16px 20px;
  }
  .show_st_content_title {
    padding: 8px 0 15px 0;
  }
  textarea {
    width: 100%;
    height: 120px;
    resize: none;
  }
}
/deep/.nextnode_show {
  .file-list {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      background: rgba(251, 251, 251, 1);
      margin-bottom: 15px;
      padding: 10px;
      transition: all 0.3s;
      &:hover {
        background: rgba(240, 242, 245, 1);
      }
      div {
        display: flex;
        height: 100%;
        align-items: center;
      }
      i {
        display: block;
      }
      .file-item-left {
        i {
          width: 14px;
          height: 16px;
          background: url("../../../../../assets/addpostset/document.png")
            no-repeat center;
          background-size: 19px 16px;
        }
        span {
          margin-left: 8px;
        }
      }
      .file-item-right {
        .delete {
          cursor: pointer;
          width: 11px;
          height: 16px;
          background: url("../../../../../assets/addpostset/delete.png")
            no-repeat center;
          background-size: 11px 16px;
        }
        .eye {
          cursor: pointer;
          width: 16px;
          height: 11px;
          background: url("../../../../../assets/addpostset/eye.png") no-repeat
            center;
          background-size: 16px 11px;
          margin-right: 20px;
        }
      }
    }
  }
  .uploading {
    margin-top: 20px;
    .up-title {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 14px;
        &:last-child {
          color: #0082efff;
        }
      }
    }
    .speed {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      /deep/.ant-progress-line {
        width: 190px;
      }
      /deep/ .ant-progress-inner {
        background: #dcf3d6ff;
      }
      /deep/.ant-progress-text {
        color: #303133ff;
      }
      span {
        cursor: pointer;
        margin-right: 35px;
      }
    }
  }
  .add-upload {
    /deep/ .ant-upload {
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      background: #f9f9f9;
      .anticon {
        margin-right: 10px;
        color: #c0c6ccff;
      }
    }
  }
  .ant-modal-body {
    padding: 0;
  }
  .nextnode_show_box {
    padding: 24px 40px;
    .items {
      display: flex;
      flex-wrap: wrap;
      .item {
        margin-top: 15px;
        margin-right: 20px;
        max-width: 80px;
        margin-bottom: 15px;
        .item-top {
          width: 50px;
          height: 50px;
          background: rgba(240, 242, 245);
          border-radius: 2px;
          margin: 0 auto;
          position: relative;
          .item-top-img {
            height: 100%;
            width: 100%;
            border-radius: 2px;
          }
        }
        .item-bottom {
          margin-top: 5px;
          text-align: center;
          font-size: 14px;
          line-height: 20px;
        }
        .item-close {
          border-radius: 50%;
          // background: crimson;
          position: absolute;
          top: -6px;
          right: -6px;
          z-index: 10;
          cursor: pointer;
        }
      }
    }
    .labeladd {
      margin-top: 15px;
      margin-right: 20px;
      margin-bottom: 15px;
      width: 50px;
      height: 50px;
      background-color: #fafafa;
    }
  }
}
.box-textnum {
  position: absolute;
  bottom: 40px;
  right: 10px;
  color: #c0c6cc;
}
.view-file-box {
  height: 400px;
  overflow: auto;
}
</style>