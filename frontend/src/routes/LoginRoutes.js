import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';
import GuestGuard from 'utils/route-guard/GuestGuard';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: 'login',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '',
          element: <AuthLogin />
        }
      ]
    },
    {
      path: 'register',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '',
          element: <AuthRegister />
        }
      ]
    },
    {
      path: 'forgot-password',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '',
          element: <AuthForgotPassword />
        }
      ]
    },
    {
      path: 'check-mail',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '',
          element: <AuthCheckMail />
        }
      ]
    },
    {
      path: 'reset-password',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '',
          element: <AuthResetPassword />
        }
      ]
    },
    {
      path: 'code-verification',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '',
          element: <AuthCodeVerification />
        }
      ]
    }
  ]
};

export default LoginRoutes;
