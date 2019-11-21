import usersRoutes from './users/usersRoutes'
import listsRoutes from './lists/listsRoutes'
import toDosRoutes from './toDos/toDosRoutes'

export default [...usersRoutes, ...listsRoutes, ...toDosRoutes]