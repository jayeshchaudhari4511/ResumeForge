import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for a given user ID
 * @param {string} id - The user ID
 * @returns {string} - Signed JWT string
 */
export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_jwt_secret_key_12345';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

export default generateToken;
