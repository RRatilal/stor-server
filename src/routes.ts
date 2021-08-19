import { Router } from 'express';

import UsersController from './controllers/UsersController';
import ClassroomsController from './controllers/ClassroomsController';
import RefreshToken from './controllers/RefreshToken';

import middleware from './middlewares/auth';
import ConnectionsController from './controllers/ConnectionsController';

import uploadConfig from './config/multer'
import multer from 'multer';

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/login', UsersController.index);
routes.post('/logup', UsersController.create);
routes.post('/forgot-password/', UsersController.forgotPassword);
routes.post('/reset-password/', UsersController.resetPassword);
routes.post('/refreshtoken', RefreshToken.create);

// routes.use(middleware);

routes.get('/update-user/:userId', UsersController.getUpdatedData)
routes.put('/update-user/:userId', upload.single('image'), UsersController.update)

routes.get('/classroom', ClassroomsController.show)
routes.post('/classroom/:userId', ClassroomsController.create)

routes.get('/connections', ConnectionsController.index)
routes.post('/connections', ConnectionsController.create)

export default routes;