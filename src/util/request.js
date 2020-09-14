import axios from "axios";
import qs from "qs";
import VueRouter from 'vue-router';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
 
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response)
  
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  // console.log(error.response.status)
  
});

const get = (url, parms = {}) => {
  return axios.get(url, { params: parms });
}

const post = (url, parms = {}) => {
  parms = qs.stringify(parms);
  return axios.post(url, parms);
}

export { get, post }