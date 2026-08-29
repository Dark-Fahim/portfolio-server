import BlogPost from '../models/BlogPost.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getPosts = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 9 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .select('-content')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: posts.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true }).populate(
      'author',
      'name'
    );
    if (!post) throw new ApiError(404, 'Post not found');

    const related = await BlogPost.find({
      _id: { $ne: post._id },
      published: true,
      $or: [{ category: post.category }, { tags: { $in: post.tags } }],
    })
      .select('-content')
      .limit(3);

    res.json({ success: true, data: post, related });
  } catch (err) {
    next(err);
  }
};

export const getAllPostsAdmin = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) throw new ApiError(404, 'Post not found');
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
