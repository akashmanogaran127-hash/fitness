import {Router} from 'express'; import {auth} from '../middleware/auth.js'; import {list,create,getOne,update,remove} from '../controllers/workout.controller.js';
const r=Router();r.use(auth);r.get('/',list);r.post('/',create);r.get('/:id',getOne);r.put('/:id',update);r.delete('/:id',remove);export default r;
