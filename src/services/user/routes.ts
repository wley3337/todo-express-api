import { Request, Response } from 'express';
import { getAllUsers } from './userController';


export default[
    {
        path: "/users",
        method: "get",
        handler: async (req: Request, res: Response) =>{ 
            //you need to await the db poll before returning the results
            const allUsers = await getAllUsers();
            res.json(allUsers); 
        }
    }
]




