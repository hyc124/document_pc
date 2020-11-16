import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import companypath from '@/views/applicationset/parameterset/company/router'
import postcrimson from "@/views/applicationset/postset/postcrimsonset/router"; // 套红模板设置跳转路由页面
import signoffcrimson from "@/views/applicationset/signoff/signoffcrimsonset/router"; // 套红模板设置跳转路由页面
import getcrimson from "@/views/applicationset/getset/getcrimsonset/router"; // 套红模板设置跳转路由页面
import postflowpath from "@/views/applicationset/postset/postflowpathset/router"; // 流程模板跳转路由页面
import signoffflowpath from "@/views/applicationset/signoff/signoffflowpathset/router"; // 流程模板跳转路由页面
import getflowpath from "@/views/applicationset/getset/getflowpathset/router"; // 流程模板跳转路由页面
import addformwork from "@/views/applicationset/postset/postformworkset/router"; // 发文模板设置跳转路由页面
import addgetformworkset from "@/views/applicationset/getset/getformworkset/router"; // 收文模板设置跳转路由页面
import signoaddformwork from "@/views/applicationset/signoff/signoffformworkset/router"; // 收文模板设置跳转路由页面
import addDraft from "@/views/sendout/draft/router/router.js"; // 发文模板设置跳转路由页面
import adddistribute from "@/views/webservice/distribute/router/router.js"; // 发文模板设置跳转路由页面
import postadd from "@/views/applicationset/postset/postruleset/router"; //发文编号跳转路由页面
import signoffadd from "@/views/applicationset/signoff/signoffruleset/router"; //发文编号跳转路由页面
import getruleset from "@/views/applicationset/getset/getruleset/router";
import addlication from "@/views/systemset/inapplicationset/router";
import getpostaddsee from "@/views/applicationset/getset/getflowpathset/router";
import acceptadd from "@/views/webservice/accept/router"; // 公文分发 查看分发文件跳转路由页面
import seefile from "@/views/documentarea/router"; // 公文分发 查看分发文件跳转路由页面
import insystemsetShort from "@/views/systemset/insystemset/router"; // 系统管理 跳转短信验证和邮箱验证
// import examine from "@/views/sendout/pending/router"; // 跳转发文审核详情
import roleEditing from "@/views/systemset/roleset/roleEditing/router"; //角色权限编辑
import incoming from "@/views/home/components/incoming/router"; // 跳转收文审核详情
import documentarea_incoming from "@/views/documentarea/components/incoming/router"; // 跳转收文审核详情
import allsignature from "@/views/applicationset/signatureset/allsignature/router"
const layout = () => import("@/views/layout/layout.vue"); //全局布局文件
// const footLink = () => import("@/views/footLink/footLink.vue"); //跳转链接
const login = () => import("@/views/register/Login.vue"); //登录链接
const publicPage = () => import("@/views/publicPage/publicPage.vue") // 公共页面
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "/",
    component: layout,
    meta: {
      name: "首页",
    },
    redirect: "home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/home.vue"),
        meta: {
          title: "",
          name: "公文管理系统",
          is_ci: false, // 是否加载到列表二级菜单，true为开启
          listswitch: true, // 关闭左边菜单栏，true为关闭
          num: 0,
        },
      },
      {
        path: "/messagecenter",
        name: "messagecenter",
        component: () =>
          import("@/views/home/components/messageCenter/messageCenter.vue"),
        meta: {
          title: "消息中心",
          name: "消息中心",
          is_ci: false, // 是否加载到列表二级菜单，true为开启
          listswitch: true, // 关闭左边菜单栏，true为关闭
          num: 0,
        },
      },
      {
        path: "/launchdocument",
        name: "launchdocument",
        component: () =>
          import("@/views/home/components/launchDocument/launchDocument.vue"),
        meta: {
          title: "发起的公文",
          name: "发起的公文",
          is_ci: false, // 是否加载到列表二级菜单，true为开启
          listswitch: true, // 关闭左边菜单栏，true为关闭
          num: 0,
        },
      },
      {
        path: "/waitDocument",
        name: "waitDocument",
        component: () =>
          import("@/views/home/components/waitDocument/waitDocument.vue"),
        meta: {
          title: "待处理的公文",
          name: "待处理的公文",
          is_ci: false, // 是否加载到列表二级菜单，true为开启
          listswitch: true, // 关闭左边菜单栏，true为关闭
          num: 0,
        },
      },
      ...incoming,
    ],
  },
  {
    path: "/sendout",
    name: "sendout",
    component: layout,
    meta: {
      name: "发文管理",
    },
    children: [
      {
        path: "/draft",
        name: "draft",
        component: () => import("@/views/sendout/draft/draft.vue"),
        meta: {
          title: "",
          name: "发文拟稿",
          is_ci: true,
          num: 1,
          code: 'post_is'
        },
      },
      {
        path: "/pending",
        name: "pending",
        component: () => import("@/views/sendout/pending/pending.vue"),
        meta: {
          title: "",
          name: "待审发文",
          is_ci: true,
          num: 1,
          code: 'yes'
        },
      },
      {
        path: "/library",
        name: "library",
        component: () => import("@/views/sendout/library/library.vue"),
        meta: {
          title: "",
          name: "发文库",
          is_ci: true,
          num: 1,
          code: 'post_see'
        },
      },
      ...addDraft,
      ...seefile,
    ],
  },
  {
    path: "/getmanage",
    name: "getmanage",
    component: layout,
    meta: {
      name: "收文管理",
    },
    children: [
      {
        path: "/ingetdraft",
        name: "ingetdraft",
        component: () => import("@/views/getmanage/ingetdraft/ingetdraft.vue"),
        meta: {
          title: "",
          name: "收文登记",
          is_ci: true,
          num: 2,
          code: 'get_is'
        },
      },
      {
        path: "/pendingtrial",
        name: "pendingtrial",
        component: () =>
          import("@/views/getmanage/pendingtrial/pendingtrial.vue"),
        meta: {
          title: "",
          name: "待审收文",
          is_ci: true,
          num: 2,
          code: 'yes'
        },
      },
      {
        path: "/getlibrary",
        name: "getlibrary",
        component: () => import("@/views/getmanage/getlibrary/getlibrary.vue"),
        meta: {
          title: "",
          name: "收文库",
          is_ci: true,
          num: 2,
          code: 'get_see'
        },
      }
    ],
  },
  {
    path: "/sign",
    name: "sign",
    component: layout,
    meta: {
      name: "签报管理",
    },
    children: [
      {
        path: "/signeddraft",
        name: "signeddraft",
        component: () => import("@/views/sign/signedDraft/signedDraft.vue"),
        meta: {
          title: "",
          name: "签报拟稿",
          is_ci: true,
          num: 3,
          code: 'sign_is'
        },
      },
      {
        path: "/signwait",
        name: "signwait",
        component: () => import("@/views/sign/signWait/signWait.vue"),
        meta: {
          title: "",
          name: "待审签报",
          is_ci: true,
          num: 3,
          code: 'yes'
        },
      },
      {
        path: "/signlibrary",
        name: "signlibrary",
        component: () => import("@/views/sign/signLibrary/signLibrary.vue"),
        meta: {
          title: "",
          name: "签报库",
          is_ci: true,
          num: 3,
          code: 'sign_see'
        },
      },
    ],
  },
  {
    path: "/webservice",
    name: "webservice",
    component: layout,
    meta: {
      name: "公文交换",
    },
    children: [
      {
        path: "/distribute",
        name: "distribute",
        component: () => import("@/views/webservice/distribute/distribute.vue"),
        meta: {
          title: "",
          name: "公文发送",
          is_ci: true,
          num: 4,
          code: 'document_send_left'
        },
      },
      {
        path: "/accept",
        name: "accept",
        component: () => import("@/views/webservice/accept/accept.vue"),
        meta: {
          title: "",
          name: "公文接收",
          is_ci: true,
          num: 4,
          code: 'document_receive_left'
        },
      },
      ...acceptadd,
      ...adddistribute,
    ],
  },
  {
    path: "/documentarea",
    name: "documentarea",
    component: layout,
    meta: {
      name: "文件管理区",
    },
    redirect: "filingbox",
    children: [
      {
        path: "/filingbox",
        name: "filingbox",
        component: () => import("@/views/documentarea/filingbox/filingbox.vue"),
        meta: {
          title: "",
          name: "归档箱",
          is_ci: true,
          num: 5,
          code: 'yes'
        },
      },
      {
        path: "/wastetank",
        name: "wastetank",
        component: () => import("@/views/documentarea/wastetank/wastetank.vue"),
        meta: {
          title: "",
          name: "废弃箱",
          is_ci: true,
          num: 5,
          code: 'yes'
        },
      },
      {
        path: "/circulation",
        name: "circulation",
        component: () =>
          import("@/views/documentarea/circulation/circulation.vue"),
        meta: {
          title: "",
          name: "传阅文件",
          is_ci: true,
          num: 5,
          code: 'yes'
        },
      },
      {
        path: "/ccfile",
        name: "ccfile",
        component: () => import("@/views/documentarea/ccfile/ccfile.vue"),
        meta: {
          title: "",
          name: "抄送文件",
          is_ci: true,
          num: 5,
          code: 'yes'
        },
      },
      ...seefile,
      ...documentarea_incoming,
    ],
  },
  {
    path: "/applicationSet",
    name: "applicationSet",
    component: layout,
    meta: {
      name: "公文设置",
      onOff:true
    },
    children: [
      {
        path: "/secrecy",
        name: "secrecy",
        component: () =>
          import("@/views/applicationset/parameterset/secrecy/secrecy.vue"),
        meta: {
          title: "参数设置",
          name: "密级程度设置",
          is_ci: true,
          num: 6,
          code: 'set_params'
        },
      },
      {
        path: "/urgent",
        name: "urgent",
        component: () =>
          import("@/views/applicationset/parameterset/urgent/urgent.vue"),
        meta: {
          title: "参数设置",
          name: "紧急程度设置",
          is_ci: true,
          num: 6,
          code: 'set_params'
        },
      },
      {
        path: "/company",
        name: "company",
        component: () =>
          import("@/views/applicationset/parameterset/company/company.vue"),
        meta: {
          title: "参数设置",
          name: "收发文单位设置",
          is_ci: true,
          num: 6,
          code: 'set_params'
        },
      },
      {
        path: "/postclassifyset",
        name: "postclassifyset",
        component: () =>
          import(
            "@/views/applicationset/postset/postclassifyset/postclassifyset.vue"
          ),
        meta: {
          title: "发文设置",
          name: "发文分类设置",
          is_ci: true,
          num: 6,
          code: 'set_post'
        },
      },
      {
        path: "/postformworkset",
        name: "postformworkset",
        component: () =>
          import(
            "@/views/applicationset/postset/postformworkset/postformworkset.vue"
          ),
        meta: {
          title: "发文设置",
          name: "发文模板设置",
          is_ci: true,
          num: 6,
          code: 'set_post'
        },
      },
      {
        path: "/postruleset",
        name: "postruleset",
        component: () =>
          import("@/views/applicationset/postset/postruleset/postruleset.vue"),
        meta: {
          title: "发文设置",
          name: "发文编号规则设置",
          is_ci: true,
          num: 6,
          code: 'set_post'
        },
      },

      {
        path: "/postcrimsonset",
        name: "postcrimsonset",
        component: () =>
          import(
            "@/views/applicationset/postset/postcrimsonset/postcrimsonset.vue"
          ),
        meta: {
          title: "发文设置",
          name: "套红模板设置",
          is_ci: true,
          num: 6,
          code: 'set_post'
        },
      },
      {
        path: "/postflowpathset",
        name: "postflowpathset",
        component: () =>
          import(
            "@/views/applicationset/postset/postflowpathset/postflowpathset.vue"
          ),
        meta: {
          title: "发文设置",
          name: "发文流程设置",
          is_ci: true,
          num: 6,
          code: 'set_post'
        },
      },
      {
        path: "/getclassifyset",
        name: "getclassifyset",
        component: () =>
          import(
            "@/views/applicationset/getset/getclassifyset/getclassifyset.vue"
          ),
        meta: {
          title: "收文设置",
          name: "收文分类设置",
          is_ci: true,
          num: 6,
          code: 'set_get'
        },
      },
      {
        path: "/getformworkset",
        name: "getformworkset",
        component: () =>
          import(
            "@/views/applicationset/getset/getformworkset/getformworkset.vue"
          ),
        meta: {
          title: "收文设置",
          name: "收文模板设置",
          is_ci: true,
          num: 6,
          code: 'set_get'
        },
      },
      {
        path: "/getruleset",
        name: "getruleset",
        component: () =>
          import("@/views/applicationset/getset/getruleset/getruleset.vue"),
        meta: {
          title: "收文设置",
          name: "收文编号规则设置",
          is_ci: true,
          num: 6,
          code: 'set_get'
        },
      },
      {
        path: "/getcrimsonset",
        name: "getcrimsonset",
        component: () =>
          import(
            "@/views/applicationset/getset/getcrimsonset/getcrimsonset.vue"
          ),
        meta: {
          title: "收文设置",
          name: "套红模板设置",
          is_ci: true,
          num: 6,
          code: 'set_get'
        },
      },
      {
        path: "/getflowpathset",
        name: "getflowpathset",
        component: () =>
          import(
            "@/views/applicationset/getset/getflowpathset/getflowpathset.vue"
          ),
        meta: {
          title: "收文设置",
          name: "收文流程设置",
          is_ci: true,
          num: 6,
          code: 'set_get'
        },
      },
      // ======================================================================
      {
        path: "/signoffclassifyset",
        name: "signoffclassifyset",
        component: () =>
          import(
            "@/views/applicationset/signoff/signoffclassifyset/signoffclassifyset.vue"
          ),
        meta: {
          title: "签报设置",
          name: "签报分类设置",
          is_ci: true,
          num: 6,
          code: 'set_sign'
        },
      },
      {
        path: "/signoffformworkset",
        name: "signoffformworkset",
        component: () =>
          import(
            "@/views/applicationset/signoff/signoffformworkset/signoffformworkset.vue"
          ),
        meta: {
          title: "签报设置",
          name: "签报模板设置",
          is_ci: true,
          num: 6,
          code: 'set_sign'
        },
      },
      {
        path: "/signoffruleset",
        name: "signoffruleset",
        component: () =>
          import(
            "@/views/applicationset/signoff/signoffruleset/signoffruleset.vue"
          ),
        meta: {
          title: "签报设置",
          name: "签报编号规则设置",
          is_ci: true,
          num: 6,
          code: 'set_sign'
        },
      },
      {
        path: "/signoffcrimsonset",
        name: "signoffcrimsonset",
        component: () =>
          import(
            "@/views/applicationset/signoff/signoffcrimsonset/signoffcrimsonset.vue"
          ),
        meta: {
          title: "签报设置",
          name: "套红模板设置",
          is_ci: true,
          num: 6,
          code: 'set_sign'
        },
      },
      {
        path: "/signoffflowpathset",
        name: "signoffflowpathset",
        component: () =>
          import(
            "@/views/applicationset/signoff/signoffflowpathset/signofflowpathset.vue"
          ),
        meta: {
          title: "签报设置",
          name: "签报流程设置",
          is_ci: true,
          num: 6,
          code: 'set_sign'
        },
      },
      {
        path: "/allsignature",
        name: "allsignature",
        component: () =>
          import(
            "@/views/applicationset/signatureset/allsignature/allsignature.vue"
          ),
        meta: {
          title: "签章设置",
          name: "所有签章",
          is_ci: true,
          num: 6,
          code: 'yes'
        },
      },
      {
        path: "/authorization",
        name: "authorization",
        component: () =>
          import(
            "@/views/applicationset/signatureset/authorization/authorization.vue"
          ),
        meta: {
          title: "签章设置",
          name: "我创建的",
          is_ci: true,
          num: 6,
          code: 'yes'
        },
      },
      {
        path: "/myestablish",
        name: "myestablish",
        component: () =>
          import(
            "@/views/applicationset/signatureset/myestablish/myestablish.vue"
          ),
        meta: {
          title: "签章设置",
          name: "授权给我的",
          is_ci: true,
          num: 6,
          code: 'yes'
        },
      },
      ...postcrimson,
      ...postadd,
      ...addformwork,
      ...postflowpath,
      ...getflowpath,
      ...getcrimson,
      ...getruleset,
      ...getpostaddsee,
      ...addgetformworkset,
      ...signoffcrimson,
      ...signoffflowpath,
      ...signoaddformwork,
      ...signoffadd,
      ...allsignature,
      ...companypath
    ],
  },
  {
    path: "/systemset",
    name: "systemset",
    component: layout,
    meta: {
      name: "系统管理",
    },
    children: [
      {
        path: "/roleset",
        name: "roleset",
        component: () => import("@/views/systemset/roleset/roleset.vue"),
        meta: {
          title: "",
          name: "角色管理",
          is_ci: true,
          num: 7,
          code: 'system_role_left'
        },
      },
      {
        path: "/smsset",
        name: "smsset",
        component: () =>
          import("@/views/systemset/sms"),
        meta: {
          title: "",
          name: "短信设置",
          is_ci: true,
          num: 7,
          code: 'system_sys_left'
        },
      },
      {
        path: "/emailset",
        name: "emailset",
        component: () =>
          import("@/views/systemset/email"),
        meta: {
          title: "",
          name: "邮箱设置",
          is_ci: true,
          num: 7,
          code: 'system_email_left'
        },
      },
      {
        path: "/insystemset",
        name: "insystemset",
        component: () =>
          import("@/views/systemset/insystemset/insystemset.vue"),
        meta: {
          title: "安全相关",
          name: "水印",
          is_ci: true,
          num: 7,
          code: 'system_setting_left'
        },
      },
      {
        path: "/logoinjournal",
        name: "logoinjournal",
        component: () =>
          import("@/views/systemset/logoinjournal/logoinjournal.vue"),
        meta: {
          title: "安全相关",
          name: "登录日志",
          is_ci: true,
          num: 7,
          code: 'system_login_log_left'
        },
      },
      {
        path: "/operationjournal",
        name: "operationjournal",
        component: () =>
          import("@/views/systemset/operationjournal/operationjournal.vue"),
        meta: {
          title: "安全相关",
          name: "操作日志",
          is_ci: true,
          num: 7,
          code: 'system_operation_log_left'
        },
      },
      ...addlication,
      ...roleEditing,
      ...insystemsetShort,
    ],
  },
  {
    path: "/organizational",
    name: "organizational",
    component: layout,
    meta: {
      name: "组织架构",
    },
    redirect: "organizational",
    children: [
      {
        path: "/organizational",
        name: "organizational",
        component: () => import("@/views/organizational/organizational.vue"),
        meta: {
          title: "",
          name: "组织架构",
          is_ci: true, // 是否加载到列表二级菜单，true为开启
          listswitch: true, // 关闭左边菜单栏，true为关闭
          num: 8,
        },
      },
    ],
  },
  {
    path: "/footLink",
    name: "footLink",
    component: () => import("@/views/footLink/relationMy/relationMy.vue"),
    meta: {
      name: "",
    },
    // redirect: "relationMy",
    // children: [
    //   {
    //     path: "/relationMy",
    //     name: "relationMy",
    //     component: () => import("@/views/footLink/relationMy/relationMy.vue"),
    //     meta: {
    //       title: "",
    //       name: "联系我们",
    //       is_ci: true, // 是否加载到列表二级菜单，true为开启
    //       listswitch: true, // 关闭左边菜单栏，true为关闭
    //       num: 8
    //     },
    //   },
    // ],
  },
  {
    path: "/logintransfer",
    name: "logintransfer",
    component: () =>
      import("@/views/components/loginTransfer/logintransfer.vue"),
    meta: {
      name: "",
    },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {
      name: "",
    }
  },
  {
    path: "/operations",
    name: "operations",
    component: publicPage,
  },
];
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
