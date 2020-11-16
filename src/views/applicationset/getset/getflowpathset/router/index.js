const getflowpath = [
  {
    path: "/getflowpathset/getflowpathadd",
    name: "getflowpathadd",
    component: () =>
      import("@/views/applicationset/getset/getflowpathset/getflowpathadd.vue"),
    meta: {
      title: "发文流程设置",
      name: "流程模板",
      is_ci: false,
      listswitch: true,
      num:6
    },
  },
];
export default getflowpath;
