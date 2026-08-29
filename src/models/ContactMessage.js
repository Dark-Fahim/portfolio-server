import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    service: {
      type: String,
      enum: ['web-development', 'seo', 'social-media-marketing', 'other'],
      default: 'other',
    },
    budget: { type: String, default: '' },
    projectType: { type: String, default: '' },
    message: { type: String, required: true, maxlength: 5000 },
    contactPreference: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email',
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
      index: true,
    },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
