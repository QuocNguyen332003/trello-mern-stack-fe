import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from '../provider/authProvider'
import { ProtectedRoute } from './ProtectedRoute'
import Login from '~/pages/Login/Login'
// import Logout from '~/pages/Logout/Logout'
import Board from '~/pages/Boards/_id' // Ensure you have this page/component
import Register from '~/pages/Login/Register'
import Welcome from '~/pages/Welcome/Welcome'

const Routes = () => {
  const { token } = useAuth()

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: '/',
      element: <Welcome />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    }
  ]

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: token ? <Navigate to="/board" /> : <Navigate to="/login" />
    },
    {
      path: '/board',
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: '',
          element: <Board /> // Redirect authenticated users to /board
        }
      ]
    }
  ]

  // Combine routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForAuthenticatedOnly
  ])

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />
}

export default Routes
