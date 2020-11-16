import mgxtQiniu from "@/js/updata.js"
// 服务器地址
export const HttpUrl =
    process.env.NODE_ENV === "development"
        ? "http://lotus.mgtx-tech-dev.mgtx.com.cn"
        : window.location.protocol + "//" + window.location.host;
// export const HttpUrl = "http://192.168.8.27"; // 韩杰的本地服务器

//预览的url(如果要预览请在后面使用?src携带文件的地址即可)
export const preview_url = "https://view.officeapps.live.com/op/view.aspx";

//最大字符
export const max_length = 20;

// 引入公共api使用
import { getToken, uploadqiniuyun } from "@/api/public.js";
// md5加密引入
import md5 from "js-md5";
import { message } from "ant-design-vue";

// 返回tabal计算过后的高度
export function Calculatedaltitude() {
    //获取元素样式值,为元素ref="ele"(在样式里面写死了的高度)
    let heightCss = window.getComputedStyle(
        document.querySelector(".maincontent")
    );

    let height = heightCss.height.replace("px", "");
    let a = 0;
    for (let i = 0; i < arguments.length; i++) {
        a += arguments[i];
    }
    let h_h = height - a;
    if (height - a < 200) {
        h_h = 200;
    }
    return h_h;
}

// 返回年月日函数
export function getDate(time) {
    let formatNumber = function (n) {
        return n < 10 ? "0" + n : n;
    };
    let dd = new Date(time);
    let y = dd.getFullYear();
    let m = formatNumber(dd.getMonth() + 1);
    let d = formatNumber(dd.getDate());
    let h = formatNumber(dd.getHours());
    let mm = formatNumber(dd.getMinutes());
    let ss = formatNumber(dd.getSeconds());
    let newD = y + m + d + h + mm + ss;
    return newD;
}
// 返回年月日函数有-隔开
export function getDates(time) {
    let formatNumber = function (n) {
        return n < 10 ? "0" + n : n;
    };
    if (time == undefined) {
        time = Date.parse(new Date())
    }
    let dd = new Date(time);
    let y = dd.getFullYear();
    let m = formatNumber(dd.getMonth() + 1);
    let d = formatNumber(dd.getDate());
    let newD = `${y}-${m}-${d}`;
    return newD;
}

// 一、在服务的获取七牛云token。 二、上传七牛云。 三、回调函数传回值
export function randomnumber(files, callback) {
    let text = files.file.name.split("."); // 获取文件后缀
    let timestamp = Date.parse(new Date()); // 获取当前时间戳
    let randomnumbers = Math.round(Math.random() * 10000); // 获取4位随机数
    let num = String(timestamp) + String(randomnumbers); // 拼接当前时间戳转加随机数
    let key = `document/${getDate(timestamp)}${md5(num)}.${text[1]}`; // 拼成完整的key
    const { file } = files;
    const formData = new FormData();
    formData.append("file", file);
    // 在后端获取七牛云token
    getToken().then((data) => {
        if (data.wx3 == 0) {
            for (let key in data) {
                formData.append(key, data[key]);
            }
            formData.append("key", key);
            // 上传到七牛云
            uploadqiniuyun(formData).then((datas) => {
                callback({
                    data: datas,
                    url: data.url,
                    name: files.file.name,
                    size: Math.ceil(files.file.size / 1024),
                    uid: files.file.uid
                });
            });
        } else {
            mgxtQiniu.on('complete', (res) => {
                res.data.key = res.data.path
                callback({
                    data: res.data,
                    url: `http://${res.data.domain}`,
                    name: files.file.name,
                    size: Math.ceil(files.file.size / 1024),
                    uid: files.file.uid
                });
            })
            mgxtQiniu.upload(data.token, file, {}, mgxtQiniu.config)
        }
    });
}
// 将图片上传七牛云
export function randomImg(imgUrl, callback) {
    let timestamp = Date.parse(new Date()); // 获取当前时间戳
    let randomnumbers = Math.round(Math.random() * 10000); // 获取4位随机数
    let num = String(timestamp) + String(randomnumbers); // 拼接当前时间戳转加随机数
    let key = `document/${getDate(timestamp)}${md5(num)}.png`; // 拼成完整的key
    const formData = new FormData();
    formData.append("file", imgUrl);
    // 在后端获取七牛云token
    getToken().then((data) => {
        if (data.wx3 == 0) {
            for (let key in data) {
                formData.append(key, data[key]);
            }
            formData.append("key", key);
            // 上传到七牛云
            uploadqiniuyun(formData).then((datas) => {
                callback({
                    data: datas,
                    url: data.url,
                });
            });
        } else {
            mgxtQiniu.on('complete', (res) => {
                res.data.key = res.data.path
                callback({
                    data: res.data,
                    url: `http://${res.data.domain}`,
                });
            })
            mgxtQiniu.upload(data.token, file, {}, mgxtQiniu.config)
        }

    });
}

