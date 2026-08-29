import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true }, // markdown
    category: { type: String, required: true, trim: true, index: true },
    tags: [{ type: String, trim: true, index: true }],
    featuredImage: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, default: '' },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    readingTimeMinutes: { type: Number, default: 1 },
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function generateSlug(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

blogPostSchema.pre('save', function computeReadingTime(next) {
  if (this.isModified('content')) {
    const words = this.content.trim().split(/\s+/).length;
    this.readingTimeMinutes = Math.max(1, Math.round(words / 200));
  }
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogPostSchema.index({ title: 'text', excerpt: 'text', tags: 'text', content: 'text' });

export default mongoose.model('BlogPost', blogPostSchema);
