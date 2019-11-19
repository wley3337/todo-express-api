import { Request, Response } from 'express';
import { CreationToDo, createToDo, SerializedToDo, deleteToDo } from './toDosController';


export default [
    {
        path: "/to_dos/",
        method: "post",
        handler: async (req: Request, res: Response) =>{ 
            const toDo: CreationToDo = req.body.to_do
            const newToDo = await createToDo(toDo);
            res.json(newToDo); 
        }
    },
    {
        path: "/to_dos/:id",
        method: "delete",
        handler: async (req: Request, res: Response) =>{ 
            const toDo: SerializedToDo = req.body.to_do
            const deletedToDo = await deleteToDo(toDo);
            res.json(deletedToDo); 
        }
    },
]