// 验证文件类型和大小
export function public_data_files(file, type) {
    let text = file.name.split(".")[1];
    if (!type.includes(text)) {
        message.error(`上传的文件只能是${type.join("、")}格式`);
        return false
    }
    let _jpg = ["png", "jpg", "jpeg", "bmp"];
    let _text = [
        "txt",
        "docx",
        "pptx",
        "ppt",
        "pdf",
        "xls",
        "xlsx",
        "zip",
        "rar"
    ];
    let size = 0
    // 音频大小限制100M
    if (file.name.split(".")[1] == "mp3") {
        size = 100;
        // 图片大小限制10M
    } else if (_jpg.includes(file.name.split(".")[1])) {
        size = 10;
        // 文档限制50M
    } else if (_text.includes(file.name.split(".")[1])) {
        size = 50;
        // 视频限制300M
    } else if (file.name.split(".")[1] == "mp4") {
        size = 300;
    }
    let isLt2M = file.size / 1024 / 1024 < size;
    if (!isLt2M) {
        message.error(`文件不能大于${size}MB`);
    }
    return type.includes(text) && isLt2M;
}

// 数据对比函数，value上次内容 orig2本次内容
// temporary当前对比结果的元素 text放入新的元素
export function initUI(_this, value, orig2, temporary, text, document, index) {
    value = value.replace(/<\/p>|<br>/g, "\n");
    let dds = value.replace(/&nbsp|<[^>]+>/gim, "");
    orig2 = orig2.replace(/<\/p>|<br>/g, "\n");
    let ddss = orig2.replace(/&nbsp|<[^>]+>/gim, "");
    if (value == null) return;
    let target = document.getElementById(temporary);
    _this.$CodeMirror.MergeView(target, {
        value: dds, //上次内容
        origLeft: null,
        orig: ddss, //本次内容
        lineNumbers: false, //显示行号
        mode: "text/html",
        highlightDifferences: true,
        connect: "align",
        readOnly: true, //只读 不可修改
    });
    let htmlone = ''
    let htmltwo = ''
    htmlone = document.getElementsByClassName("CodeMirror-lines")[index + (index - 4)];
    htmltwo = document.getElementsByClassName("CodeMirror-lines")[index + (index - 3)];
    // htmlone = document.getElementsByClassName("CodeMirror-lines")[0];
    // htmltwo = document.getElementsByClassName("CodeMirror-lines")[1];
    setTimeout(() => {
        let textone = document.getElementsByClassName(text)[0];
        let texttwo = document.getElementsByClassName(text)[1]
        textone.innerHTML += htmlone.innerHTML;
        texttwo.innerHTML += htmltwo.innerHTML;
    }, 100);
}

