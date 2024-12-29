

// file này lưu tất cả các đưuòng dẫn api
const API = {

    base: process.env.NEXT_PUBLIC_API_SERVER,
    user: {
        login: "/user/login",
        register: "/user/register",
        new_access_token: "/user/new_access_token"
    },
    dalogin: {
        ghi: "/dalogin/ghi"
    }

}
export default API