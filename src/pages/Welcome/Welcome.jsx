import { Box, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <StyledBox>
      <ContentWrapper>
        <HeroText variant="h2" mb={2} align="center">
          Welcome to Our App
        </HeroText>
        <SubText variant="h6" mb={4} align="center">
          Join us to explore the amazing features.
        </SubText>
        <ButtonWrapper>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Login
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={() => navigate('/register')}
          >
            Register
          </StyledButton>
        </ButtonWrapper>
      </ContentWrapper>
    </StyledBox>
  )
}

// Styled components
const StyledBox = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: 'rgb(25, 118, 210)'
})

const ContentWrapper = styled(Paper)({
  position: 'relative',
  zIndex: 2,
  padding: '40px',
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  maxWidth: '600px',
  width: '100%'
})

const HeroText = styled(Typography)({
  color: '#1976d2', // Primary color for hero text
  fontWeight: 'bold',
  fontSize: '2.5rem'
})

const SubText = styled(Typography)({
  color: '#000000', // Normal color for better readability
  fontStyle: 'italic'
})

const ButtonWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  marginTop: '16px'
})

const StyledButton = styled(Button)({
  fontSize: '1.2rem',
  padding: '10px 20px'
})

export default Welcome
