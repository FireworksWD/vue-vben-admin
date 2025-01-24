/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/18 10:37
 * @Remark:
**/
import {defineStore} from "pinia";
/**
 * 消息中心
 */
export const messageCenterStore = defineStore('messageCenter', {
  state: () => ({
    // 未读消息
    unread: 0
  }),
  actions: {
    async setUnread (number:any) {
      this.unread = number
    }
  },
});
