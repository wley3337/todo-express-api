import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()
// , { algorithm: 'HS256', expiresIn:'1d' }

export const checkJWT = (router: Router) =>{
    router.use(
        (req: Request, res: Response, next: NextFunction) =>{
            const path = req.path;
            const method = req.method;
        //non-auth route for user sign-up or login
        if(method === "POST" && (path === '/users' || path === '/users/new')){
            
            next();
        }else {
            const rawToken = <string>req.headers["authorization"];
            const token = rawToken.split(" ")[1];
            
            const key:any = process.env.SECRET_KEY;
            let jwtPayload;
            try{
               
                jwtPayload = <any>jwt.verify(token, key);
                res.locals.jwtPayload = jwtPayload;
                console.log("jwt payload: ", res.locals.jwtPayload.user_id);
            }catch(err){
                res.status(401).send();
                return; 
            }
            next();

        }
        }
    )
}
