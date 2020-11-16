const documentarea_incoming = [
  {
    path: "/documentarea/incoming",
    name: "documentarea_incoming",
    component: () => import("@/views/documentarea/components/incoming/incoming.vue"),
    meta: {
      title: "",
      name: "发文模板",
      is_ci: false,
      listswitch: true,
      num: 5,
    },
  },
];
export default documentarea_incoming;
