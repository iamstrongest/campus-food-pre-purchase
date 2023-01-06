import { ref, computed } from "vue";
import { defineStore } from "pinia";
export const foodCartStore = defineStore({
  id: "foodCart",
  state: () => {
    return {
      totalNums: 0,
      totalPrice: 0,
      chooseCollection: [],
      showCheckoutInterface: false
    }
  },
  getters: {
    getTotal(state) {
      let total = 0;
      state.chooseCollection.forEach((item) => {
        total += item.price * item.number;
      });
      state.totalPrice = total;
      return total;
    },
    resize(state) {
      return function (id) {
        let num = 0;
        for (var item of state.chooseCollection) {
          if (item.foodId == id) {
            num = item.number;
            break;
          }
        }
        return num;
      };
    },
  },
  actions: {
    add() {
      this.totalNums++;
    },
    sub() {
      this.totalNums--;
    },
    addArray(fooddetails) {
      this.chooseCollection.push(fooddetails);
    },
    deleteArray(id) {
      this.chooseCollection.filter((item, index) => {
        if (item.foodId == id) {
          this.chooseCollection.splice(index, 1);
          return;
        }
      });
    },
    deleteAll() {
      this.chooseCollection = [];
      this.totalNums = 0;
      this.totalPrice = 0;
    },
    showCheckoutInterfaceHandle() { 
      this.showCheckoutInterface = true;
    },
    cancleShowCheckoutInterfaceHandle() { 
      this.showCheckoutInterface =false ;
    }
  },
});

