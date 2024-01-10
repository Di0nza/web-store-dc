export const publicRoutes = [
    "/",
    "/store",
    "/api/users/products",
    "/signup",
    "/newVerification",
    "/api/users/newVerification",
    "/resetPassword",
    "/api/users/resetPassword",
    "/newPassword",
    "/api/users/newPassword",
    "/api/users/customizations/mainPagePhoto",
    "/api/users/login",
    "/api/users/signup",
]



export const adminRoutes = [
    "/adminProfile/products"
]

/**ВСЕ ОСТАЛЬНЫЕ РОУТЫ СЧИТАЮТСЯ ПРИВАТНЫМИ*/

export const authRoutes = [
    "/login",
    //"/signup",
    "/error",

]

export const adminEmails = [
    "dimonza49@gmail.com"
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_USER_LOGIN_REDIRECT = "/profile"

export const DEFAULT_ADMIN_LOGIN_REDIRECT = "/adminProfile"



/**ВСЕ ОСТАЛЬНЫЕ РОУТЫ СЧИТАЮТСЯ ПРИВАТНЫМИ, ТО ЕСТЬ НЕЗАЛОГИНЕННЫЙ ПОЛЬЗОВАТЕЛЬ ТУДА НЕ ПОПАДЕТ*/
