const acceptadd = [
  {
    path: "/accept/acceptadd",
    name: "acceptadd",
    component: () => import("@/views/webservice/accept/acceptadd.vue"),
    meta: {
      title: "公文接收",
      name: "查看接收文件",
      is_ci: false,
      listswitch: true,
    },
  },
];
export default acceptadd;
