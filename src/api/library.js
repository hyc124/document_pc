// 发文管理 > 发文库
import server from '@/utils/request'

// 公文分发 > 接收列表
export function libraryList(data={}) {
    return server({
        url: "document_library",
        method: "post",
        data
    });
}

// 删除公文
export function DelDocument(data={}) {
    data.condition = 1;
    return server({
        url: "document_del_document",
        method: "post",
        data
    });
}

// 待我审核和待别人审的
export function document_wait_approval_list(data={}) {
    return server({
        url: "document_wait_approval_list",
        method: "post",
        data
    });
}


