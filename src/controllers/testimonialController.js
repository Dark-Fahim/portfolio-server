import Testimonial from '../models/Testimonial.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err) {
    next(err);
  }
};

export const getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err) {
    next(err);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) throw new ApiError(404, 'Testimonial not found');
    res.json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) throw new ApiError(404, 'Testimonial not found');
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
};
