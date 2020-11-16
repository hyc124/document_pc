// 公文应用设置=>参数设置=>紧急程度设置
import server from '@/utils/request'

//获取紧急程度列表
export function Geturgent(data={}) {
    return server({
        url: "urgent_type_list",
        method: "post",
        data
    });
}

// 修改紧急程度
export function Seturgent(data={}) {
    data.condition = 1 
    return server({
        url: "urgent_type_update",
        method: "post",
        data
    });
}

// 删除紧急程度
export function Delurgent(data={}) {
    data.condition = 1 // 1为保存状态
    return server({
        url: "urgent_type_delete",
        method: "post",
        data
    });
}

// 添加紧急程度
export function Addurgent(data={}) {
    data.condition = 1 // 1为保存状态
    return server({
        url: "urgent_type_add",
        method: "post",
        data
    });
}

// 查询紧急程度
export function Inquireurgent(data={}) {
    return server({
        url: "urgent_type_list",
        method: "post",
        data
    });
}
