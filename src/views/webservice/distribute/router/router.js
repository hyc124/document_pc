const adddistribute = [
  {
    path: "/distribute/adddistribute",
    name: "adddistribute",
    component: () => import("@/views/webservice/distribute/adddistribute.vue"),
    meta: {
      title: "公文分发",
      name: "查看分发文件",
      is_ci: false,
      listswitch: true,
    },
  },
];
export default adddistribute;
