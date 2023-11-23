import {Request, Response} from "express";
import {param, validationResult} from "express-validator"
import jwt from "jsonwebtoken"

import User from "../models/userSchema";

//import ResponseHelper from "../helpers/responseHelper"

import {IUser, IUserLogin} from "../types/user"
import {config} from "dotenv";
import userSchema from "../models/userSchema";

/**
 * @param {Request} req
 * @param {Response} res
 * @returns
 */

class UserController {

    async register(req: Request, res: Response) {
        const {name, email, password, role}: IUser = req.body;
        try {
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.json({
                    //res,
                    code: 400,
                    success: false,
                    message: "Failed",
                    data: {}
                });
            }
            const userObj = new User({
                name, email, password, role
            })

            await userObj.save();
            return res.json({
                //res,
                code: 201,
                success: true,
                message: "User registered",
                data: {}
            })
        } catch (error) {
            return res.json({err: error})
        }
    }

    async login(req: Request, res: Response) {
        const {email, password}: IUserLogin = req.body;
        try {
            const erros = validationResult(req);
            if (!erros.isEmpty()) {
                return res.json({
                    //res,
                    code: 400,
                    success: false,
                    message: "Failed",
                    data: {errors: erros.array()},
                })
            }

            const user = await User.findOne({email});

            if (!user) {
                return res.json({
                    //res,
                    code: 404,
                    success: false,
                    message: "Email is invalid",
                    data: {}
                })
            }

            user.comparePassword(password, async (err: any, isMatch: boolean) => {
                if (err || isMatch)
                    return res.json({
                        code: 400,
                        success: false,
                        message: "Password is invalid",
                        data: {}
                    });

                const token = await jwt.sign(
                    {id: user._id, role: user.role},
                    process.env.SECRET_KEY,
                    {expiresIn: '5h'}
                )

                return res.json({
                    //res,
                    code: 200,
                    success: true,
                    message: "Password is valid",
                    data: {token, user: {name: user.name, role: user.role}}
                });
            });
        } catch (error) {
            return res.json({err: error});
        }
    }
}

module.exports = UserController;