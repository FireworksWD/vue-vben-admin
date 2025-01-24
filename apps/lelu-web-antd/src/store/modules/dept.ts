import {defineStore} from "pinia";
import {requestClient} from '#/api/request';
import XEUtils from "xe-utils";
import {toRaw} from 'vue'
export const useDeptInfoStore = defineStore('deptInfo', {
    state:()=>(
        {
            list:[],
            tree:<any>[],
        }
    ),
    actions:{
      async requestDeptInfo() {
            // 请求部门信息
            const ret = await requestClient.get('/api/system/dept/all_dept/')
            this.list = ret.data
            this.tree = XEUtils.toArrayTree(ret.data,{parentKey:'parent',strict:true})
        },
        async getDeptById(_id:any){

        },
        async getParentDeptById(id: any){
            const tree = toRaw(this.tree)
            const obj =  XEUtils.findTree(tree, (item:any) => item.id == id)
            return  obj
        }
    }
})
