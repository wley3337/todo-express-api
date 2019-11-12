import { db } from '../../utils/db'
import { getListToDos, SerializedToDo } from '../toDos/toDosController'

interface ListSchemaType{
    id: number
    user_id: number
    heading: string 
    display_order: number
    created_at: Date  
    updated_at: Date
}

interface SerializedListType{
    id: number 
    heading: string 
    toDos: Array<SerializedToDo>
}

export const getUserListsById = async (userId: number) =>{
    const userLists: Array<ListSchemaType> = await db.any('SELECT * FROM lists WHERE user_id = $1', userId)
    //when mapping with async functions you need to wrap the map in a promise.all since each
    //iteration of the map returns a promise object, you need to wait until all promise objects 
    //have resolved.
    return Promise.all( userLists.map( async list => await serializeList(list)) ) 
}

const serializeList = async( list: ListSchemaType ):Promise<SerializedListType>=>{
    const listToDos:Array<SerializedToDo> = await getListToDos(list.id)
    return {
        id: list.id,
        heading: list.heading,
        toDos: listToDos
    }
}