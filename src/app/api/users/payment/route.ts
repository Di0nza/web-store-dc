import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import {v4 as uuidv4} from 'uuid';
import {ICreatePayment, YooCheckout} from '@a2seven/yoo-checkout';
import User from "@/models/userModel";

const makePayment = async (totalCost: number, key: string) => {

    const checkout = new YooCheckout({shopId: "376103", secretKey: "test_jptAvMJ0V6vouYeExI4U-ui5HjNQBk5EDcf9IL-Id5k"});
    const idempotenceKey = key;
    const totalCostString = (totalCost * 99.5).toString();

    const createPayload: ICreatePayment = {
        amount: {
            value: totalCostString,
            currency: 'RUB'
        },
        confirmation: {
            type: 'embedded',
        }
    };

    try {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        console.log(payment)
        return payment;
    } catch (error) {
        console.error(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }
        const userDB = await User.findById(user.id)

        if (!userDB) {
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }
        const reqBody = await request.json();
        const {totalCost, idempotenceKey} = reqBody;
        if(!totalCost || !idempotenceKey){
            return NextResponse.json({error: "Ошибка оплаты заказа. Пройдите этап оформления заказа еще раз!"});
        }

        let payment;

        payment = await makePayment(totalCost, idempotenceKey);

        return NextResponse.json({
            message: "Payment result",
            paymentResult: payment
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}