import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useAuth } from '~/provider/authProvider'
import { toast } from 'react-toastify'
import { loginUser } from '~/apis'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const userData = { username, password }

    try {
      const data = await loginUser(userData)
      console.log(data)
      localStorage.setItem('accessToken', data.accessToken)
      setToken(data.accessToken) // Assuming the token is returned in the response data
      console.log(data.accessToken)
      navigate('/board', { replace: true })
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Invalid credentials')
      setUsername('')
      setPassword('')
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#1976d2',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          maxWidth: { xs: '100%', sm: 400 },
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: { xs: 1, sm: 6 }
        }}
      >
        <Typography variant="h4" align="center" mb={3} color="primary">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleBack}
            sx={{ mt: 1 }}
          >
            Back to Welcome
          </Button>
        </Box>
        <Typography variant="body2" align="center" mt={2}>
          Dont have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Login
