import {NextRequest, NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import {v4 as uuidv4} from 'uuid';
import {ICreatePayment, YooCheckout} from '@a2seven/yoo-checkout';
import User from "@/models/userModel";
import PaymentTokenModel from "@/models/paymentTokenModel";

const makePayment = async (totalCost: number, key: string) => {

    const checkout = new YooCheckout({ shopId: "376103", secretKey: "test_jptAvMJ0V6vouYeExI4U-ui5HjNQBk5EDcf9IL-Id5k" });
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
        if(!user){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }
        const userDB = await User.findById(user.id)

        if(!userDB){
            return NextResponse.json({error: "Unauthorized."}, {status: 401})
        }

        const token = await PaymentTokenModel.findOne({userId: user.id, active: true});

        const reqBody = await request.json()
        const {totalCost, idempotenceKey} = reqBody;

        let payment;
        let paymentToken;

        if(token){
            const currentDate = new Date();
            if(token.expiresIn <= currentDate){
                paymentToken = new PaymentTokenModel({
                    userId: user.id,
                    idempotenceKey: uuidv4(),
                });
                const savedToken = await paymentToken.save();
                payment = await makePayment(totalCost, savedToken.idempotenceKey);
            }else if(token.expiresIn > currentDate){
                if(token.active) {
                    payment = await makePayment(totalCost, token.idempotenceKey);
                }else if(!token.active){
                    paymentToken = new PaymentTokenModel({
                        userId: user.id,
                        idempotenceKey: uuidv4(),
                    });
                    const savedToken = await paymentToken.save();
                    payment = await makePayment(totalCost, savedToken.idempotenceKey);
                }
            }
        }else{
            paymentToken = new PaymentTokenModel({
                userId: user.id,
                idempotenceKey: uuidv4(),
            });
            const savedToken = await paymentToken.save();
            payment = await makePayment(totalCost, savedToken.idempotenceKey);
        }


        return NextResponse.json({
            message: "Payment result",
            paymentResult: payment
        });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}