<script setup lang="ts">
// @ts-nocheck

import { onMounted, ref } from "vue";
import {
  Warning,
  Avatar
} from '@element-plus/icons-vue'
import Nickname from "./components/nickname.vue";
import Files from './components/files.vue'
import { useUserStore } from "./stores/user";

const user = useUserStore();
const deleteNickname = () => {
  user.changeNickname('');
}
// WIFI图样
const canvasAnimate = () => {
  if (document.querySelector('canvas')) return;
  let c = document.createElement('canvas');
  document.body.appendChild(c);
  let style = c.style;
  style.width = '100%';
  style.position = 'absolute';
  style.zIndex = -1;
  style.top = 0;
  style.left = 0;
  let ctx = c.getContext('2d');
  let x0, y0, w, h, dw;

  function init() {
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w;
    c.height = h;
    let offset = h > 380 ? 100 : 65;
    offset = h > 800 ? 116 : offset;
    x0 = w / 2;
    y0 = h - offset;
    dw = Math.max(w, h, 1000) / 13;
    drawCircles();
  }
  window.onresize = init;

  function drawCircle(radius) {
    ctx.beginPath();
    let color = Math.round(255 * (1 - radius / Math.max(w, h)));
    ctx.strokeStyle = 'rgba(' + color + ',' + color + ',' + color + ',0.1)';
    ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 2;
  }

  let step = 0;

  function drawCircles() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      drawCircle(dw * i + step % dw);
    }
    step += 1;
  }

  let loading = true;

  function animate() {
    if (loading || step % dw < dw - 5) {
      requestAnimationFrame(function () {
        drawCircles();
        animate();
      });
    }
  }
  window.animateBackground = function (l) {
    loading = l;
    animate();
  };
  init();
  animate();
}

const jump = () => {
  window.open('https://github.com/neekko33/lan-transfer');
}

onMounted(() => {
  const localname = localStorage.getItem("nickname");
  if (localname) {
    user.changeNickname(localname);
  }
  canvasAnimate();
})
</script>

<template>
  <section class="header">
    <section class="icon-bar">
      <!-- <el-icon>
        <avatar />
      </el-icon>-->
      <el-icon @click="jump">
        <warning />
      </el-icon>
    </section>
  </section>
  <el-card class="box-card" v-loading="user.loading">
    <nickname v-if="!user.nickname" />
    <files v-else />
  </el-card>
  <section class="box-info">
    <p v-if="!user.nickname">Please enter your nickname first</p>
    <p v-else>
      You are known as
      <span
        class="primary"
        style="font-weight:bold;cursor:pointer"
        @click="deleteNickname"
      >{{ user.nickname }}</span>
    </p>
    <!-- <p class="primary">You can be descovered by everyone on this network.</p> -->
  </section>
</template>

<style>
html,
body,
#app {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-size: 32px;
}

.header {
  position: relative;
}

.header .icon-bar {
  position: absolute;
  right: 0;
}

.header .icon-bar .el-icon {
  margin: 10px 10px;
  font-size: 0.7rem;
  cursor: pointer;
  color: #333;
}

.box-card {
  padding: 20px;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
}

.box-info {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.box-info p {
  text-align: center;
  font-size: 0.55rem;
}

.primary {
  color: #4285f4;
}
</style>
