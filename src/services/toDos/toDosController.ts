import { db } from '../../utils/db'

export interface toDoSchemaType{
    id: number
    list_id: number 
    title: string 
    description: string | null 
    due: Date
    created_at: Date
    updated_at: Date
}

export interface SerializedToDo{
    id: number
    listId: number 
    title: string 
    description: string | null 
    due: Date
}

export const getListToDos = async (list_id: number): Promise<Array<SerializedToDo>> =>{
    const listToDos: Array<toDoSchemaType> = await db.any('SELECT * FROM to_dos WHERE list_id = $1', list_id);

    return listToDos.map(toDo => serializeToDo(toDo))
}


const serializeToDo = (toDo: toDoSchemaType):SerializedToDo => {
    return {
        id: toDo.id,
        listId: toDo.list_id,
        title: toDo.title,
        description: toDo.description,
        due: toDo.due 
    }
}

export const destroyToDoById = async (toDoId: number) =>{
    await db.one('DELETE FROM to_dos WHERE id = $1 RETURNING id', toDoId)
    return true 
}