import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../stores/useAuthStore'
import { getSuggestionsService } from '../../services/product.service'
import { VALID_CATEGORIES, capitalizeCategory } from '../../constants/categories'
import {
  NavCartIcon,
  NavWishlistIcon,
  NavOrdersIcon,
  NavProfileIcon,
  NavAuthButtons,
  NavSearchButton,
  NavMobileMenuButton,
  NavMobileMenu,
} from './index'
import { LogOut, Search, X } from 'lucide-react'
import ProfileModal from '../shared/ProfileModal'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; image?: string }[]>([])
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      setIsSuggestionsVisible(false)
      setIsSearchModalOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: { id: string; name: string; image?: string }) => {
    setSearchQuery(suggestion.name)
    navigate(`/product/${suggestion.id}`)
    setIsSuggestionsVisible(false)
    setIsSearchModalOpen(false)
  }

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen)
    if (!isSearchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await getSuggestionsService({ query: searchQuery })
          setSuggestions(response.data.data)
          setIsSuggestionsVisible(true)
        } catch (error) {
          console.error('Error fetching suggestions:', error)
        }
      } else {
        setSuggestions([])
        setIsSuggestionsVisible(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-6 left-0 right-0 z-50 px-4"
    >
      <div className="spatial-panel px-6 py-3 flex items-center justify-between w-full max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-slate-900 hover:text-primary transition-colors tracking-tighter">
          nova
        </Link>


        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {VALID_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/category/${category}`}
              className="text-sm text-app-muted hover:text-slate-900 transition-colors font-medium"
            >
              {capitalizeCategory(category)}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <NavSearchButton onClick={toggleSearchModal} />
          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <NavOrdersIcon delay={0.1} />
                  <NavCartIcon delay={0.2} />
                  <NavWishlistIcon delay={0.3} />
                </>
              )}
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="p-2 text-app-muted transition-colors hover:text-slate-900"
                aria-label="Open profile"
              >
                <NavProfileIcon delay={0.4} asIcon />
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-2 text-app-muted transition-colors hover:text-slate-900"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <NavAuthButtons delay={0} />
          )}
          <NavMobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
      </div>

      <AnimatePresence>
        <NavMobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onProfileClick={() => setIsProfileModalOpen(true)}
        />
      </AnimatePresence>

      <AnimatePresence>
        {isSearchModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-30"
              onClick={() => setIsSearchModalOpen(false)}
            />

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 150,
                mass: 0.8,
                velocity: 0.5,
              }}
              className="fixed inset-x-0 top-0 bg-app-bg/80 backdrop-blur-2xl z-40 border-b border-white/10 pt-24 px-4 pb-8"
            >
              <div className="container mx-auto max-w-7xl">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search nova"
                      className="w-full py-5 pl-14 pr-12 text-2xl bg-transparent text-slate-900 border-b border-slate-100 focus:outline-none focus:border-primary transition-colors duration-500 placeholder:text-slate-300"
                      autoComplete="off"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-black"
                      >
                        <X size={24} />
                      </button>
                    )}
                  </div>
                  {isSuggestionsVisible && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-3"
                        >
                          {suggestion.image && (
                            <img src={suggestion.image} alt={suggestion.name} className="w-10 h-10 object-cover rounded" />
                          )}
                          <span>{suggestion.name}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </form>

                <div className="py-4">
                  <p className="text-sm text-gray-500 px-2 py-2">Quick Links</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigate('/search?q=new arrivals')
                        setIsSearchModalOpen(false)
                      }}
                      className="text-left p-3 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <p className="font-medium">New Arrivals</p>
                      <p className="text-sm text-gray-500">Shop the latest products</p>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/search?q=deals')
                        setIsSearchModalOpen(false)
                      }}
                      className="text-left p-3 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <p className="font-medium">Deals & Offers</p>
                      <p className="text-sm text-gray-500">Limited time offers</p>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors duration-200"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </motion.header>
  )
}
export default Navbar
