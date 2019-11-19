import { db } from "../../utils/db";
import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { getUserListsById } from "../lists/listsController";
import { generateJWT } from "../../middleware/jwt";

dotenv.config();
// use: const key = process.env.SECRET_KEY

// JWT USER_ID FROM TOKEN: res.locals.jwtPayload.user_id

//   //The token is valid for 1 hour
//   //We want to send a new token on every request
//   const { userId, username } = jwtPayload;
//   const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
//     expiresIn: "1h"
//   });
//   res.setHeader("token", newToken);

//   //Call the next middleware or controller
//   next();
// };

interface CreateUser{
    firstName: string
    lastName: string 
    username: string 
    password: string 
}

interface ExistingUserType{
    username: string
    password: string 
}

interface UserSchema{
id: number
first_name : string
last_name:string 
username:string 
password_digest:string // <-- ruby default salt value (cost) seems to be 12 
created_at: Date  
updated_at: Date
}

interface responseType{
    success: boolean
    error?: any
}

interface bcryptHashResponseType{
    success: boolean
    passwordDigest?: string
    error?: any
}
interface serializedUserType{
    firstName: string
    lastName: string
    username: string
}
//schema:
// id
// first_name 
// last_name 
// username 
// password_digest <-- ruby default salt value (cost) seems to be 12 
// created_at  
// updated_at


export const getAllUsers = async() => await db.any('SELECT * FROM Users');

export const getUser = async(userId: number) => await db.one('SELECT * FROM users WHERE id = $1', userId)

// create user -- username must be unique
export const createUser = async(newUser: CreateUser) =>{
    const newUsername = newUser.username;
    //check to see if the username is taken
    const userExists:Array<UserSchema> = await db.any('SELECT * FROM users WHERE username = $1', newUsername);
    if(userExists.length === 0){
        const passwordDigestResponseObj = await createPasswordDigest(newUser.password);
        if( passwordDigestResponseObj.success ){
            const createdUser = await db.one('INSERT INTO users(first_name, last_name, username, password_digest, created_at, updated_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',[newUser.firstName, newUser.lastName, newUser.username, passwordDigestResponseObj.passwordDigest ] )
            const token = generateJWT({ user_id: createdUser.id });
            const user = serializeUser(createdUser)
            return { success: true,  user: { user: user, lists: []}, token: token  };
            
        }else {
            return { success: false, errors: { messages: ['An error occured creating your password']}}
        }
        
    } else {
        return {success: false, errors: {messages: ['Username is taken, please choose another.']}}
    }

}


// get a user by username
export const loginUser = async (userToLogin: ExistingUserType) => {
    const username:string = userToLogin.username
    const password:string = userToLogin.password
    const existingUser:UserSchema = await db.one('SELECT * FROM Users WHERE username = $1', username)
    if(existingUser){
        const existingHash = existingUser.password_digest 
        const authenticated = await authenticatePassword( password, existingHash )
        if(authenticated.success){
            const token = generateJWT({ user_id: existingUser.id });
            const userLists = await getUserListsById(existingUser.id);
            const user = serializeUser(existingUser)
            return { success: true,  user: { user: user, lists: userLists}, token: token  };
        } else {
            return { success: false, errors: { messages: "Wrong username or password" } };
        }
    }
}

//helper functions:

const authenticatePassword = async (password:string, hash:string) =>{
  const response = await new Promise<responseType>( (resolve, reject) =>{
    bcrypt.compare( password, hash, function(err,res){
        if(res == true){
            return resolve({ success: true })
        }else{
            return resolve({ success: false, error: err } )
        }
    })}
  );

  return response
};

const createPasswordDigest = async (password:string) =>{
    const passwordDigestResponse = await new Promise<bcryptHashResponseType>( (resolve, reject) =>{
        bcrypt.hash( password, 12, (err, hash) =>{
            if(hash){
                return resolve({ success: true, passwordDigest: hash })
            } else {
                return resolve({ success: false, error: err })
            }
        } )
    });
    return passwordDigestResponse;
}

const serializeUser =  (user: UserSchema): serializedUserType =>{
    return {firstName: user.first_name, lastName: user.last_name, username: user.username }
}

