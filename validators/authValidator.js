// validators/userValidator.js
function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  }
export function validateRegisterUser(data) {
    const errors = {};
  
    if (!data.username || data.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }
  
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }
  
    if (!isStrongPassword(data.password)) {
      errors.password = "Password must be at least 8 characters long";
    }
  
    return errors;
  }
  