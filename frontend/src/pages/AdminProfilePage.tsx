import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileModal from '../components/shared/ProfileModal'

const AdminProfilePage = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    navigate('/admin/dashboard')
  }

  return <ProfileModal isOpen={isOpen} onClose={handleClose} variant="admin" />
}

export default AdminProfilePage
