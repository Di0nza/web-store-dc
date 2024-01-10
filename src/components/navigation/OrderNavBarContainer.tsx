'use client';
import React from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {OrderProvider} from "@/orderContext/store";

export default function OrderNavBarContainer() {
    const pathname = usePathname();
    return (
        <div className='numbers-container'>
            <Link href={"/placingOrder"}>
                <div className='number-circle' style={{
                    color: `${pathname === "/placingOrder" || "/placingOrder/delivery" || "/placingOrder/payment" ? "#111111" : "#c9c9c9"}`,
                    borderColor: `${pathname === "/placingOrder" || "/placingOrder/delivery" || "/placingOrder/payment" ? "#111111" : "#c9c9c9"}`
                }}
                >1</div>
            </Link>
            <div className='line' style={{
                backgroundColor: `${pathname !== "/placingOrder" ? "#111111" : "#c9c9c9"}`
            }}></div>
            <Link href={"/placingOrder/delivery"}>
                <div className='number-circle' style={{
                    color: `${pathname !== "/placingOrder" ? "#111111" : "#c9c9c9"}`,
                    borderColor: `${pathname !== "/placingOrder" ? "#111111" : "#c9c9c9"}`
                }}>2</div>
            </Link>

            <div className='line' style={{
                backgroundColor: `${pathname === "/placingOrder/payment" ? "#111111" : "#c9c9c9"}`
            }}></div>
            <Link href={"/placingOrder/payment"}>
                <div className='number-circle' style={{
                    color: `${pathname === "/placingOrder/payment" ? "#111111" : "#c9c9c9"}`,
                    borderColor: `${pathname === "/placingOrder/payment" ? "#111111" : "#c9c9c9"}`
                }}>3</div>
            </Link>
        </div>
    )
}
