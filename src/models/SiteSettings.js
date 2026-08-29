import mongoose from 'mongoose';

// Singleton document holding all admin-editable site content that isn't a
// collection of its own (profile, social links, homepage stats, resume URL).
const siteSettingsSchema = new mongoose.Schema(
  {
    name: { type: String, default: '[YOUR NAME]' },
    tagline: { type: String, default: 'Full-Stack Developer + SEO Expert + Social Media Marketing Specialist' },
    bio: { type: String, default: '[YOUR PROFESSIONAL STORY]' },
    email: { type: String, default: '[YOUR EMAIL]' },
    phone: { type: String, default: '' },
    location: { type: String, default: '[YOUR LOCATION]' },
    profileImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    social: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    stats: {
      projectsCompleted: { type: Number, default: 0 },
      technologiesUsed: { type: Number, default: 0 },
      happyClients: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 },
    },
    seo: {
      gaId: { type: String, default: '' },
      gtmId: { type: String, default: '' },
      searchConsoleVerification: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
