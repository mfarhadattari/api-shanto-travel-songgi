import express, { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { TripRoutes } from '../modules/trip/trip.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { MetadataRoutes } from '../modules/metadata/metadata.route';

const router = express.Router();

const appRoutes: { path: string; routes: Router }[] = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/trips',
    routes: TripRoutes,
  },
  {
    path: '/admin',
    routes: AdminRoutes,
  },
  {
    path: '/meta',
    routes: MetadataRoutes,
  },
];

appRoutes.map((route) => router.use(route.path, route.routes));

export const ApplicationRouter = router;
