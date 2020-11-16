// 发文管理=>发文拟稿
import server from '@/utils/request'

// 获取发文模板
export function GetselectList(data={}) {
    return server({
        url: "templete_select",
        method: "post",
        data
    });
}
// 收藏/取消收藏发文模板
export function templete_cancel_collect(data={}) {
    data.condition = 1;
    return server({
        url: "templete_cancel_collect",
        method: "post",
        data
    });
}

//draft/addDraft
// 公文拟稿
export function document_add(data={}) {
    data.condition = 1;
    return server({
        url: "document_add",
        method: "post",
        data
    });
}
//draft/addDraft
// 模板详情
export function templete_information(data={}) {
    return server({
        url: "templete_information",
        method: "post",
        data
    });
}

// 公文发布页面提交审批之前的的流程处理，流程走向
export function approval_before_process(data={}) {
    return server({
        url: "approval_before_process",
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

//获取发文收文单位列表
export function list_company(data={}) {
    return server({
        url: "list_company",
        method: "post",
        data
    });
}

//获取字号列表
export function document_wordno_manager(data={}) {
    return server({
        url: "document_wordno_manager",
        method: "post",
        data
    });
}

//获取快捷回复列表
export function approval_get_nimble(data={}) {
    return server({
        url: "approval_get_nimble",
        method: "post",
        data
    });
}
//获取快捷回复新增
export function approval_nimble_add(data={}) {
    return server({
        url: "approval_nimble_add",
        method: "post",
        data
    });
}
//获取快捷回复删除
export function approval_nimble_delete(data={}) {
    return server({
        url: "approval_nimble_delete",
        method: "post",
        data
    });
}

//电子签章列表（全部 我创建的 我常用的）
export function ele_index(data={}) {
    return server({
        url: "ele_index",
        method: "post",
        data
    });
}
//电子签章列表（授权给我的）
export function ele_me_list(data={}) {
    return server({
        url: "ele_me_list",
        method: "post",
        data
    });
}
//电子签章密码验证
export function ele_check(data={}) {
    return server({
        url: "ele_check",
        method: "post",
        data
    });
}
//常用流程数据获取
export function approval_my_template(data={}) {
    return server({
        url: "approval_my_template",
        method: "post",
        data
    });
} 
//常用流程设置（收藏，取消收藏）
export function approval_collection(data={}) {
    data.condition = 1;
    return server({
        url: "approval_collection",
        method: "post",
        data
    });
}

//获取全部套红模板
export function red_template_list(data={}) {
    return server({
        url: "red_template_list",
        method: "post",
        data
    });
}

//设置常用套红模板
export function red_set_commonly(data={}) {
    data.condition = 1;
    return server({
        url: "red_set_commonly",
        method: "post",
        data
    });
}
//报废
export function approval_scrap(data={}) {
    data.condition = 1;
    return server({
        url: "approval_scrap",
        method: "post",
        data
    });
}
//检测字号
export function check_word_wo_re(data={}) {
    return server({
        url: "check_word_wo_re",
        method: "post",
        data
    });
}




