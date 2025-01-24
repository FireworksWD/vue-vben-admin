import {message} from 'ant-design-vue'
import {useAccessStore} from "@vben/stores";
import {getWsBaseURL} from "#/utils/baseUrl";
import {useUserStore} from '@vben/stores';
import {$t} from '#/locales'

interface socket {
  websocket: WebSocket | null; // websocket 实例
  connectURL: string; // WebSocket 连接 URL
  socket_open: boolean; // WebSocket 是否打开
  hearbeat_timer: NodeJS.Timeout | null; // 心跳定时器
  hearbeat_interval: number; // 心跳发送频率
  is_reonnect: boolean; // 是否自动重连
  reconnect_count: number; // 重连次数限制
  reconnect_current: number; // 当前重连次数
  reconnect_timer: NodeJS.Timeout | null; // 重连定时器
  reconnect_interval: number; // 重连频率
  init: (receiveMessage: (e: MessageEvent) => void) => void; // 初始化 WebSocket 连接方法
  heartbeat: () => void; // 心跳方法
  send: (data: any, callback?: any) => void; // 发送数据的方法
  close: () => void; // 关闭 WebSocket 连接
  reconnect: () => void; // 重新连接方法
}

const websocket: socket = {
  websocket: null,
  connectURL: getWsBaseURL(),
  // 开启标识
  socket_open: false,
  // 心跳timer
  hearbeat_timer: null,
  // 心跳发送频率
  hearbeat_interval: 2 * 1000,
  // 是否自动重连
  is_reonnect: true,
  // 重连次数
  reconnect_count: 3,
  // 已发起重连次数
  reconnect_current: 1,
  // 重连timer
  reconnect_timer: null,
  // 重连频率
  reconnect_interval: 5 * 1000,
  init: (receiveMessage: Function | null) => {
    if (!('WebSocket' in window)) {
      message.warning($t('system.N00320')+'WebSocket')
      return null
    }
    const token = useAccessStore().accessToken
    if (!token) {
      // message.warning('websocket认证失败')
      return null
    }
    const wsUrl = `${getWsBaseURL()}ws/${token}/`
    websocket.websocket = new WebSocket(wsUrl)
    websocket.websocket.onmessage = (e: any) => {
      if (receiveMessage) {
        receiveMessage(e)
      }
    }
    // @ts-ignore
    websocket.websocket.onclose = async (e: any) => {
      websocket.socket_open = false
      await useUserStore().setWebSocketState(websocket.socket_open);
      // 需要重新连接
      if (websocket.is_reonnect) {
        websocket.reconnect_timer = setTimeout(() => {
          // 超过重连次数
          if (websocket.reconnect_current > websocket.reconnect_count) {
            // @ts-ignore
            clearTimeout(websocket.reconnect_timer)
            websocket.is_reonnect = false
            websocket.socket_open = false
            useUserStore().setWebSocketState(websocket.socket_open);
            return
          }
          // 记录重连次数
          websocket.reconnect_current++
          websocket.reconnect()
        }, websocket.reconnect_interval)
      }
    }
    // 连接成功
    websocket.websocket.onopen = async function () {
      websocket.socket_open = true
      await useUserStore().setWebSocketState(websocket.socket_open);
      websocket.is_reonnect = true
      // 开启心跳
      websocket.heartbeat()
    }
    // 连接发生错误
    websocket.websocket.onerror = function () {
    }
  },
  heartbeat: () => {
    websocket.hearbeat_timer && clearInterval(websocket.hearbeat_timer)

    websocket.hearbeat_timer = setInterval(() => {
      let data = {
        token: useAccessStore().accessToken,
      }
      websocket.send(data)
    }, websocket.hearbeat_interval)
  },
  send: async (data: string, callback = null) => {
    // 开启状态直接发送
    if (websocket?.websocket?.readyState === websocket?.websocket?.OPEN) {
      websocket?.websocket?.send(JSON.stringify(data))
      // @ts-ignore
      callback && callback()
    } else {
      // @ts-ignore
      clearInterval(websocket.hearbeat_timer)
      message.warning('socket'+$t('system.N00516'))
      websocket.socket_open = false
      await useUserStore().setWebSocketState(websocket.socket_open);
    }
  },
  close: async () => {
    websocket.is_reonnect = false
    websocket?.websocket?.close()
    websocket.websocket = null;
    websocket.socket_open = false
    await useUserStore().setWebSocketState(websocket.socket_open);
  },
  /**
   * 重新连接
   */
  reconnect: () => {
    if (websocket.websocket && !websocket.is_reonnect) {
      websocket.close()
    }
    websocket.init(() => {
    })
  },
}
export default websocket;
