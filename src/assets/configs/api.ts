

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
    },
    category:{
        getAll: "/categories/get"
    },
    product:{
        getAll: "/product/getall",
        // query_semantic: "/product/getall",
        getDetail: "/product/getdetail/"
    },
    media:{
        avtatar: "/media/avatar/",
        product: "/media/products",
    }

}
export default API