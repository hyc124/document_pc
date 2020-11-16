const insystemsetShort = [
    {
      path: "/insystemset/short",
      name: "short",
      component: () =>
        import(
          "@/views/systemset/insystemset/components/short.vue"
        ),
      meta: {
        title: "",
        name: "短信验证",
        is_ci: false,
        listswitch: true
      },
    },
    {
        path: "/insystemset/email",
      name: "email",
      component: () =>
        import(
          "@/views/systemset/insystemset/components/Email.vue"
        ),
      meta: {
        title: "",
        name: "邮箱验证",
        is_ci: false,
        listswitch: true
      },
    }
  ];
  export default insystemsetShort;