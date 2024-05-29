import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { AuthProvider } from 'react-auth-kit';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { useLocalStorage } from '@mantine/hooks';
import { PrivateRoute } from './util/PrivateRoute';
import { allPath, categoryPath, gameStatePath, indexPath, loginPath, mainPagePath, questionPath, registerPath } from './config/InternalPaths';
import { QueryClient, QueryClientProvider } from 'react-query';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from "./pages/QuizBattleHomePage";
import CategorySelectionPage from './pages/game/CategorySelectionPage';
import GameStatePage from './pages/game/GameStatePage';
import QuestionScreen from './pages/game/QuestionPage';
import MainPage from './pages/game/MainPage';


export default function App() {

  const authType = "cookie";
  const authName = "_auth";
  const cookieDomain = window.location.hostname;
  const cookieSecure = window.location.protocol === "https:";

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  
  const queryClient = new QueryClient();

  return (
    
    <AuthProvider authType = {authType} authName={authName} cookieDomain={cookieDomain} cookieSecure={cookieSecure}>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <Notifications />
              <BrowserRouter>
                <Routes>

                  <Route path={indexPath} element={<HomePage></HomePage>}></Route>

                  <Route path={loginPath} element={<LoginPage></LoginPage>}></Route>

                  <Route path={registerPath} element={<RegisterPage></RegisterPage>}></Route>

                  <Route path={mainPagePath} element={
                    <PrivateRoute element={<MainPage></MainPage>}></PrivateRoute>
                  }></Route>

                  <Route path={questionPath} element={
                    <PrivateRoute element={<QuestionScreen></QuestionScreen>}></PrivateRoute>
                  }></Route>

                  <Route path={gameStatePath} element={
                    <PrivateRoute element={<GameStatePage></GameStatePage>}></PrivateRoute>
                  }></Route>

                  <Route path={categoryPath} element={
                    <PrivateRoute element={<CategorySelectionPage></CategorySelectionPage>}></PrivateRoute>
                  }></Route>

                  
                  <Route path={allPath} element={<NotFoundPage></NotFoundPage>}/>

                </Routes>
              </BrowserRouter>
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </AuthProvider>
    
  );
}