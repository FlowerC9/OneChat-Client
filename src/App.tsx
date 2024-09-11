import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Protected } from './components/auth/Protected';
import { RecoverPrivateKeyForm } from './components/auth/RecoverPrivateKeyForm';
import { AuthLayout } from './components/layout/AuthLayout';
import { RootLayout } from './components/layout/RootLayout';
import { Modal } from './components/shared/Modal';
import usePrivateKeyCheck from './hooks/useAuth/usePrivateKeyCheck';
import { useUpdateLogin } from './hooks/useAuth/useUpdateLogin';
import { useInitializeIndexDb } from './hooks/useUtils/useInitializeIndexDb';
import { useSetTheme } from './hooks/useUtils/useSetTheme';
import { ChatPage, ForgotPasswordPage, LoginPage, NotFoundPage, OAuthRedirectHandlerPage, PrivateKeyRecoveryVerificationPage, ResetPasswordPage, SignupPage, VerificationPage } from './pages';
import { useCheckAuthQuery } from './services/api/authApi';
import { selectLoggedInUser } from './services/redux/slices/authSlice';
import { selectRecoverPrivateKeyForm } from './services/redux/slices/uiSlice';
import { useAppSelector } from './services/redux/store/hooks';

export const App = () => {
  const recoverPrivateKeyForm = useAppSelector(selectRecoverPrivateKeyForm);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const { isSuccess, data, isFetching } = useCheckAuthQuery();

  useSetTheme();
  useUpdateLogin(isSuccess, data);
  useInitializeIndexDb();
  usePrivateKeyCheck(isSuccess, data);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <Protected loggedInUser={loggedInUser}>
              <RootLayout />
            </Protected>
          }
        >
          <Route index element={<ChatPage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="signup"
            element={
              <Protected loggedInUser={loggedInUser} authorized={false}>
                <SignupPage />
              </Protected>
            }
          />
          <Route
            path="login"
            element={
              <Protected loggedInUser={loggedInUser} authorized={false}>
                <LoginPage />
              </Protected>
            }
          />
          <Route
            path="forgot-password"
            element={
              <Protected loggedInUser={loggedInUser} authorized={false}>
                <ForgotPasswordPage />
              </Protected>
            }
          />
          <Route
            path="reset-password"
            element={
              <Protected loggedInUser={loggedInUser} authorized={false}>
                <ResetPasswordPage />
              </Protected>
            }
          />
          <Route
            path="verification"
            element={
              <Protected loggedInUser={loggedInUser} authorized={true}>
                <VerificationPage />
              </Protected>
            }
          />
          <Route
            path="temp-token/:tempToken"
            element={
              <Protected loggedInUser={loggedInUser} authorized={false}>
                <OAuthRedirectHandlerPage />
              </Protected>
            }
          />
          <Route
            path="/auth"
            element={<Navigate to={"/auth/login"} replace />}
          />
        </Route>

        <Route
          path="/auth/privatekey-verification/:recoveryToken"
          element={<PrivateKeyRecoveryVerificationPage />}
        />

        {/* Catch-all route for 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return isFetching ? (
    ""
  ) : (
    <>
      {recoverPrivateKeyForm && (
        <Modal isOpen={recoverPrivateKeyForm} onClose={() => ""}>
          <RecoverPrivateKeyForm />
        </Modal>
      )}
      <RouterProvider router={router} />
    </>
  );
};

