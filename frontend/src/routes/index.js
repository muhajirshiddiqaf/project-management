import { useRoutes } from 'react-router-dom';

// project import
import ComponentsRoutes from './ComponentsRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ]);
}
