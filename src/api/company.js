import server from '@/utils/request'
//公文应用设置> 收发文单位设置

// 收发文单位列表
export function companyList(data={}) {
    return server({
        url: "list_company",
        method: "post",
        data
    });
}
//删除收发文单位
export function delCompany(data={}) {
    data.condition = 1;
    return server({
        url: "del_company",
        method: "post",
        data
    });
}
// 修改数据
export function addCompany(data={}) {
    data.condition = 1;
    return server({
        url: "add_company",
        method: "post",
        data
    });
}
// 获取一条数据详情
export function oneCompany(data={}) {
    return server({
        url: "one_company",
        method: "post",
        data
    });
}