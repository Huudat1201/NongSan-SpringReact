import axios from "axios";

export default class ApiService {

    static BASE_URL = "http://localhost:8081";

    // Tự động gắn token vào mỗi API request, để server biết bạn là ai? ví dụ admin/user.
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    // Đăng nhập, nhận token
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data;
    }

    // Đăng ký tài khoản mới
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data;
    }

    // Lấy thông tin user từ token, lúc này phải có header để kiểm soát quyền đăng nhập bạn là ai
    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**CATEGORY */
    // Lấy tất cả danh mục.
    static async getAllCategory() {
        const response = await axios.get(`${this.BASE_URL}/category/get-all`)
        return response.data;
    }

    // Lấy một danh mục theo cái id truyền vào.
    static async getCategoryById(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/category/get-category-by-id/${categoryId}`)
        return response.data;
    }

    // Admin tạo mới danh mục sản phẩm.
    static async createCategory(body) {
        const response = await axios.post(`${this.BASE_URL}/category/create`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    // Admin update danh mục.
    static async updateCategory(categoryId, body) {
        const response = await axios.put(`${this.BASE_URL}/category/update/${categoryId}`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    // Admin xóa danh mục sản phẩm.
    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/category/delete/${categoryId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    /* PRODUCT */
    // Lấy tất cả sản phẩm.
    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/product/get-all`)
        return response.data;
    }

    // Lấy một sản phẩm theo id.
    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-product-id/${productId}`)
        return response.data;
    }

    // Lấy tất cả sản phẩm theo id category.
    static async getAllProductsByCategoryId(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-category-id/${categoryId}`)
        return response.data;
    }

    // Admin thêm sản phẩm.
    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/product/create`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    // Admin sửa sản phẩm.
    static async updateProduct(formData) {
        const response = await axios.put(`${this.BASE_URL}/product/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    // Tìm kím sản phẩm.
    static async searchProducts(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/product/search`, {
            params: { searchValue }
        });
        return response.data;
    }

    // Admin xóa sản phẩm.
    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/product/delete/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    /**ORDEDR */
    // Admin lấy danh sách tất cả đơn hàng.
    static async getAllOrders() {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    // Tạo mới đơn hàng, phải có token đăng nhập.
    static async createOrder(body) {
        const response = await axios.post(`${this.BASE_URL}/order/create`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    // Admin cập nhật trạng thái đơn hàng. Ví dụ từ pending sang shipping.
    static async updateOrderitemStatus(orderItemId, status) {
        const response = await axios.put(`${this.BASE_URL}/order/update-item-status/${orderItemId}`, {}, {
            headers: this.getHeader(),
            params: { status }
        })
        return response.data;
    }

    // Lọc đơn hàng theo itemId.
    static async getOrderItemById(itemId) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: { itemId }
        })
        return response.data;
    }

    // Admin lọc đơn hàng theo trạng thái.
    static async getAllOrderItemsByStatus(status) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: { status }
        })
        return response.data;
    }

    /**ADDRESS */
    static async saveAddress(body) {
        const response = await axios.post(`${this.BASE_URL}/address/save`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    /***AUTHEMNTICATION CHECKER */
    // Kiểm tra xem người dùng có đang đăng nhập hay không? nếu có token thì true, không token thì false.
    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    // Kiểm tra xem người dùng có phải là admin không? Dựa vào role đã lưu trong localStorage khi đăng nhập.
    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    // Đăng xuất người dùng, xóa phiên đăng nhập.
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

}