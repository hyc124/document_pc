// 公文应用设置=>发文设置=>套红模板设置
import server from '@/utils/request'

//新增套红模板
export function Addloadcrims(data={}) {
    data.condition = 1;
    return server({
        url: "red_template_add",
        method: "post",
        data
    });
}

//删除套红模板
export function Delloadcrims(data={}) {
    data.condition = 1;
    return server({
        url: "red_template_delete",
        method: "post",
        data
    });
}


//编辑套红模板
export function Setloadcrims(data={}) {
    data.condition = 1;
    return server({
        url: "red_template_update",
        method: "post",
        data
    });
}

// 获取套红模板列表
export function Getloadcrims(data={}) {
    return server({
        url: "red_template_list",
        method: "post",
        data
    });
}

// 查询套红模板列表
export function Inquireloadcrims(data={}){
    return server({
        url: "red_template_list",
        method: "post",
        data
    });
}

// 下载套红模板
export function Download(data={}){
    data.condition = 1;
    return server({
        url: "red_template_download",
        method: "post",
        data
    });
}

// 获取套红模板单条数据
export function GetCrimsonInfo(data={}){
    return server({
        url: "red_template_one",
        method: "post",
        data
    });
}
// 获取套红模板单条数据
export function red_template_one(data={}){
    return server({
        url: "red_template_one",
        method: "post",
        data
    });
}


