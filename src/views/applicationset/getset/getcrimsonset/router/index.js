const getcrimsonadd = [
  {
    path: "/getcrimsonset/getcrimsonadd",
    name: "getcrimsonadd",
    component: () =>
      import(
        "@/views/applicationset/getset/getcrimsonset/getcrimsonadd.vue"
      ),
    meta: {
      title: "套红模板设置",
      name: "新建套红模板",
      is_ci: false,
      num:6
    },
  },
  // {
  //   path: "/getcrimsonset/getcompilecrimsonadd",
  //   name: "getcompilecrimsonadd",
  //   component: () =>
  //     import(
  //       "@/views/applicationset/getset/getcrimsonset/compilecomponents/compilecrimsonadd.vue"
  //     ),
  //   meta: {
  //     title: "套红模板设置",
  //     name: "编辑套红模板",
  //     is_ci: false,
  //     num:5
  //   },
  // },
];
export default getcrimsonadd;
