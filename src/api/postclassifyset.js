// 公文应用设置=>发文设置=>发文分类设置/收文分类设置
import server from '@/utils/request'

//获取发文列表
export function GetdataList(data={}) {
    return server({
        url: "document_type_manager",
        method: "post",
        data
    });
}

// 编辑发文
export function Setpost(data={}) {
    data.condition = 1;
    return server({
        url: "document_type_insert",
        method: "post",
        data
    });
}

// 删除公文类型
export function Delpost(data={}) {
    data.condition = 1;
    return server({
        url: "document_type_remove",
        method: "post",
        data
    });
}

// 新建发文类型
export function Addpost(data={}) {
    data.condition = 1;
    return server({
        url: "document_type_insert",
        method: "post",
        data
    });
}

// 查询发文列表
export function Getpost(data={}) {
    return server({
        url: "document_type_manager",
        method: "post",
        data
    });
}
