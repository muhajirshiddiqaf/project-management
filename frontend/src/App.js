// project import
import Snackbar from 'components/@extended/Snackbar';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import AuthRedirect from 'components/AuthRedirect';

// auth provider
import { AuthProvider } from 'contexts/AuthContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <RTLLayout>
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <AuthRedirect>
              <>
                <Routes />
                <Snackbar />
              </>
            </AuthRedirect>
          </AuthProvider>
        </ScrollTop>
      </Locales>
    </RTLLayout>
  </ThemeCustomization>
);

export default App;
