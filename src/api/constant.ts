/**
 * List các service logging trên console (nên hạn chế số lượng)
 */
export const SERVICE_DEBUG: string[] = ['fetchProductInfo', 'auth/login', 'products/filter'];

/**
 * Define error code cho các TH không có status trả về từ axios
 */
export enum ERROR_CODE {
    NO_NETWORK = -1,
    TIME_OUT = -2,
    SERVER_ERR = -3,
    CANCELED = -4,
}
