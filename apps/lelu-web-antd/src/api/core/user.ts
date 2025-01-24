import {requestClient} from '#/api/request';

export interface UserInfo {
  code: number;
  data: {
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
  };
  msg: string;
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/api/system/user/user_info');
}
