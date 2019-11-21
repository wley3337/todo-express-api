import { db } from '../../utils/db'

export interface toDoSchemaType{
    id: string
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

export interface CreationToDo{
    listId: number 
    title: string
    description?: string 
    due?: string
}

export const getListToDos = async (list_id: number): Promise<Array<SerializedToDo>> =>{
    const listToDos: Array<toDoSchemaType> = await db.any('SELECT * FROM to_dos WHERE list_id = $1', list_id);

    return listToDos.map(toDo => serializeToDo(toDo))
}


const serializeToDo = (toDo: toDoSchemaType):SerializedToDo => {
    return {
        id: parseInt(toDo.id),
        listId: toDo.list_id,
        title: toDo.title,
        description: toDo.description,
        due: toDo.due 
    }
}

export const destroyToDoById = async (toDoId: number) =>{
   const id = await db.one('DELETE FROM to_dos WHERE id = $1 RETURNING id', toDoId)
   return id 
}

//{ success: true , toDo: new_to_do.serialize }
export const createToDo = async(toDo: CreationToDo) =>{
    const listId = toDo.listId
    const title = toDo.title 
    const description = toDo.description || ""
    const due = toDo.due
    const newToDo:toDoSchemaType = await db.one('INSERT INTO to_dos(list_id, title, description, due, created_at, updated_at) VALUES($1,$2,$3,$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [listId, title, description, due])

    if(newToDo.id){
        return { success: true, toDo: serializeToDo(newToDo)}
    } else {
        return { success: false, errors: { messages: "ToDo did not create"} }
    }
}



//{ success: true, toDoId: delete_params[:id], toDoListId: list_id}
export const deleteToDo = async (toDo: SerializedToDo) => {
    const toDoId = await destroyToDoById(toDo.id)
    const toDoListId = toDo.listId
    if(toDoId.id){
        return { success: true, toDoId: parseInt(toDoId.id), toDoListId: toDoListId }
    } else {
        return { success: false, errors: {messages: "ToDo did not delete"}}
    }
}