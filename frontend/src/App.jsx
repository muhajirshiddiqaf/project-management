import { RouterProvider } from 'react-router-dom';

// project imports
import { AuthProvider } from 'contexts/AuthContext';
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <AuthProvider>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </AuthProvider>
    </ThemeCustomization>
  );
}
