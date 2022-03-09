import axios from 'axios';
import { IP } from '../../../config/config';

export const baseUrl = `http://${IP}:7009/api/`;

export function getFiles(page: number, size: number) {
  return axios({
    url: baseUrl + 'files?page=' + page + '&' + 'size=' + size,
    method: 'GET',
  });
}

export function upLoadFile(file: HTMLInputElement) {
  if (!file.files) return;
  const form = new FormData();
  form.append('file', file.files[0]);
  return axios({
    url: baseUrl + 'upload',
    method: 'POST',
    headers: { 'content-type': 'mutipart/form-data' },
    data: form,
  });
}

export function delFile(fileName: string) {
  return axios({
    url: baseUrl + 'delete',
    method: 'POST',
    data: {
      fileName,
    },
  });
}
