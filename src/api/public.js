// 公共请求
import server from '@/utils/request'

// 获取七牛云token
export function getToken(params) {
    return server({
        url: "qiniu_token",
        method: "get",
        params
    });
}

// 把文件上传到七牛云
export function uploadqiniuyun(data={}) {
    return server({
        url: "https://upload-z2.qiniup.com",
        method: "post",
        data
    });
}

// 获取部门信息列表
export function OrganiZationalList(data={}) {
    return server({
        url: "get_dept_and_members",
        method: "post",
        data
    });
}

// 获取角色信息
export function obtainRole(params) {
    return server({
        url: "document_role_index",
        method: "get",
        params
    });
}

// 查询标签数据列表
export function addLabelList(data={}) {
    return server({
        url: "get_tags_and_members",
        method: "post",
        data
    });
}
// 查询角色数据列表
export function document_role_index(data) {
    return server({
        url: "document_role_index",
        method: "post",
        data
    });
}

// 获取word文档内容接口
export function get_word(data={}) {
    return server({
        url: "get_word",
        method: "post",
        data
    });
}

// 批量下载附件
export function batchDownload(params) {
    return server({
        url: "enclosure_download",
        method: "get",
        params
    });
}

// 获取发文模板
export function GetselectList(data={}) {
    return server({
        url: "templete_select",
        method: "post",
        data
    });
}
// 获取用户信息
export function LoginTransfer(data={}) {
    return server({
        url: "document_wx_login",
        method: "post",
        data
    });
}

// 导出列表数据
export function documentExcelout(data={}) {
    return server({
        url: "word_out",
        method: "post",
        data
    });
}

// 上传当前行为记录
export function printing_add(data={}) {
    return server({
        url: 'printing_add',
        method: 'post',
        data
    })
}

// 获取管理员名称
export function getTheName(data={}) {
    return server({
        url: "get_user_manage",
        method: "post",
        data
    });
}

// 公文详情(草稿箱数据获取)
export function document_information(data={}) {
    return server({
        url: "document_information",
        method: "post",
        data
    });
}