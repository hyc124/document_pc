//首页
import server from '@/utils/request'

//待处理条数接口
export function get_wait_file_count (data={}) {
    return server({
        url: "wait_file_count",
        method: "post",
        data
    });
}
//公文数据
export function get_document_data (data={}) {
    return server({
        url: "document_data",
        method: "post",
        data
    });
}
//公文统计
export function get_statistics_data (data={}) {
    return server({
        url: "file_statistics",
        method: "post",
        data
    });
}
//代办/待阅公文数据
export function get_wait_document (data={}) {
    return server({
        url: "wait_document",
        method: "post",
        data
    });
}
//最新收文发文签报
export function get_new_document (data={}) {
    return server({
        url: "new_document",
        method: "post",
        data
    });
}
//消息提醒
export function get_msg_remind (data={}) {
    return server({
        url: "msg_remind",
        method: "post",
        data
    });
}
//发起的公文
export function get_document_list (data={}) {
    return server({
        url: "get_document_list",
        method: "post",
        data
    });
}
//待处理的公文
export function wait_document_list (data={}) {
    return server({
        url: "wait_document_list",
        method: "post",
        data
    });
}
//获取公文模板
export function templete_select (data={}) {
    return server({
        url: "templete_select",
        method: "post",
        data
    });
}
//获取公文模板
export function msg_count (data={}) {
    return server({
        url: "msg_count",
        method: "post",
        data
    });
}
//消息通知点击处理
export function msg_my_handle (data={}) {
    return server({
        url: "msg_my_handle",
        method: "post",
        data
    });
}




