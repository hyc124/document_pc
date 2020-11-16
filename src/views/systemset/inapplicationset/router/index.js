const addlication = [
    {
      path: "/inapplicationset/addapplication",
      name: "addapplication",
      component: () =>
        import(
          "@/views/systemset/inapplicationset/addapplication.vue"
        ),
      meta: {
        title: "",
        name: "添加应用",
        is_ci: false,
      },
    },
  ];
  export default addlication;