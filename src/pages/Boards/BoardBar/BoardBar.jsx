import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '8px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgColor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            onClick={() => {}}
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filter"
          onClick={() => {}}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
          variant="outlined"
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          <Tooltip title="baoquoc">
            <Avatar
              alt="baoquoc"
              src="https://whatsondisneyplus.b-cdn.net/wp-content/uploads/2022/12/spiderman.png"
            />
          </Tooltip>
          <Tooltip title="iron-man">
            <Avatar
              alt="iron-man"
              src="https://i.pinimg.com/originals/0e/f2/fb/0ef2fb13f53e1a50271b2e3bc2714a0f.jpg"
            />
          </Tooltip>
          <Tooltip title="hulk">
            <Avatar
              alt="hulk"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSREfaXPTd0K6oXnAhZYD8sJaHKhJpQwIOONA&s"
            />
          </Tooltip>
          <Tooltip title="flash">
            <Avatar
              alt="flash"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEol9-9bSb50VJwSkXW-hF6LGTgJRbIprfeA&s"
            />
          </Tooltip>
          <Tooltip title="captain-america">
            <Avatar
              alt="captain-america"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5WeqNMFKfetaRbAQGgs8ZTTpJPsdKJilQlw&s"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
