const addformwork = [
    {
      path: "/postformworkset/addformwork",
      name: "addformwork",
      component: () =>
        import(
          "@/views/applicationset/postset/postformworkset/addformwork.vue"
        ),
      meta: {
        title: "发文模板设置",
        name: "新建发文模板",
        is_ci: false,
        listswitch:true,
        num: 6,
        keepAlive:true
      },
    },
    {
      path: "/postformworkset/compileformwork",
      name: "compileformwork",
      component: () =>
        import(
          "@/views/applicationset/postset/postformworkset/compileformwork.vue"
        ),
      meta: {
        title: "发文模板设置",
        name: "编辑发文模板",
        is_ci: false,
        listswitch:true,
        num: 6,
        keepAlive:true
      },
    },
  ];
  export default addformwork;
  