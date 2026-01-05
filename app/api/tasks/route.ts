import { supabase } from "@/lib/supabase/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
    try{
        const authHeader=req.headers.get('authorization')
        if(!authHeader){
            return NextResponse.json({
                status:400,
                success:false,
                error:"Unauthorized user"
            })
        }
        const token=authHeader.replace("Bearer",'');
        const {data,error}=await supabase.auth.getUser(token);
        if (error || !data){
            return NextResponse.json({
                   status:400,
                success:false,
                error:"Unauthorized user"
            })
        }
        // const 
    }catch(e){
        return NextResponse.json({
            status:500,
            success:false,
            error:"Internal server error"
        })
    }
}