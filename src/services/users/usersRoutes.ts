import { Request, Response } from 'express';
import { getAllUsers, createUser, loginUser, getUser } from './usersController';

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
// JWT USER_ID FROM TOKEN: parseInt(res.locals.jwtPayload.user_id)
export default[
    {
        path: "/users/show",
        method: "get",
        handler: async (req: Request, res: Response) =>{ 
            const userId = parseInt(res.locals.jwtPayload.user_id);
            const allUsers = await getUser(userId);
            res.json(allUsers); 
        }
    },
    {
        path: "/users",
        method: "get",
        handler: async (req: Request, res: Response) =>{ 
            //you need to await the db poll before returning the results
            const allUsers = await getAllUsers();
            res.json({allUsers: allUsers}); 
        }
    },
    {
        path: "/create-user",
        method: "post",
        handler: async (req: Request, res: Response) =>{ 
            const user = await createUser(req.body.user);
            res.json(user); 
        }
    },
    {
        path: "/login",
        method: "post",
        handler: async(req: Request, res: Response) =>{
            const user= await loginUser(req.body.user);
            res.json(user)
        }
    }
]




