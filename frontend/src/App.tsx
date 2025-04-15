import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux'
import { store } from './store';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard.tsx'
import Profile from './pages/Profile.tsx'
import Products from './pages/Products.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<Profile resetPassword={true} />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard><Products/></Dashboard>
                </PrivateRoute>
              }
            />
            <Route path="/profile" element={
              <PrivateRoute>
                <Dashboard><Profile resetPassword={false}/></Dashboard>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
