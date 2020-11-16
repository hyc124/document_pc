const postcrimson = [
  {
    path: "/postcrimsonset/crimsonadd",
    name: "crimsonadd",
    component: () =>
      import(
        "@/views/applicationset/postset/postcrimsonset/crimsonadd.vue"
      ),
    meta: {
      title: "套红模板设置",
      name: "新建套红模板",
      is_ci: false,
      num:6
    },
  },
  // {
  //   path: "/postcrimsonset/compilecrimsonadd",
  //   name: "compilecrimsonadd",
  //   component: () =>
  //     import(
  //       "@/views/applicationset/postset/postcrimsonset/compilecomponents/compilecrimsonadd.vue"
  //     ),
  //   meta: {
  //     title: "套红模板设置",
  //     name: "编辑套红模板",
  //     is_ci: false,
  //     num:5
  //   },
  // },
];
export default postcrimson;
