import { db } from "../../utils/db";
import dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { getUserListsById } from "../lists/listsController";

dotenv.config();
// use: const key = process.env.SECRET_KEY

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
//schema:
// id             
// first_name 
// last_name 
// username 
// password_digest <-- ruby default salt value (cost) seems to be 12 
// created_at  
// updated_at


export const getAllUsers = async() => await db.any('SELECT * FROM Users');

// create user -- username must be unique
export const createUser = async(newUser: CreateUser) =>{

    const newUsername = newUser.username;
    const userExists:Array<UserSchema> = await db.any('SELECT * FROM Users WHERE username = $1', newUsername)


    if(userExists.length > 0){
    console.log('userExists: ', userExists);
    const saltRounds = "12";
    const hash = userExists[0].password_digest
    let result = await authenticatePassword("12", hash)
    
    console.log("stuffds", result.success)
    // const createdUser = await db.one('INSERT INTO users (first_name, last_name, username, password_digest), VALUES $1, $2, $3, $4',[newUser.firstName, newUser.lastName, newUser.username,] )

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
            const userLists = await getUserListsById(existingUser.id)
            return { success: true, user: existingUser, lists: userLists };
        } else {
            return { success: false, errors: { messages: "Wrong username or password" } };
        }
    }
}
// get a user by jwt token


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

