/**
 * @author: Ethan
 * @contact: email:
 * @Created on: 2024/12/14 9:29
 * @Remark:
 **/
export interface rowAreaType {
  code?: string;
  create_datetime?: string;
  creator?: string;
  creator_name?: string;
  dept_belong_id?: string;
  description?: string;
  enable?: boolean;
  hasChildren?: boolean;
  id?: number;
  initials?: string;
  level?: number;
  modifier?: string;
  modifier_name?: string;
  name?: string;
  pcode?: any;
  pcode_count?: number;
  pcode_info?: Array<any>;
  pinyin?: string;
  update_datetime?: string;

  [key: string]: any;
}
