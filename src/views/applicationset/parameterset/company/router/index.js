const companypath = [
  {
    path: "/company/companyadd",
    name: "companyadd",
    component: () =>
      import(
        "@/views/applicationset/parameterset/company/companyadd.vue"
      ),
    meta: {
      title: '参数设置',
      name: "新增收发文单位",
      is_ci: false,
      listswitch: true,
      num:6
    },
  },
];
export default companypath;
