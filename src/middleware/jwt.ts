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
            if(method === "POST" && (path === '/login' || path === '/create-user')){
                next();
            } else {
                const rawToken = <string>req.headers["authorization"];
                if(rawToken){
                    const token = rawToken.split(" ")[1];
                    const key:any = process.env.SECRET_KEY;
                    let jwtPayload;
                    try{
                        jwtPayload = <any>jwt.verify(token, key);
                        res.locals.jwtPayload = jwtPayload;
                    }
                    catch(err){
                        res.status(401).send();
                        return; 
                    }
                    next();
                } else {
                    res.status(401).send();
                    return
                }
            }
        }
    )
}

export const generateJWT = (payload: any ) =>{
    const key:any = process.env.SECRET_KEY
    const token = jwt.sign(payload, key); //<-- default is `HS256` which is what is used on Rails API as well
    return token;
}
