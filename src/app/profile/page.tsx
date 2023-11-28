'use client'
import React,{useState} from 'react';
import Link from 'next/link'
import {useRouter} from "next/navigation";
// import {axios} from 'axios';

export default function ProfilePage() {

    return (
        <div style={{display:'flex', justifyContent:"center", alignItems:'center', flexDirection:'column', minHeight:'100vh'}}>
            <h2 style={{marginBottom:"20px"}}>{"Profile"}</h2>
            <p>Profile Page</p>
        </div>
    )
}
