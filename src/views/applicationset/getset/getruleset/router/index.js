const postadd = [
    {
      path: "/getruleset/addressee",
      name: "addressee",
      component: () =>
        import(
          "@/views/applicationset/getset/getruleset/addressee.vue"
        ),
      meta: {
        title: "收文编号规则设置",
        name: "新建字号规则",
        is_ci: false,
        num:6
      },
    },
    {
      path: "/getruleset/getruleSetEdit",
      name: "getruleSetEdit",
      component: () =>
        import(
          "@/views/applicationset/getset/getruleset/components/getruleSetEdit.vue"
        ),
      meta: {
        title: "收文编号规则设置",
        name: "编辑编号规则",
        is_ci: false,
        num:6
      },
    },
  ];
  export default postadd;