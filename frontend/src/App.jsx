import ScrollTop from 'components/ScrollTop';
import { AuthProvider } from 'contexts/AuthContext';
import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import ThemeCustomization from 'themes';

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
