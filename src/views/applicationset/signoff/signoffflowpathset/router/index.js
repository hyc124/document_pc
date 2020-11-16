const signoffflowpath = [
  {
    path: "/signoffflowpathset/signoffflowpathadd",
    name: "signoffflowpathadd",
    component: () =>
      import(
        "@/views/applicationset/signoff/signoffflowpathset/signoffflowpathadd.vue"
      ),
    meta: {
      title: "签报流程设置",
      name: "流程模板",
      is_ci: false,
      listswitch: true,
      num:6
    },
  },
];
export default signoffflowpath;
