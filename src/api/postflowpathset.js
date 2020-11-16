// 公文应用设置=>发文设置=>发文/收文流程设置
import server from "@/utils/request";

//获取发文流程设置列表
export function GetpathsetList(data={}) {
  return server({
    url: "approval_page_list",
    method: "post",
    data,
  });
}

// 获取编辑流程模板数据接口
export function SetpathsetList(data={}) {
  return server({
    url: "edit_approval_setting",
    method: "post",
    data,
  });
}

// 新增流程模板接口
export function AddpathsetList(data={}) {
  data.condition = 1;
  return server({
    url: "save_approval_api",
    method: "post",
    data,
  });
}

// 删除审批模板接口
export function DelpathsetList(data={}) {
  data.condition = 1;
  return server({
    url: "delete_approval_api",
    method: "post",
    data,
  });
}

// 编辑保存接口
export function SavepathsetList(data={}) {
  data.condition = 1;
  return server({
    url: "edit_approval_add",
    method: "post",
    data,
  });
}

// 搜索部门人员标签
export function Getorganizationaldata(data={}) {
  return server({
    url: "get_organizational_data",
    method: "post",
    data,
  });
}
