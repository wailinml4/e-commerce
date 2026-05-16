import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, className = '' }: PaginationProps) => {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center mt-12 px-8 gap-6 ${className}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
        Record <span className="text-white/60">{startItem}</span> - <span className="text-white/60">{endItem}</span> of <span className="text-white/60">{totalItems}</span> Index
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 bg-white/5 text-white/40 rounded-2xl hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 min-w-[120px] text-center">
            <span className="text-sm font-black tracking-widest text-white/80">
              {currentPage} <span className="text-white/20 mx-2">/</span> {totalPages}
            </span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 bg-white/5 text-white/40 rounded-2xl hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
