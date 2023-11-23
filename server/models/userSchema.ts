import { Schema, model, connect } from 'mongoose';
import {IUser} from "../types/user";
import bcrypt from "bcrypt";



const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:["admin", "user"],
        default:"user"
    }
});

//перед сохранением хэширует пароль
userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified("password")) return next();
    if(user.isModified("password")){
        bcrypt.genSalt(10, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
});

// проверяет пароль
// userSchema.methods.comparePassword = function (
//     candidatePassword: string,
//     cb:(arg: any, isMatch?: boolean)=> void
// ){
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
//         if(err) return cb(err);
//         cb(null, isMatch);
//     });
// };

const User = model('User', userSchema);

export default User;