const addgetformworkset = [
    {
      path: "/getformworkset/addgetformworkset",
      name: "addgetformworkset",
      component: () =>
        import(
          "@/views/applicationset/getset/getformworkset/addgetformworkset.vue"
        ),
      meta: {
        title: "收文模板设置",
        name: "新建收文模板",
        is_ci: false,
        listswitch:true,
        num:6,
        keepAlive:true
      },
    },
    {
      path: "/getformworkset/getcompileformwork",
      name: "getcompileformwork",
      component: () =>
        import(
          "@/views/applicationset/getset/getformworkset/compileformwork.vue"
        ),
      meta: {
        title: "收文模板设置",
        name: "编辑收文模板",
        is_ci: false,
        listswitch:true,
        num:6,
        keepAlive:true
      },
    },
  ];
  export default addgetformworkset;
  