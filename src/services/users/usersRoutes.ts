import { Request, Response } from 'express';
import { getAllUsers, createUser, loginUser } from './usersController';

const testUserCreate = {
    firstName: "testWill",
    lastName: "testLey",
    username: "test123",
    password: "123"
}

const testLoginUser ={
    username: "wley3337",
    password: "123"
}

const badUserLogin = {
    username: "wley3337",
    password: "12"
}
export default[
    {
        path: "/users",
        method: "get",
        handler: async (req: Request, res: Response) =>{ 
            //you need to await the db poll before returning the results
            const allUsers = await getAllUsers();
            res.json(allUsers); 
        }
    },
    {
        path: "/users/new",
        method: "post",
        handler: async (req: Request, res: Response) =>{ 
            //you need to await the db poll before returning the results
            // const allUsers = await getAllUsers();
            const user = await createUser(testUserCreate)
            res.json(user); 
        }
    },
    {
        path: "/users",
        method: "post",
        handler: async(req: Request, res: Response) =>{
            const user= await loginUser(req.body.user);
            res.json(user)
        }
    }
]




