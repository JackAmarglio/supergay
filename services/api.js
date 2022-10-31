import axios from 'axios'
import settings from 'settings';

const instance = axios.create({
	baseURL: settings && settings.backend,
	timeout: 20000
})

instance.interceptors.request.use(
  function(config) {
    const publictoken = localStorage.getItem("publictoken"); 
    const authenticationkey = localStorage.getItem("authenticationkey");
    if (publictoken && authenticationkey) {
      config.headers["publictoken"] = publictoken;
      config.headers["authenticationkey"] = authenticationkey;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

instance.defaults.headers.common.Accept = 'application/json'

export default instance