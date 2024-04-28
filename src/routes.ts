export const publicRoutes = [
    "/",
    "/api/users/customizations/mainPagePhoto",
    "/api/users/customizations/mainPageVideo",
    "/store",
    "/api/users/products",
    "/newVerification",
    "/api/users/newVerification",
    "/resetPassword",
    "/api/users/resetPassword",
    "/newPassword",
    "/api/users/newPassword",
    "/api/users/login",
    "/api/users/signup",
    "/about",
    "/about/contacts",
    "/about/delivery",
    "/about/payment",
    "/about/returns",
    "/about/team",
    "/api/users/messages",
    "/cart",
    "/favorites",
    "/privacyPolice",
    "/api/users/messages",
    "/api/users/promoCode",
    "/api/users/logout",
    "/advertisingPage",
    "/api/users/article",
    "/api/users/articleCategory",
    "/articles"
]

export const adminRoutes = [
    "/adminProducts",
    "/allAdminMessages",
    "/adminProfile/products",
    "/adminProfile/customizations",
    "/adminProfile/promocodes",
    "/adminProfile",
    "/adminStatistics",
    "/allAdminOrders",
    "/api/users/logout"

]

/**ВСЕ ОСТАЛЬНЫЕ РОУТЫ СЧИТАЮТСЯ ПРИВАТНЫМИ*/
export const authRoutes = [
    "/login",
    "/signup",
    "/error",
    "/api/users/login",
    "/api/users/signup",
]

export const adminEmails = [
    "dimonza49@gmail.com","matveytreyvas@gmail.com"
]

export const storePrefix = "/store"

export const articlePrefix = "/article"

export const apiPublicProductPrefix = "/api/users/products"

export const apiAuthPrefix = "/api/auth"

export const apiAdminPrefix = "/api/admin"

export const DEFAULT_USER_LOGIN_REDIRECT = "/profile"

export const DEFAULT_ADMIN_LOGIN_REDIRECT = "/adminProfile"

/**ВСЕ ОСТАЛЬНЫЕ РОУТЫ СЧИТАЮТСЯ ПРИВАТНЫМИ, ТО ЕСТЬ НЕЗАЛОГИНЕННЫЙ ПОЛЬЗОВАТЕЛЬ ТУДА НЕ ПОПАДЕТ*/