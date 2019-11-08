import { Request, Response } from 'express';

export default[
    {
        path: "/user",
        method: "get",
        handler: async (req: Request, res: Response) =>{ res.send("Hello You're awesome!"); }
    }
]