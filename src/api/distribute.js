// 公文交换 > 公文分发
import server from '@/utils/request'

// 公文分发 > 接收列表
export function distributeList(data={}) {
    return server({
        url: "distribute_mine",
        method: "post",
        data
    });
}

// 公文接收 > 详情和新增页面 >  接收列表
export function adddistributeInfo(data={}) {
    return server({
        url: "distribute_file_detail",
        method: "post",
        data
    });
}