export function filldownload(data) {
    if (data.url != undefined) {
        window.open(data.url)
    } else {
        message.error('服务器错误');
    }
}
// 表单多选按钮点击函数
export function checkBoxSelect(ids) {
    // 表单多选按钮点击函数
    return {
        onChange: (selectedRowKeys, selectedRows) => {
            let _arrys = [];
            selectedRows.forEach(item => {
                _arrys.push(item.id);
            });
            ids.ids = _arrys.join(",");
            ids.selectedRowKeys = selectedRowKeys;
        },
        selectedRowKeys: ids.selectedRowKeys
    };
}
let now = new Date() // 当前日期
let nowDayOfWeek = now.getDay() // 今天本周的第几天
let nowDay = now.getDate() // 当前日
let nowMonth = now.getMonth() // 当前月
let nowYear = now.getYear() // 当前年
nowYear += nowYear < 2000 ? 1900 : 0


function formatDate(date) {
    var myyear = date.getFullYear()
    var mymonth = date.getMonth() + 1
    var myweekday = date.getDate()

    if (mymonth < 10) {
        mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
        myweekday = '0' + myweekday
    }
    return myyear + '-' + mymonth + '-' + myweekday
}
//获得某月的天数
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

    return days;
}
// 获取当前时间
function getNowDay() {
    return formatDate(new Date())
}
// 获得本周的开始时间
function getStartDayOfWeek() {
    var day = nowDayOfWeek || 7

    return formatDate(
        new Date(now.getFullYear(), nowMonth, nowDay + 1 - day)
    )
}
// 获得本周的结束时间
function getEndDayOfWeek() {
    var day = nowDayOfWeek || 7

    return formatDate(
        new Date(now.getFullYear(), nowMonth, nowDay + 7 - day)
    )
}
// 获得本月的开始时间
function getStartDayOfMonth() {
    var monthStartDate = new Date(nowYear, nowMonth, 1)
    return formatDate(monthStartDate)
}
// 获得本月的结束时间
function getEndDayOfMonth() {
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
    return formatDate(monthEndDate)
}
function getYear(type, dates) {
    var dd = new Date();
    var n = dates || 0;
    var year = dd.getFullYear() + Number(n);
    if (type == "s") {
        var day = year + "-01-01" + " 00:00:00";
    };
    if (type == "e") {
        var day = year + "-12-31" + " 23:59:59";
    };

    return day
}


export function get_time(num) {
    let _arry = []
    if (num == 1) {

        _arry = [new Date(getStartDayOfWeek()).getTime(), new Date(getEndDayOfWeek()).getTime()]
    } else if (num == 2) {

        _arry = [new Date(getStartDayOfMonth()).getTime(), new Date(getEndDayOfMonth()).getTime()]
    } else {

        _arry = [new Date(getYear("s")).getTime(), new Date(getYear("e")).getTime()]
    }
    return _arry
}

//数据懒加载
// e=>元素dom   flag=>数据长度是否大于或等于总数   callback=>滚动到底部做的函数
export function divscrollFn(e, flag, callback) {
    let el = document.querySelector(e)
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        if (flag) {
            return
        }
        callback()
    }
}


//获取文件图片
export function get_file_img(suffix) {
    if (["txt"].includes(suffix)) {
        return "file-head file-head-txt"
    }
    if (["doc", "docx"].includes(suffix)) {
        return "file-head file-head-doc"
    }
    if (["jpg", "jpeg", "png", "bmp"].includes(suffix)) {
        return "file-head file-head-image"
    }
    if (["pptx", "ppt"].includes(suffix)) {
        return "file-head file-head-ppt"
    }
    if (["pdf"].includes(suffix)) {
        return "file-head file-head-pdf"
    }
    if (["xls", "xlsx"].includes(suffix)) {
        return "file-head file-head-excel"
    }
    if (["mp3"].includes(suffix)) {
        return "file-head file-head-audio"
    }
    if (["mp4"].includes(suffix)) {
        return "file-head file-head-video"
    }
    if (["zip", "rar"].includes(suffix)) {
        return "file-head file-head-compress"
    }

}

export function contenFilters(text) {
    let reg = /style\s*?=\s*?(['"])[\s\S]*?/g;
    let result = text.replace(reg, '');
    return result;
}