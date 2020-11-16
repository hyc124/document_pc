// 公文应用设置=>发文设置=>发文编号规则设置
import server from '@/utils/request'

//获取发文列表
export function Getpostrulese(data={}) {
    return server({
        url: "document_wordno_manager",
        method: "post",
        data
    });
}

// 新增字号规则
export function Addpostrulese(data={}) {
    data.condition = 1;
    return server({
        url: "document_wordno_add",
        method: "post",
        data
    });
}

// 删除字号规则
export function Delpostrulese(data={}) {
    data.condition = 1;
    return server({
        url: "document_wordno_del",
        method: "post",
        data
    });
}

// 字号详情
export function Getpostruleseinfo(data={}) {
    return server({
        url: "document_wordno_detail",
        method: "post",
        data
    });
}
    