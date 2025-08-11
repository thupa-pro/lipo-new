'use client'

import { z } from 'zod'

// Security configuration
const SECURITY_CONFIG = {
  maxStringLength: 10000,
  maxArrayLength: 100,
  maxObjectDepth: 10,
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  sqlInjectionPatterns: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /('|(\\')|(;)|(\-\-)|(\#)|(\/*)|(\*/)|(\bOR\b)|(\bAND\b)/gi,
    /(\b(xp_|sp_|exec|execute)\b)/gi
  ],
  xssPatterns: [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi
  ],
  pathTraversalPatterns: [
    /\.\.\//g,
    /\.\.\\\\g,
    /%2e%2e%2f/gi,
    /%2e%2e\//gi,
    /\.\.%2f/gi,
    /%2e%2e%5c/gi
  ]
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: any
  securityIssues?: string[]
}

export interface ValidationOptions {
  sanitize?: boolean
  allowHTML?: boolean
  maxLength?: number
  required?: boolean
  customPatterns?: RegExp[]
}

class InputValidator {
  
  // Core validation method
  validate(value: any, options: ValidationOptions = {}): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      securityIssues: []
    }

    try {
      // Handle null/undefined values
      if (value === null || value === undefined) {
        if (options.required) {
          result.isValid = false
          result.errors.push('Value is required')
        }
        return result
      }

      // Validate based on type
      if (typeof value === 'string') {
        return this.validateString(value, options)
      } else if (typeof value === 'number') {
        return this.validateNumber(value, options)
      } else if (typeof value === 'boolean') {
        return this.validateBoolean(value, options)
      } else if (Array.isArray(value)) {
        return this.validateArray(value, options)
      } else if (typeof value === 'object') {
        return this.validateObject(value, options)
      }

      result.sanitizedValue = value
      return result

    } catch (error) {
      result.isValid = false
      result.errors.push('Validation error occurred')
      return result
    }
  }

  // String validation with security checks
  private validateString(value: string, options: ValidationOptions): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      securityIssues: [],
      sanitizedValue: value
    }

    // Length validation
    const maxLength = options.maxLength || SECURITY_CONFIG.maxStringLength
    if (value.length > maxLength) {
      result.isValid = false
      result.errors.push(`String exceeds maximum length of ${maxLength}`)
    }

    // Security checks
    const securityCheck = this.checkSecurity(value)
    if (securityCheck.issues.length > 0) {
      result.securityIssues = securityCheck.issues
      
      if (!options.allowHTML && securityCheck.hasXSS) {
        result.isValid = false
        result.errors.push('Potentially malicious content detected')
      }
    }

    // Sanitization
    if (options.sanitize) {
      result.sanitizedValue = this.sanitizeString(value, options)
    }

    // Custom pattern validation
    if (options.customPatterns) {
      for (const pattern of options.customPatterns) {
        if (!pattern.test(value)) {
          result.isValid = false
          result.errors.push('Value does not match required pattern')
        }
      }
    }

    return result
  }

  // Number validation
  private validateNumber(value: number, options: ValidationOptions): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: value
    }

    // Check for valid number
    if (!Number.isFinite(value)) {
      result.isValid = false
      result.errors.push('Invalid number')
    }

    // Range validation (if specified in options)
    if ('min' in options && value < (options as any).min) {
      result.isValid = false
      result.errors.push(`Number is below minimum value of ${(options as any).min}`)
    }

    if ('max' in options && value > (options as any).max) {
      result.isValid = false
      result.errors.push(`Number exceeds maximum value of ${(options as any).max}`)
    }

    return result
  }

  // Boolean validation
  private validateBoolean(value: boolean, options: ValidationOptions): ValidationResult {
    return {
      isValid: true,
      errors: [],
      sanitizedValue: value
    }
  }

  // Array validation
  private validateArray(value: any[], options: ValidationOptions): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: value
    }

    // Length validation
    if (value.length > SECURITY_CONFIG.maxArrayLength) {
      result.isValid = false
      result.errors.push(`Array exceeds maximum length of ${SECURITY_CONFIG.maxArrayLength}`)
    }

    // Validate each element
    const sanitizedArray: any[] = []
    for (let i = 0; i < value.length; i++) {
      const elementResult = this.validate(value[i], options)
      
      if (!elementResult.isValid) {
        result.isValid = false
        result.errors.push(`Array element ${i}: ${elementResult.errors.join(', ')}`)
      }

      if (elementResult.securityIssues?.length) {
        result.securityIssues = (result.securityIssues || []).concat(
          elementResult.securityIssues.map(issue => `Array element ${i}: ${issue}`)
        )
      }

      sanitizedArray.push(elementResult.sanitizedValue)
    }

    if (options.sanitize) {
      result.sanitizedValue = sanitizedArray
    }

    return result
  }

  // Object validation
  private validateObject(value: object, options: ValidationOptions, depth = 0): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: value
    }

    // Depth check to prevent deep object attacks
    if (depth > SECURITY_CONFIG.maxObjectDepth) {
      result.isValid = false
      result.errors.push(`Object nesting exceeds maximum depth of ${SECURITY_CONFIG.maxObjectDepth}`)
      return result
    }

    // Validate object properties
    const sanitizedObject: any = {}
    for (const [key, val] of Object.entries(value)) {
      // Validate the key itself
      const keyResult = this.validateString(key, { sanitize: true })
      if (!keyResult.isValid) {
        result.isValid = false
        result.errors.push(`Invalid object key "${key}": ${keyResult.errors.join(', ')}`)
        continue
      }

      // Validate the value
      const valueResult = this.validate(val, options, depth + 1)
      if (!valueResult.isValid) {
        result.isValid = false
        result.errors.push(`Object property "${key}": ${valueResult.errors.join(', ')}`)
      }

      if (valueResult.securityIssues?.length) {
        result.securityIssues = (result.securityIssues || []).concat(
          valueResult.securityIssues.map(issue => `Property "${key}": ${issue}`)
        )
      }

      sanitizedObject[keyResult.sanitizedValue] = valueResult.sanitizedValue
    }

    if (options.sanitize) {
      result.sanitizedValue = sanitizedObject
    }

    return result
  }

  // Security threat detection
  private checkSecurity(value: string): { issues: string[]; hasXSS: boolean; hasSQLi: boolean; hasPathTraversal: boolean } {
    const issues: string[] = []
    let hasXSS = false
    let hasSQLi = false
    let hasPathTraversal = false

    // XSS detection
    for (const pattern of SECURITY_CONFIG.xssPatterns) {
      if (pattern.test(value)) {
        issues.push('Potential XSS attack detected')
        hasXSS = true
        break
      }
    }

    // SQL injection detection
    for (const pattern of SECURITY_CONFIG.sqlInjectionPatterns) {
      if (pattern.test(value)) {
        issues.push('Potential SQL injection detected')
        hasSQLi = true
        break
      }
    }

    // Path traversal detection
    for (const pattern of SECURITY_CONFIG.pathTraversalPatterns) {
      if (pattern.test(value)) {
        issues.push('Potential path traversal attack detected')
        hasPathTraversal = true
        break
      }
    }

    // Check for suspicious patterns
    if (value.includes('${') || value.includes('#{')) {
      issues.push('Potential template injection detected')
    }

    if (value.includes('<!--') || value.includes('<!DOCTYPE')) {
      issues.push('Potential HTML injection detected')
    }

    return { issues, hasXSS, hasSQLi, hasPathTraversal }
  }

  // String sanitization
  private sanitizeString(value: string, options: ValidationOptions): string {
    let sanitized = value

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '')

    // Remove or escape dangerous characters
    if (!options.allowHTML) {
      // Basic HTML encoding
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
    }

    // Remove potential SQL injection patterns
    sanitized = sanitized.replace(/('|(\\')|(;)|(\-\-)|(\#))/g, '')

    // Remove path traversal patterns
    sanitized = sanitized.replace(/\.\.\//g, '').replace(/\.\.\\\\g, '')

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim()

    return sanitized
  }

  // File validation
  validateFile(file: File, options: { allowedTypes?: string[]; maxSize?: number } = {}): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: file
    }

    const allowedTypes = options.allowedTypes || SECURITY_CONFIG.allowedFileTypes
    const maxSize = options.maxSize || SECURITY_CONFIG.maxFileSize

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      result.isValid = false
      result.errors.push(`File type ${file.type} not allowed`)
    }

    // Check file size
    if (file.size > maxSize) {
      result.isValid = false
      result.errors.push(`File size ${file.size} exceeds maximum of ${maxSize}`)
    }

    // Check filename for security issues
    const filenameCheck = this.checkSecurity(file.name)
    if (filenameCheck.issues.length > 0) {
      result.securityIssues = filenameCheck.issues
      result.isValid = false
      result.errors.push('Potentially malicious filename')
    }

    return result
  }

  // Email validation
  validateEmail(email: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: email.toLowerCase().trim()
    }

    // Basic security check
    const securityCheck = this.checkSecurity(email)
    if (securityCheck.issues.length > 0) {
      result.isValid = false
      result.errors.push('Invalid email format')
      return result
    }

    // Email regex validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    if (!emailRegex.test(email)) {
      result.isValid = false
      result.errors.push('Invalid email format')
    }

    return result
  }

  // URL validation
  validateURL(url: string, options: { allowedProtocols?: string[] } = {}): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedValue: url.trim()
    }

    const allowedProtocols = options.allowedProtocols || ['http:', 'https:']

    try {
      const urlObj = new URL(url)
      
      if (!allowedProtocols.includes(urlObj.protocol)) {
        result.isValid = false
        result.errors.push(`Protocol ${urlObj.protocol} not allowed`)
      }

      // Security checks
      const securityCheck = this.checkSecurity(url)
      if (securityCheck.issues.length > 0) {
        result.securityIssues = securityCheck.issues
        result.isValid = false
        result.errors.push('Potentially malicious URL')
      }

    } catch (error) {
      result.isValid = false
      result.errors.push('Invalid URL format')
    }

    return result
  }
}

