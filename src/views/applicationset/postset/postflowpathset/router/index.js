const postflowpath = [
  {
    path: "/postflowpathset/postflowpathadd",
    name: "postflowpathadd",
    component: () =>
      import(
        "@/views/applicationset/postset/postflowpathset/postflowpathadd.vue"
      ),
    meta: {
      title: "发文流程设置",
      name: "流程模板",
      is_ci: false,
      listswitch: true,
      num:6
    },
  },
];
export default postflowpath;
