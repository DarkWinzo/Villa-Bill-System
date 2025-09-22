import * as yup from 'yup'

// Common validation schemas
export const loginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
})

export const cashierSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  password: yup
    .string()
    .when('$isEditing', {
      is: true,
      then: (schema) => schema.min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
      otherwise: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters')
    }),
  full_name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .max(20, 'Phone number must be less than 20 characters')
})

export const roomSchema = yup.object({
  room_number: yup
    .string()
    .required('Room number is required')
    .max(10, 'Room number must be less than 10 characters'),
  room_type: yup
    .string()
    .required('Room type is required')
    .oneOf(['ac', 'non_ac'], 'Invalid room type'),
  price_per_day: yup
    .number()
    .required('Price per day is required')
    .positive('Price must be positive')
    .max(1000000, 'Price must be less than Rs. 1,000,000'),
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters')
})

export const billSchema = yup.object({
  customer_name: yup
    .string()
    .required('Customer name is required')
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters'),
  customer_phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .max(20, 'Phone number must be less than 20 characters'),
  customer_address: yup
    .string()
    .max(200, 'Address must be less than 200 characters'),
  room_id: yup
    .number()
    .required('Room selection is required')
    .positive('Invalid room selection'),
  check_in_date: yup
    .date()
    .required('Check-in date is required')
    .min(new Date().toDateString(), 'Check-in date cannot be in the past'),
  check_out_date: yup
    .date()
    .required('Check-out date is required')
    .min(yup.ref('check_in_date'), 'Check-out date must be after check-in date'),
  price_per_day: yup
    .number()
    .required('Price per day is required')
    .positive('Price must be positive')
})

// Validation helper functions
export const validateField = async (schema, field, value) => {
  try {
    await schema.validateAt(field, { [field]: value })
    return null
  } catch (error) {
    return error.message
  }
}

export const validateForm = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.inner.forEach(err => {
      errors[err.path] = err.message
    })
    return { isValid: false, errors }
  }
}