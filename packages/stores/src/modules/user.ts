import { acceptHMRUpdate, defineStore } from 'pinia';

// interface BasicUserInfo {
//   [key: string]: any;
//   /**
//    * 头像
//    */
//   avatar: string;
//   /**
//    * 用户昵称
//    */
//   realName: string;
//   /**
//    * 用户角色
//    */
//   roles?: string[];
//   /**
//    * 用户id
//    */
//   userId: string;
//   /**
//    * 用户名
//    */
//   username: string;
// }
interface BasicUserInfo {
  avatar: string;
  dept: number;
  dept_info: {
    dept_id: number;
    dept_name: string;
  };
  email: string;
  gender: number;
  id: number;
  is_superuser: boolean;
  mobile: string;
  name: string;
  role: Array<string>;
  role_info: Array<{
    id: string;
    key: string;
    name: string;
  }>;
  user_type: number;
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: Array<{
    id: string;
    key: string;
    name: string;
  }>;
  isSocketOpen: boolean
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.role_info ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: any) {
      this.userRoles = roles;
    },
    async setWebSocketState(socketState: boolean) {
      this.isSocketOpen = socketState;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
    isSocketOpen: false
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
