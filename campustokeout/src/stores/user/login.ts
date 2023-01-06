import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { userLogin } from "@/utils/axios/api/user/index.js"
import { useKey } from "@/hooks/useKey"
export const loginStore = defineStore({
    id: "login",
    state: () => {
        return {
            isShowLogin: false,
        }
    },
    getters: {
        
    },
    actions: {
        async login(url: string, data: object): Promise<string> {
            const { data: res } = await userLogin(url,...useKey(data.id,data.password) );  
            return res;
        },
        confirmLogin() {
            this.isShowLogin = true;
        },
        rejectLogin() {
            this.isShowLogin = false;
        }
    }
});
