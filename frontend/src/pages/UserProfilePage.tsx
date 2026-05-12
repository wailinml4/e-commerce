import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileModal from '../components/shared/ProfileModal'

const UserProfilePage = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    navigate('/')
  }

  return <ProfileModal isOpen={isOpen} onClose={handleClose} />
}

export default UserProfilePage
