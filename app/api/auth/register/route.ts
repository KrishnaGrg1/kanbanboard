import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const {email,password}=await req.json()

        const {data,error}=await supabase.auth.signUp({
            email,password
        })
        if(error){
            return NextResponse.json({
                success:false,
                status:400,
                error:error.message
            })
        }
        return NextResponse.json({
            user:data.user,
            session:data.session
        })
    } catch(e){
        return NextResponse.json({
            success:false,
            status:500,
            error:"Internal server error"
        }
        )
    }
}