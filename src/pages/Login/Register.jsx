import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { registerUser } from '~/apis/index'
import { toast } from 'react-toastify'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    const userData = { username, password, email }

    try {
      await registerUser(userData)
      navigate('/login', { replace: true })
      setUsername('')
      setPassword('')
      setEmail('')
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.data.message === 'Email đã được sử dụng') {
          toast.error('Email đã được sử dụng')
        } else {
          toast.error(error.response.data.message)
        }
      } else {
        toast.error('Registration error: ' + error.message)
      }
      toast.error('Registration error:', error)
      setUsername('')
      setPassword('')
      setEmail('')
    }
  }
  const handleBack = () => {
    navigate('/login')
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
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleRegister}
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
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Register
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
      </Paper>
    </Box>
  )
}

export default Register
