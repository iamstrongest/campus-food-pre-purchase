export const userRoutes = [
  {
    path: "/user/registy",
    name: "registy",
    component: () => import("@/views/user/userOptions/Registy.vue"),
  },
  {
    path: "/user/find",
    name: "findPwd",
    component: () => import("@/views/user/userOptions/FindPwd.vue"),
  },
  {
    path: "/user/delete",
    name: "delete",
    component: () => import("@/views/user/userOptions/Delete.vue"),
  },
  {
    path: "/user/login",
    name: "login",
    component: () => import("@/views/user/userOptions/Login.vue"),
  },
  {
    path: "/user",
    name: "userLayout",
    redirect: "/user/update/personal",
    component: () => import("@/views/user/userInfo/InfoLayout.vue"),
    children: [
      {
        path: "update/personal",
        name: "personal",
        component: () => import("@/components/main/userInfo/UpdateInfo.vue"),
      },
      {
        path: "update/image",
        name: "image",
        component: () => import("@/components/main/userInfo/UpdateImage.vue"),
      },
      {
        path: "update/password",
        name: "password",
        component: () =>
          import("@/components/main/userInfo/UpdatePassword.vue"),
      },
      {
        path: "collection",
        name: "collection",
        component: () =>
          import("@/components/main/userInfo/CollectionsDetails.vue"),
      },
      {
        path: "views",
        name: "views",
        component: () => import("@/components/main/userInfo/ViewsDetails.vue"),
      },
      {
        path: "love",
        name: "love",
        component: () => import("@/components/main/userInfo/LoveDetails.vue"),
      },
    ],
  },
];
