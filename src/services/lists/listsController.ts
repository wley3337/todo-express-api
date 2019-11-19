import { db } from '../../utils/db'
import { getListToDos, SerializedToDo, destroyToDoById } from '../toDos/toDosController'
import { serializeUser } from '../users/usersController'

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

interface CreateListType{
    heading: string 
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

//{ success: true, list: serializedList } 
export const createList = async( list: CreateListType, userId: number ) =>{ 
    const createdList:ListSchemaType = await db.one('INSERT INTO lists(heading, user_id, display_order, created_at, updated_at) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [ list.heading, userId, 0 ] )

    if(createdList.id ){
        const newSerializedList = await serializeList(createdList)
        console.log(newSerializedList)
        return { success: true, list: newSerializedList }
    } else {
        return { success: false, errors: {messages: "List did not save"}}
    }
}

//{ success: true, list: serializedList }
//not sure how to handle db errors here and if I'm creating a race condition with the db calls. 
export const deleteList = async( listId: number ) => {
    //get current list
    const list = await db.one('SELECT * FROM lists WHERE id = $1 LIMIT 1', listId);
    if(list.id){
        //serialize list for return 
        const listToReturn = await serializeList(list)
        //destroy all toDos associated with this list
        listToReturn.toDos.forEach(async toDo => await destroyToDoById(toDo.id))
        //destroy list 
        await db.one('DELETE FROM lists WHERE id = $1 RETURNING id', listId)
        //return
        return { success: true, list: listToReturn }
    } else {
        return { success: false, errors: { messages: "List did not delete" }}
    }
}
