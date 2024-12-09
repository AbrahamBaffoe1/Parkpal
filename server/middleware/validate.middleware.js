// server/middleware/validate.middleware.js
const validateUpdateProfile = (req, res, next) => {
    const { full_name, phone } = req.body;
  
    if (full_name && full_name.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be at least 2 characters long'
      });
    }
  
    if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number format'
      });
    }
  
    next();
  };
  
  const validateChangePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
  
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Both current and new password are required'
      });
    }
  
    if (newPassword.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long'
      });
    }
  
    // Check for password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }
  
    next();
  };
  
  export {
    validateUpdateProfile,
    validateChangePassword
  };