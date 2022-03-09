<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { ElNotification } from "element-plus";

const nickname = ref("");
const user = useUserStore();
const handleClick = () => {
  if (nickname.value) {
    user.changeLoading(true);
    setTimeout(() => {
      localStorage.setItem("nickname", nickname.value);
      user.changeNickname(nickname.value);
      ElNotification({
        title: 'Success',
        message: 'Nickname has been saved.',
        type: 'success',
      })
      user.changeLoading(false);
    }, 1000);
  } else {
    ElNotification({
      title: 'Error',
      message: 'Nickname cannot be null.',
      type: 'error',
    })
  }
};
</script>

<template>
  <h1>Please Enter Your Nickname</h1>
  <el-input v-model="nickname" clearable></el-input>
  <el-button type="primary" style="font-weight: bold" @click="handleClick">CONFIRM</el-button>
</template>

<style scoped>
h1 {
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
}

.el-input {
  margin: 1rem auto;
}

.el-button {
  width: 100%;
  background-color: #4285f4;
}
</style>
