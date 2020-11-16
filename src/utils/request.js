import axios from "axios";
import { message, Pagination } from "ant-design-vue";
import router from "../router";
import store from "../store";
// 判断开发模式还是生产模式，决定服务器使用什么
// const Url = 'http://lotus.mgtx-tech-dev.mgtx.com.cn'
const Url = process.env.NODE_ENV === 'development' ? 'http://lotus.mgtx-tech-dev.mgtx.com.cn' : window.location.protocol + "//" + window.location.host
// const Url = "http://192.168.8.27"; // 韩杰的本地服务器
// const Url = "http://192.168.8.141"; // 张同明的本地服务器

const server = axios.create({
    baseURL: Url,
});
// 倒计时开关
let onoff = "";
// 添加请求拦截器
server.interceptors.request.use(
    (config) => {
        // 如果是登录接口就不用加token
        let arry = [
            "document_login_pass",
            "document_login_type",
            "document_captcha",
            "document_wx_login",
            "https://upload-z2.qiniup.com"
        ];
        if (!arry.includes(config.url)) {
            if (sessionStorage.getItem("token") == null) {
               window.location.href = window.location.protocol + "//" + window.location.host
            } else {
                config.headers.token = sessionStorage.getItem("token");
            }
        }
        let _text = '数据加载中...'
        if (config.data?.condition == 1) {
            _text = "数据上传中，请稍后..."
        }
        // 在发送请求之前做些什么
        if (['qiniu_token', 'https://upload-z2.qiniup.com'].includes(config.url)) {
            return config
        }


        store.commit("SET_lodingOnOff", { onOff: true, text: _text });
        clearTimeout(onoff);
        onoff = setTimeout(() => {
            store.commit("SET_lodingOnOff", { onOff: false, text: '' });
            message.success({ content: "网络异常,请稍后重试。。。" });
        }, 8000);

        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
server.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response?.data;
        clearTimeout(onoff);
        store.commit("SET_lodingOnOff", { onOff: false, text: '' });
        if (res?.code == 1 || res?.code == undefined) {
            if (res.msg != "" && res.msg != undefined) {
                message.success({ content: res.msg });
            }
            return res;
        } else if (res?.code == 101) {
            message.error(res.msg);
            setTimeout(() => {
                router.push({ path: "/login" });
            }, 1500);
        } else if (res?.code == 1001) {
            message.error(res.msg);
            return res;
        } else if (res?.code == 100) {
            //没有权限
            message.error(res.msg);
            router.push("/home?updateJurisdiction=" + true + "")
            return res;
        } else if (res?.code == 102) {
            message.error(res.msg);
            window.location.href = res?.data
            return res;
        } else {
            message.error(res.msg);
            return res;
        }
    },
    (error) => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default server;
