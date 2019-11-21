import { Request, Response } from 'express';
import { createList, deleteList } from './listsController';


export default[
    {
        path: "/lists",
        method: "post",
        handler: async (req: Request, res: Response) =>{
            const userId = parseInt(res.locals.jwtPayload.user_id);
            const userAndNewList = await createList(req.body.list, userId)
            res.json( userAndNewList )
        }
    },
    {
        path: "/lists/:id",
        method: "delete",
        handler: async (req: Request, res: Response) =>{
            const listId = parseInt(req.body.list.id)
            const deletedList = await deleteList(listId)
            res.json( deletedList )
        }
    },
]