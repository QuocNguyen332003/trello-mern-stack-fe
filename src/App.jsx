import AuthProvider from '~/provider/authProvider'
import Routes from '~/routes/index'

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App
