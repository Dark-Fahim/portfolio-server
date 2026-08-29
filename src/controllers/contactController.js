import ContactMessage from '../models/ContactMessage.js';
import { sendAdminNotification, sendVisitorConfirmation } from '../services/emailService.js';
import { ApiError } from '../middleware/errorHandler.js';

export const submitContactMessage = async (req, res, next) => {
  try {
    const { website, ...payload } = req.body; // strip honeypot field before saving

    const contactMessage = await ContactMessage.create({
      ...payload,
      ip: req.ip,
    });

    // Email sending must never block the visitor's success response, but we
    // still want failures logged so they can be diagnosed.
    Promise.all([
      sendAdminNotification(contactMessage),
      sendVisitorConfirmation(contactMessage),
    ]).catch((err) => console.error('Email sending failed:', err.message));

    res.status(201).json({
      success: true,
      message: 'Thanks for reaching out — I will get back to you soon.',
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'archived'].includes(status)) {
      throw new ApiError(400, 'Invalid status value');
    }
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!message) throw new ApiError(404, 'Message not found');
    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) throw new ApiError(404, 'Message not found');
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};
