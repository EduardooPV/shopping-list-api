import { RouteRegister } from './register-routes';
import { Router } from './router';

const router = new Router();
const routeRegister = new RouteRegister(router);

routeRegister.registerAll();

export { router };
