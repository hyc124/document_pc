// 公文应用设置=>参数设置=>密集程度设置
import server from '@/utils/request'

//获取密集程度列表
export function secrecyTypeList(data={}) {
    return server({
        url: "secret_type_list",
        method: "post",
        data
    });
}

// 添加密集程度
export function Addsecrecy(data={}){
    data.condition = 1 // 1为保存状态
    return server({
        url: "secret_type_add",
        method: "post",
        data,
    });
}

// 删除密集程度
export function Delsecrecy(data={}){
    data.condition = 1 // 1为保存状态
    return server({
        url: "secret_type_delete",
        method: "post",
        data
    });
}

// 编辑密集程度
export function Setsecrecy(data={}){
    data.condition = 1 // 1为保存状态
    return server({
        url: "secret_type_update",
        method: "post",
        data
    });
}

// 查询密集程度
export function Getsecrecy(data={}){
    return server({
        url: "secret_type_list",
        method: "post",
        data
    });
}

