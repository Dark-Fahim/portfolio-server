import SiteSettings from '../models/SiteSettings.js';

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}

export const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [Project, BlogPost, ContactMessage] = await Promise.all([
      (await import('../models/Project.js')).default,
      (await import('../models/BlogPost.js')).default,
      (await import('../models/ContactMessage.js')).default,
    ]);

    const [totalProjects, totalPosts, totalMessages, unreadMessages, recentInquiries] =
      await Promise.all([
        Project.countDocuments(),
        BlogPost.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ status: 'unread' }),
        ContactMessage.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      data: { totalProjects, totalPosts, totalMessages, unreadMessages, recentInquiries },
    });
  } catch (err) {
    next(err);
  }
};
