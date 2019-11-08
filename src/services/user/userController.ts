import { db } from "../../utils/db";


export const getAllUsers = async() => await db.any('SELECT * FROM Users');
