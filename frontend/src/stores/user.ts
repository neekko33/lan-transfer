import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id:'user',
  state:() => ({
    nickname:'',
    loading:false
  }),
  actions:{
    changeNickname(name:string) {
      this.nickname = name;
    },
    changeLoading(isLoading:boolean) {
      this.loading = isLoading;
    }
  }
})