<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { ElNotification } from 'element-plus'
import {
  User,
  TakeawayBox,
  Folder,
  AlarmClock,
  Files,
  Download
} from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue';
import { getFiles, baseUrl, upLoadFile, delFile } from '../utils/api'

const user = useUserStore();
const fileState = reactive({
  total: 0,
  size: 5,
  page: 1,
  fileList: []
})

const getData = async () => {
  const { data: { fileList, total, size } } = await getFiles(fileState.page, fileState.size);
  fileState.total = total;
  fileState.fileList = fileList;
}

// 上传文件
const upload = async () => {
  const u = document.getElementById("upload");
  const res = await upLoadFile(u as HTMLInputElement, user.nickname);
  if (res) {
    const { data: { msg } } = res;
    if (msg) {
      ElNotification({
        title: 'Success',
        message: 'File has been uploaded',
        type: 'success',
      })
      fileState.page = 1;
      getData();
      return;
    }
  }
  ElNotification({
    title: 'Error',
    type: 'error',
  })
}

const handleClick = () => {
  const u = document.getElementById("upload");
  if (!u) return;
  u.click();
}

// 下载文件
const download = (item: string) => {
  window.open(baseUrl + 'download?fileName=' + item + '&nickname=' + user.nickname);
}

// 删除文件
const deleteFile = async (item: string) => {
  const { data: { msg } } = await delFile(item, user.nickname);
  if (msg) {
    ElNotification({
      title: 'Success',
      message: 'File has been deleted',
      type: 'success',
    })
    fileState.page = 1;
    getData();
  } else {
    ElNotification({
      title: 'Error',
      type: 'error',
    })
  }
}

// 分页
const handleChange = (page: number) => {
  fileState.page = page;
  getData();
}

onMounted(() => {
  getData();
})

</script>
<template>
  <section class="header">
    <section style="font-weight:bold;">FILE LIST</section>
    <section>
      <el-button type="primary" @click="handleClick">&nbsp;&nbsp;&nbsp;UPLOAD&nbsp;&nbsp;&nbsp;</el-button>
      <input type="file" style="display:none" id="upload" @change="upload" />
    </section>
  </section>
  <section class="data">
    <section
      v-if="fileState.fileList.length == 0"
      style="width:30vw;height:15vh;line-height:15vh;color:#ccc;text-align:center"
    >NO DATA</section>
    <section class="item" v-for="(item, index) in fileState.fileList" :key="index">
      <el-descriptions class="margin-top" :column="3" size="large" border>
        <!-- <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>User
            </div>
          </template>
          Host
        </el-descriptions-item>-->
        <!-- <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <alarm-clock />
              </el-icon>Time
            </div>
          </template>
          2022-03-04
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <folder />
              </el-icon>FileFormat
            </div>
          </template>
          ZIP
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <takeaway-box />
              </el-icon>Size
            </div>
          </template>
          1.42GB
        </el-descriptions-item>-->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <files />
              </el-icon>Filename
            </div>
          </template>
          <span style="min-width:200px;display:inline-block;text-align:center">{{ item }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <section class="action">
        <el-button type="success" @click="download(item)">DOWNLOAD</el-button>
        <el-button type="danger" @click="deleteFile(item)">DELETE</el-button>
      </section>
    </section>
  </section>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="fileState.total"
    :page-size="fileState.size"
    @current-change="handleChange"
    hide-on-single-page
  ></el-pagination>
</template>
<style scoped>
.el-button {
  font-weight: bold;
}
.item,
.header {
  margin: 0 20px;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
}

.el-descriptions {
  margin-right: 50px;
}

.header {
  margin-bottom: 15px;
}
.data {
  margin-bottom: 25px;
}
.el-pagination {
  justify-content: center;
}

.el-icon {
  margin-right: 8px;
}

.data .action {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>