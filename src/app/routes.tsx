import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import { NotFound } from '@app/NotFound/NotFound';
import DefaultList from './DemoPages/DefautList';
import DetachedConfig from './DemoPages/DetachedConfig';
import Multiple from './DemoPages/Multiple';
import Errors from './DemoPages/Errors';
import OnlyLoadMore from './DemoPages/OnlyLoadMore';
import Drawer from './DemoPages/Drawer';
import ChangeUrl from './DemoPages/ChangeURL';
import About from './About';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <DefaultList />,
    exact: true,
    label: 'Default List',
    path: '/',
    title: 'Infinite Scroll | Default List',
  },
  { element:<OnlyLoadMore />,
    exact: true,
    label: 'Only Load More',
    path: '/only-load-more',
    title: 'Infinite Scroll | Only Load More',
  },
  {
    element: <Drawer />,
    exact: true,
    label: 'Drawer',
    path: '/drawer',
    title: 'Infinite Scroll | Drawer Demo',
  },
  {
    element: <DetachedConfig />,
    exact: true,
    label: 'Detached Config',
    path: '/detached-config',
    title: 'Infinite Scroll | Detached Config',
  },
  {
    element: <Multiple />,
    exact: true,
    label: 'Multiple feeds',
    path: '/multiple',
    title: 'Infinite Scroll | Multiple feeds on a page',
  },
  {
    element: <Errors />,
    exact: true,
    label: 'Errors',
    path: '/errors',
    title: 'Infinite Scroll | Errors',
  },
  { element: <ChangeUrl />,
    exact: true,
    label: 'Change URL',
    path: '/change-url',
    title: 'Infinite Scroll | Change URL',
  },
  {element: <About />,
    exact: true,
    label: 'About',
    path: '/about',
    title: 'Infinite Scroll | About',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
