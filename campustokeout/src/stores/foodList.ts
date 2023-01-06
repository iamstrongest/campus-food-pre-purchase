import { ref, computed } from "vue";
import { defineStore } from "pinia";
export const foodListStore = defineStore({
    id: "foodList",
    state: () => {
        return {
          foodList: [],
          shopNameList: [],
          searchArray: [],
          kind:[],
        }
    },
    getters: {
        
    },
    actions: {
        
    }
});
