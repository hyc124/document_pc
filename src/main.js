import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./css/pulic.css";
import "ant-design-vue/dist/antd.css";
import Print from "@/plugs/print.js"; //引入打印插件
import E from "wangeditor"; // 引入副文本编辑器
import "@/icons";
// 文本对比插件引入
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/merge/merge.css";
import DiffMatchPatch from "diff-match-patch";
// 兼容es6语法
import "babel-polyfill";

//html转pdf
import htmlToPdf from "@/js/use_pdf";
Vue.use(htmlToPdf);
// 加水印
import watermark from "@/js/watermark.js";
Vue.prototype.$watermark = watermark;

// // 百度富文本框
// import VueUeditorWrap from 'vue-ueditor-wrap'
// // 全局注册组件
// Vue.component('vue-ueditor-wrap', VueUeditorWrap)

window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;

import {
    Button,
    Menu,
    Icon,
    Input,
    Table,
    Pagination,
    Modal,
    FormModel,
    Select,
    DatePicker,
    Switch,
    Checkbox,
    Radio,
    Upload,
    Divider,
    Tabs,
    Progress,
    Tag,
    Dropdown,
    Descriptions,
    Timeline,
    Collapse,
    Tree,
    Tooltip,
    Spin,
    Alert,
    Carousel,
    ConfigProvider,
    Affix,
    BackTop,
    List
} from "ant-design-vue";

// echarts图标引入
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
// 挂载副文本编辑器
Vue.prototype.$E = E;

// 对比函数挂载vue原型上
Vue.prototype.$CodeMirror = CodeMirror;

// 注册打印插件
Vue.use(Print);

// 引入axios请求文件
Vue.prototype.$http = axios;

// 配置中间件代理文件
const baseURL = process.env.NODE_ENV === "production" ? "" : "/api";
Vue.prototype.$http.defaults.baseURL = baseURL;

//中介传值
const $bus = new Vue();
Vue.prototype.$bus = $bus;

Vue.config.productionTip = false;
// 按需加载ui库组件
Vue.use(Input)
    .use(Table)
    .use(Pagination)
    .use(Modal)
    .use(FormModel)
    .use(DatePicker)
    .use(Switch)
    .use(Checkbox)
    .use(Radio)
    .use(Upload)
    .use(Select)
    .use(Divider)
    .use(Progress)
    .use(Tabs)
    .use(Tag)
    .use(Dropdown)
    .use(Descriptions)
    .use(Timeline)
    .use(Collapse)
    .use(Tree)
    .use(Spin)
    .use(Icon)
    .use(Menu)
    .use(Button)
    .use(Tooltip)
    .use(Alert)
    .use(Carousel)
    .use(ConfigProvider)
    .use(Affix)
    .use(BackTop)
    .use(List);

// 对话框引入
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$error = Modal.error;
Vue.prototype.$success = Modal.success;
// 复制到粘贴板
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
//注入全局属性$message弹窗通知
import { message } from "ant-design-vue";
Vue.prototype.$message = message;
message.config({
    duration: 1, // 持续时间
    top: `150px`, // 到页面顶部距离
    maxCount: 1, // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
