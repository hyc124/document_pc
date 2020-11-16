const signoffadd = [
  {
    path: "/signoffruleset/signoffadd",
    name: "signoffadd",
    component: () =>
      import(
        "@/views/applicationset/signoff/signoffruleset/components/add.vue"
      ),
    meta: {
      title: "模板编号规则设置",
      name: "新建字号规则",
      is_ci: false,
      num: 6
    },
  },
  {
    path: "/signoffruleset/signoffRilesetendit",
    name: "signoffRilesetendit",
    component: () =>
      import(
        "@/views/applicationset/signoff/signoffruleset/components/signoffRilesetendit.vue"
      ),
    meta: {
      title: "签报编号规则设置",
      name: "编辑编号规则",
      is_ci: false,
      num: 6
    },
  }
];
export default signoffadd;