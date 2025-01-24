import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    code: number;
    data: {
      access: string;
      avatar: string;
      dept_info: {
        dept_id: string;
        dept_name: string;
      };
      name: string;
      refresh: string;
      userId: string;
      user_type: string;
      role_info: Array<{
        id: string;
        key: string;
        name: string;
      }>;
    }
    msg: string;
  }

  export interface RefreshTokenResult {
    data: any;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/api/login/', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(refreshToken: any) {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/token/refresh/', {
    withCredentials: true,
    refresh: refreshToken,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/api/logout/', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('api//auth/codes');
}
