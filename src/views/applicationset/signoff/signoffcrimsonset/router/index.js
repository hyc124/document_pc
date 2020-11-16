const signoffcrimson = [
  {
    path: "/signoffcrimsonset/crimsonadd",
    name: "signoffcrimsonadd",
    component: () =>
      import(
        "@/views/applicationset/signoff/signoffcrimsonset/crimsonadd.vue"
      ),
    meta: {
      title: "套红模板设置",
      name: "新建套红模板",
      is_ci: false,
      num: 6
    },
  }
];
export default signoffcrimson;
