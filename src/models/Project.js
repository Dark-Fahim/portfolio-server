import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['mern', 'frontend', 'backend', 'fullstack', 'seo', 'smm'],
      required: true,
      index: true,
    },
    technologies: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    image: { type: String, default: '' },
    gallery: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    results: [{ type: String }],
    challenges: { type: String, default: '' },
    lessons: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function generateSlug(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

export default mongoose.model('Project', projectSchema);
