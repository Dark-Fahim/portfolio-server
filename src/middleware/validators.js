import { body, validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('company').optional({ checkFalsy: true }).trim().isLength({ max: 150 }),
  body('service')
    .optional({ checkFalsy: true })
    .isIn(['web-development', 'seo', 'social-media-marketing', 'other']),
  body('budget').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('projectType').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  body('contactPreference').optional({ checkFalsy: true }).isIn(['email', 'phone', 'whatsapp']),
  // Honeypot field: real users never fill this in; bots usually do.
  body('website').custom((value) => {
    if (value) throw new Error('Spam detected');
    return true;
  }),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['mern', 'frontend', 'backend', 'fullstack', 'seo', 'smm']),
];

export const blogPostValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required').isLength({ max: 300 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];
