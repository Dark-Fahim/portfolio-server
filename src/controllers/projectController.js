import Project from '../models/Project.js';
import { ApiError } from '../middleware/errorHandler.js';

// Public: list published projects, optional ?category= filter
export const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { published: true };
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true });
    if (!project) throw new ApiError(404, 'Project not found');
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// Admin: list all projects regardless of published state
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) throw new ApiError(404, 'Project not found');
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) throw new ApiError(404, 'Project not found');
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
