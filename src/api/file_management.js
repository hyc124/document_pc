// 文件管理区 
import server from '@/utils/request'

//归档箱废弃箱列表 type值 1.废弃发文 2.废弃收文 3.废弃签报
export function filing_box(data={}) {
    return server({
        url: "file_manager_list",
        method: "post",
        data
    });
}


// 传阅抄送公文列表接口 类型（0传阅，1抄送）
export function copying(data={}) {
    return server({
        url: "circulation_list",
        method: "post",
        data
    });
}

//发/收文详情
export function manage_detail(data={}) {
    return server({
        url: "document_information",
        method: "post",
        data
    });
}

//废弃箱删除单条接口
export function del_manage(data={}) {
    data.condition = 1;
    return server({
        url: "file_manager_delete",
        method: "post",
        data
    });
}

//文件下载
export function file_download(data={}) {
    data.condition = 1;
    return server({
        url: "file_manager_download",
        method: "post",
        data
    });
}
