import server from "@/utils/request";
// 新增签章
export function addEle(data={}) {
  data.condition = 1;
  return server({
    url: "ele_add",
    method: "post",
    data,
  });
}
//获取签章
export function getEle(data={}) {
  return server({
    url: "ele_index",
    method: "post",
    data,
  });
}
export function deleteEle(data={}) {
  data.condition = 1;
  return server({
    url: "ele_delete",
    method: "post",
    data,
  });
}
//授权给我的
export function myEleList(data={}) {
  return server({
    url: "ele_me_list",
    method: "post",
    data,
  });
}
//详情页
export function eleDetail(data={}) {
  return server({
    url: "ele_detail",
    method: "post",
    data,
  });
}
export function getUserInfo(data={}) {
  return server({
    url: "get_myname",
    method: "post",
    data,
  });
}
export function getEleUpdate(data={}) {
  data.condition = 1;
  return server({
    url: "ele_update",
    method: "post",
    data,
  });
}
export function ele_check(data={}) {
  return server({
    url: "ele_check",
    method: "post",
    data,
  });
}