// Singleton instance
export const inputValidator = new InputValidator()

// Convenience functions
export function validateAndSanitize(value: any, options: ValidationOptions = {}): ValidationResult {
  return inputValidator.validate(value, { ...options, sanitize: true })
}

export function isSecure(value: string): boolean {
  const result = inputValidator.validate(value)
  return result.isValid && (!result.securityIssues || result.securityIssues.length === 0)
}

export function sanitizeHtml(html: string): string {
  const result = inputValidator.validate(html, { sanitize: true, allowHTML: false })
  return result.sanitizedValue || ''
}

// Zod schema extensions for validation
export const secureString = z.string().refine((val) => {
  const result = inputValidator.validate(val)
  return result.isValid && (!result.securityIssues || result.securityIssues.length === 0)
}, 'String contains potentially malicious content')

export const secureEmail = z.string().refine((val) => {
  const result = inputValidator.validateEmail(val)
  return result.isValid
}, 'Invalid or insecure email address')

export const secureUrl = z.string().refine((val) => {
  const result = inputValidator.validateURL(val)
  return result.isValid
}, 'Invalid or insecure URL')

// Form validation helpers
export function validateForm<T>(data: T, schema: z.ZodSchema<T>): { success: boolean; data?: T; errors?: string[] } {
  try {
    const validatedData = schema.parse(data)
    
    // Additional security validation
    const securityResult = inputValidator.validate(validatedData, { sanitize: true })
    
    if (!securityResult.isValid) {
      return {
        success: false,
        errors: securityResult.errors.concat(securityResult.securityIssues || [])
      }
    }

    return {
      success: true,
      data: securityResult.sanitizedValue
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      }
    }
    
    return {
      success: false,
      errors: ['Validation failed']
    }
  }
}

// API request validation middleware
export function validateApiRequest(allowedMethods: string[] = ['GET', 'POST']) {
  return function(req: any, res: any, next: any) {
    // Method validation
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Content-Type validation for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type']
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(400).json({ error: 'Invalid content type' })
      }
    }

    // Body validation
    if (req.body) {
      const result = inputValidator.validate(req.body, { sanitize: true })
      
      if (!result.isValid) {
        return res.status(400).json({
          error: 'Invalid request data',
          details: result.errors
        })
      }

      if (result.securityIssues && result.securityIssues.length > 0) {
        console.warn('Security issues detected in request:', result.securityIssues)
        
        // Log but don't block (depending on your security policy)
        // return res.status(400).json({ error: 'Security validation failed' })
      }

      req.body = result.sanitizedValue
    }

    // Query parameter validation
    if (req.query) {
      const queryResult = inputValidator.validate(req.query, { sanitize: true })
      
      if (!queryResult.isValid) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: queryResult.errors
        })
      }

      req.query = queryResult.sanitizedValue
    }

    next()
  }
}

export default inputValidator