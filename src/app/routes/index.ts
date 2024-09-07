import express, { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = express.Router();

const appRoutes: { path: string; routes: Router }[] = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
];

appRoutes.map((route) => router.use(route.path, route.routes));

export const ApplicationRouter = router;
