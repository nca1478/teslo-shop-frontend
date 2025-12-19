// HTTP Client
export { httpClient, HttpClient } from "../http-client";
export type { ApiResponse } from "../http-client";

// Auth Service
export { authService, AuthService } from "./auth.service";
export type { LoginRequest, LoginResponse, RegisterRequest } from "./auth.service";

// Products Service
export { productsService, ProductsService } from "./products.service";
export type {
    GetProductsRequest,
    Product,
    GetProductsResponse,
    CreateProductRequest,
    UpdateProductRequest,
} from "./products.service";

// Countries Service
export { countriesService, CountriesService } from "./countries.service";

// Categories Service
export { categoriesService, CategoriesService } from "./categories.service";
export type { Category } from "./categories.service";

// Addresses Service
export { addressesService, AddressesService } from "./addresses.service";
export type {
    UserAddress,
    SetUserAddressRequest,
    SetUserAddressResponse,
    DeleteUserAddressResponse,
} from "./addresses.service";

// Orders Service
export { ordersService, OrdersService } from "./orders.service";
export type {
    ProductToOrder,
    OrderItem,
    OrderItemProduct,
    ProductImage,
    OrderAddress,
    PlaceOrderItemDto,
    PlaceOrderAddressDto,
    PlaceOrderRequest,
    Order,
    PlaceOrderResponse,
    GetPaginatedOrdersResponse,
} from "./orders.service";

// Users Service
export { usersService, UsersService } from "./users.service";
export type {
    User as ApiUser,
    GetPaginatedUsersRequest,
    GetPaginatedUsersResponse,
    ChangeUserRoleRequest,
    ChangeUserRoleResponse,
} from "./users.service";

// Payments Service
export { paymentsService, PaymentsService } from "./payments.service";
export type {
    SetTransactionIdRequest,
    PayPalCheckPaymentRequest,
    PaymentResponse,
} from "./payments.service";
