import {connect} from "@/db/db";
import PromoCode from "@/models/promoCodeModel";
import {NextRequest, NextResponse} from "next/server";
import {currentUser, isAdmin} from "@/lib/auth";
connect()


export async function GET(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const allPromoCodes = await PromoCode.find({});
        return NextResponse.json({
            message: "All PromoCodes retrieved successfully",
            promo: allPromoCodes
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json()
        const {title, value, isValid} = reqBody
        const newPromoCode = new PromoCode({title, value, isValid});
        const savedPromoCode = await newPromoCode.save()
        return NextResponse.json({
            message: "PromoCode created successfully",
            promo: savedPromoCode
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json()
        const { promoCodeId } = reqBody
        const deletedPromoCode = await PromoCode.findByIdAndDelete(promoCodeId)
        if (!deletedPromoCode) {
            return NextResponse.json({ message: "PromoCode not found" }, { status: 404 })
        }
        return NextResponse.json({
            message: "PromoCode deleted successfully",
            promo: deletedPromoCode
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {

        const user = await currentUser();

        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        if(user?.isAdmin === false){
            return NextResponse.json({error: "Forbidden. You don't have administrator rights."}, {status: 403})
        }

        const reqBody = await request.json()
        const { promoCodeId, isValid } = reqBody
        const promoCode = await PromoCode.findById(promoCodeId)
        if (!promoCode) {
            return NextResponse.json({ message: "PromoCode not found" }, { status: 404 })
        }
        promoCode.isValid = isValid
        const updatedPromoCode = await promoCode.save()
        return NextResponse.json({
            message: "PromoCode updated successfully",
            promo: updatedPromoCode
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
