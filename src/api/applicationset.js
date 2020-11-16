// 公文应用设置=>发文设置=>发文模板设置
import server from '@/utils/request'

//获取字段列表
export function Getpostinfo(data={}) {
    return server({
        url: "document_templete_fieldlist",
        method: "post",
        data
    });
}

// 新增公文模板
export function Addpostinfo(data={}) {
    data.condition = 1;
    return server({
        url: "document_templete_insert",
        method: "post",
        data
    });
}

// 获取公文列表
export function GetpostinfoList(data={}) {
    return server({
        url: "document_templete_manager",
        method: "post",
        data
    });
}

// 公文模板详情
export function Postinfo(data={}) {
    return server({
        url: "document_templete_info",
        method: "post",
        data
    });
}

// 新增公文模板页面/发文类别/字号规则/流程模板/套红模板列表
export function GetAllList(data={}) {
    return server({
        url: "document_templete_getparameter",
        method: "post",
        data
    });
}

// 删除公文模板
export function DelAllList(data={}) {
    data.condition = 2;
    return server({
        url: "document_templete_remove",
        method: "post",
        data
    });
}