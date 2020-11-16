// 审批详情页面   路由：incoming
import server from "@/utils/request";

// 获取催办列表
export function urge_list (data={}) {
    return server({
        url: "urge_list",
        method: "post",
        data,
    });
}
//上下级节点获取
export function get_approval_around_info (params) {
    return server({
        url: "get_approval_info",
        method: "get",
        params,
    });
}
//(审核页面)流程处理、流程日志
export function procedure_journal (data={}) {
    return server({
        url: "procedure_journal",
        method: "post",
        data,
    });
}
//(审核页面)流程走向
export function recordList (data={}) {
    return server({
        url: "recordList",
        method: "post",
        data,
    });
}
//(审核页面)审批意见&&附件列表
export function approval_opinion (data={}) {
    return server({
        url: "approval_opinion",
        method: "post",
        data,
    });
}

// 传阅文件评论接口
export function circulation_comment (data={}) {
    data.condition = 1;
    return server({
        url: "circulation_comment",
        method: "post",
        data,
    });
}

//传阅意见列表
export function circulation_remark_list (data={}) {
    return server({
        url: "circulation_remark_list",
        method: "post",
        data,
    });
}
//获取最近传阅
export function document_recently_circulated (data={}) {
    return server({
        url: "document_recently_circulated",
        method: "post",
        data,
    });
}
//获取最近传阅
export function file_manager_circulation (data={}) {
    return server({
        url: "file_manager_circulation",
        method: "post",
        data,
    });
}
// 获取流程日志两个版本对比数据
export function addProcessLog (data={}) {
    return server({
        url: "file_manager_circulation",
        method: "post",
        data,
    });
}

// 审批人撤销审批
export function approval_revoke (data={}) {
    data.condition = 1;
    return server({
        url: "approval_revoke",
        method: "post",
        data,
    });
}
// 公文报废按钮
export function approval_scrap (data={}) {
    data.condition = 1;
    return server({
        url: "approval_scrap",
        method: "post",
        data,
    });
}
// 公文分发按钮
export function document_distribute (data={}) {
    data.condition = 1;
    return server({
        url: "document_distribute",
        method: "post",
        data,
    });
}
// 公文呈送
export function document_forward_Send (data={}) {
    data.condition = 1;
    return server({
        url: "document_forward_Send",
        method: "post",
        data,
    });
}

// 归档操作
export function document_status (data={}) {
    data.condition = 1;
    return server({
        url: "document_status",
        method: "post",
        data
    });
}

// 发布操作
export function document_release (data={}) {
    data.condition = 1;
    return server({
        url: "document_release",
        method: "post",
        data
    });
}

// 获取归档箱分组列表
export function group_list (data={}) {
    return server({
        url: "group_list",
        method: "post",
        data
    });
}

// 获取行为统计数据列表
export function file_count (data={}) {
    return server({
        url: "file_count",
        method: "post",
        data,
    });
}

// 审批催办
export function approval_urge (data={}) {
    data.condition = 1;
    return server({
        url: "approval_urge",
        method: "post",
        data,
    });
}

// 转审接口
export function approval_my_shift (data={}) {
    data.condition = 1;
    return server({
        url: "approval_my_shift",
        method: "post",
        data,
    });
}

// // 快速发文
// export function document_add_fast() {
//   return server({
//     url: "document_add_fast",
//     method: "post",
//     data,
//   });
// }
