const postadd = [
    {
      path: "/postruleset/add",
      name: "add",
      component: () =>
        import(
          "@/views/applicationset/postset/postruleset/components/add.vue"
        ),
      meta: {
        title: "发文编号规则设置",
        name: "新建字号规则",
        is_ci: false,
        num:5
      },
    },
    {
      path: "/postruleset/edit",
      name: "edit",
      component: () =>
        import(
          "@/views/applicationset/postset/postruleset/components/edit.vue"
        ),
      meta: {
        title: "发文编号规则设置",
        name: "编辑编号规则",
        is_ci: false,
        num:5
      },
    },
    
  ];
  export default postadd;