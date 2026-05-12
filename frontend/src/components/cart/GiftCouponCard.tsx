import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '../../stores/useCartStore'
import { applyCouponSchema, type ApplyCouponInput } from '../../schemas/cart.schema.js'

type FormData = ApplyCouponInput

const GiftCouponCard = () => {
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(applyCouponSchema),
  })

  useEffect(() => {
    getMyCoupon()
  }, [getMyCoupon])

  useEffect(() => {
    if (coupon) reset({ code: coupon.code })
  }, [coupon, reset])

  const onSubmit = (values: FormData) => {
    applyCoupon(values.code)
  }

  const handleRemoveCoupon = async () => {
    await removeCoupon()
    reset()
  }

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-700">
              Do you have a voucher or gift card?
            </label>
            <input
              {...register('code')}
              type="text"
              id="voucher"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-gray-900"
              placeholder="Enter code here"
            />
            {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
          </div>

          <motion.button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Code
          </motion.button>
        </form>
      </div>

      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>

          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Your Available Coupon:</h3>
          <p className="mt-2 text-sm text-gray-600">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  )
}
export default GiftCouponCard
