// "use client";
// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import {useRouter} from "next/navigation";
// import axios from "axios";
// import '../pagesStyle.css'
//
// export default function SignupPage() {
//     const router = useRouter();
//     const [buttonDisabled, setButtonDisabled] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [user, setUser] = useState({
//         email: "",
//         password: "",
//         username: "",
//         createdAt: Date.now(),
//     })
//
//     const onSignup = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.post("/api/users/signup", user);
//             console.log(response.data + 'fefwuiwi');
//             router.push("/profile");
//             setLoading(false);
//             window.location.reload();
//         } catch (error:any) {
//             console.log(error.message);
//         }
//     }
//
//     useEffect(() => {
//         if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
//             setButtonDisabled(false);
//         } else {
//             setButtonDisabled(true);
//         }
//     }, [user]);
//
//
//     return (
//         <div className='signUpBlock'>
//             <h2>{"Регистрация"}</h2>
//             <p className='signUpBlockText'>Уже есть аккаунт? <Link className='loginLink' href="/login">Авторизируйтесь</Link></p>
//             <input
//                 id="username"
//                 type="text"
//                 value={user.username}
//                 onChange={(e) => setUser({...user, username: e.target.value})}
//                 placeholder="Имя"
//             />
//             <input
//                 id="email"
//                 type="text"
//                 value={user.email}
//                 onChange={(e) => setUser({...user, email: e.target.value})}
//                 placeholder="Email"
//             />
//             <input
//                 id="password"
//                 type="password"
//                 value={user.password}
//                 onChange={(e) => setUser({...user, password: e.target.value})}
//                 placeholder="Пароль"
//             />
//             <button
//                 onClick={onSignup}
//                 style={{pointerEvents: buttonDisabled ? "none" : null }}
//             >{buttonDisabled ? "Введите данные" : loading ? "Загрузка..." : "Создать аккаунт"}</button>
//         </div>
//     )
//
// }

"use client";
import React, { useState, useEffect } from "react";
import {SignUpForm} from "@/components/auth/SignUpForm";

export default function SignupPage() {

    return (
        <SignUpForm/>
    )

}
