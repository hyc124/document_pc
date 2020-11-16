const signoaddformwork = [
    {
      path: "/signoffformworkset/signoffaddformwork",
      name: "signoffaddformwork",
      component: () =>
        import(
          "@/views/applicationset/signoff/signoffformworkset/addformwork.vue"
        ),
      meta: {
        title: "签报模板设置",
        name: "新建签报模板",
        is_ci: false,
        listswitch:true,
        num:6,
        keepAlive:true
      },
    },
    {
      path: "/signoffformworkset/signoffcompileformwork",
      name: "signoffcompileformwork",
      component: () =>
        import(
          "@/views/applicationset/signoff/signoffformworkset/compileformwork.vue"
        ),
      meta: {
        title: "签报模板设置",
        name: "编辑签报模板",
        is_ci: false,
        listswitch:true,
        num:6,
        keepAlive:true
      },
    },
  ];
  export default signoaddformwork;
  