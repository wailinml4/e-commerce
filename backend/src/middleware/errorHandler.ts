import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { CustomError } from '../types/index.js'
import env from '../config/env.js'

const errorHandler = (error: CustomError | ZodError, req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof ZodError) {
    const source = (error as ZodError & { source?: string }).source

    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues.map(issue => ({
        path: [source, ...issue.path].filter(Boolean).join('.'),
        message: issue.message,
        code: issue.code,
      })),
    })
    return
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  console.error(error)

  const response: Record<string, unknown> = {
    success: false,
    message: message,
  }

  if (env.NODE_ENV === 'development') {
    response.stack = (error as Error).stack
  }

  res.status(statusCode).json(response)
}

export default errorHandler
