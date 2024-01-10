// "use client";
// import Link from "next/link";
// import React, {useState, useEffect} from "react";
// import {useRouter} from "next/navigation";
// import axios from "axios";
// import '../pagesStyle.css'
// import googleLogo from '../../img/pngwinggoogleLogo.png'
// import Image from "next/image";
//
//
//
// export default function LoginPage() {
//     const router = useRouter();
//     const [user, setUser] = useState({
//         email: "",
//         password: "",
//
//     })
//     const [buttonDisabled, setButtonDisabled] = useState(false);
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(false);
//
//
//     const onLogin = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.post("/api/users/login", user);
//             console.log(response.data);
//             router.push(response.data.isAdmin ? "/adminProfile" : "/profile")
//         } catch (error:any) {
//             console.log(error.message);
//             setError(error.message)
//         } finally{
//             setLoading(false);
//         }
//     }
//
//     useEffect(() => {
//         if(user.email.length > 0 && user.password.length > 0) {
//             setButtonDisabled(false);
//         } else{
//             setButtonDisabled(true);
//         }
//     }, [user]);
//
//     return (
//         <div className='signUpBlock'>
//             <h2>{"Авторизация"}</h2>
//             <p className='signUpBlockText'>Ещё нет аккаунта? <Link className='loginLink' href="/signup">Зарегистрируйтесь</Link></p>
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
//             <button onClick={onLogin}
//                     style={{pointerEvents: buttonDisabled ? "none" : null }}
//             >{buttonDisabled ? "Введите данные" : loading ? "Загрузка..." : "Войти в аккаунт"}</button>
//             <div className='googleLogin' onClick={onLogin}>
//                 <p>Авторизироваться с помощью <Image className='Google-logo' src={googleLogo} alt={'Google'}></Image></p>
//             </div>
//             {error && (
//                 <p className='errorMessage'>{error}</p>
//             )}
//         </div>
//     )
//
// }



"use client";
import React from "react";
import {LoginForm} from "@/components/auth/LoginForm";
export default function LoginPage() {
    return (
       <LoginForm/>
    )

}



