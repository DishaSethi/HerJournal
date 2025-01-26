const { default: axios } = require("axios");

const axiosInstance= axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials:true,
});

axiosInstance.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if(error.response && error.response.status===401){
            window.location.href='/';
        }
        return Promise.reject(error);
    }
);
module.exports = axiosInstance; 