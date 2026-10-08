import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    collegeName: { type: String, default: '', trim: true },
    degree:      { type: String, default: '', trim: true },
    cgpa:        { type: String, default: '', trim: true },
    year:        { type: String, default: '', trim: true },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: '', trim: true },
    role:        { type: String, default: '', trim: true },
    duration:    { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, default: '', trim: true },
    link:        { type: String, default: '', trim: true },
    techStack:   { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    certName:     { type: String, default: '', trim: true },
    organization: { type: String, default: '', trim: true },
    year:         { type: String, default: '', trim: true },
  },
  { _id: true }
);

const personalSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '', trim: true },
    email:    { type: String, default: '', trim: true },
    phone:    { type: String, default: '', trim: true },
    address:  { type: String, default: '', trim: true },
    linkedin: { type: String, default: '', trim: true },
    github:   { type: String, default: '', trim: true },
    website:  { type: String, default: '', trim: true },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resume must be associated with a user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a resume title'],
      trim: true,
      default: 'My Professional Resume',
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    personal: {
      type: personalSchema,
      default: () => ({}),
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [certificationSchema],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    template: {
      type: String,
      enum: ['ats', 'modern'],
      default: 'ats',
    },
  },
  {
    timestamps: true,
  }
);

// Index to efficiently query user's resumes sorted by last modified
resumeSchema.index({ userId: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
