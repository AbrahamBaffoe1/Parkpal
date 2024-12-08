// server/middleware/validate.js
import { ValidationError } from './errorHandler.js';

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validationContext = {
        body: req.body,
        query: req.query,
        params: req.params
      };

      const { error } = schema.validate(validationContext, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        throw new ValidationError('Validation failed', errors);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

// Common validation schemas
const schemas = {
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    }
  },
  
  register: {
    body: {
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/
      ).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      })
    }
  },

  updateProfile: {
    body: {
      name: Joi.string().min(2).max(100).required()
    }
  },

  changePassword: {
    body: {
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/
      ).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      })
    }
  }
};

export { validate, schemas };