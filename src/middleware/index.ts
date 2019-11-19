import{
   handleBodyRequestParsing,
   handleCompression,
   handleCors 
} from './common';
import { checkJWT } from './jwt';


export default [ handleBodyRequestParsing, handleCompression, handleCors, checkJWT];