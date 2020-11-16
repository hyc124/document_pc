const allsignature = [
  {
    path: "/allsignature/allsignatureadd",
    name: "allsignatureadd",
    component: () =>
      import("@/views/applicationset/signatureset/allsignature/allsignatureadd.vue"),
    meta: {
      title: "签章设置",
      name: "新建签章",
      is_ci: false,
      listswitch: true,
      num: 6
    },
  },

  {
    path: "/allsignature/allsignatureEdit",
    name: "allsignatureEdit",
    component: () =>
      import("@/views/applicationset/signatureset/allsignature/allsignatureEdit.vue"),
    meta: {
      title: "签章设置",
      name: "编辑签章",
      is_ci: false,
      listswitch: true,
      num: 6
    },
  },
];
export default allsignature;

