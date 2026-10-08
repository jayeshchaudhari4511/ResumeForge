import Resume from '../models/Resume.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all resumes for the authenticated user
 * @route   GET /api/resumes
 * @access  Private
 */
export const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single resume by ID
 * @route   GET /api/resumes/:id
 * @access  Private
 */
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      throw new ApiError(`Resume not found with id: ${req.params.id}`, 404);
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      throw new ApiError('Not authorized to access this resume', 403);
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new resume
 * @route   POST /api/resumes
 * @access  Private
 */
export const createResume = async (req, res, next) => {
  try {
    const {
      title,
      personal,
      education,
      experience,
      projects,
      skills,
      certifications,
      achievements,
      summary,
      template,
    } = req.body;

    const resume = await Resume.create({
      userId: req.user._id,
      title: title?.trim() || 'My Professional Resume',
      personal: personal || {},
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      projects: Array.isArray(projects) ? projects : [],
      skills: Array.isArray(skills) ? skills : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      summary: summary || '',
      template: template || 'ats',
    });

    res.status(201).json({
      success: true,
      resume,
      message: 'Resume created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing resume
 * @route   PUT /api/resumes/:id
 * @access  Private
 */
export const updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      throw new ApiError(`Resume not found with id: ${req.params.id}`, 404);
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      throw new ApiError('Not authorized to update this resume', 403);
    }

    const {
      title,
      personal,
      education,
      experience,
      projects,
      skills,
      certifications,
      achievements,
      summary,
      template,
    } = req.body;

    if (title !== undefined) resume.title = title.trim();
    if (personal !== undefined) resume.personal = personal;
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (projects !== undefined) resume.projects = projects;
    if (skills !== undefined) resume.skills = skills;
    if (certifications !== undefined) resume.certifications = certifications;
    if (achievements !== undefined) resume.achievements = achievements;
    if (summary !== undefined) resume.summary = summary;
    if (template !== undefined) resume.template = template;

    const updatedResume = await resume.save();

    res.status(200).json({
      success: true,
      resume: updatedResume,
      message: 'Resume updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/:id
 * @access  Private
 */
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      throw new ApiError(`Resume not found with id: ${req.params.id}`, 404);
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      throw new ApiError('Not authorized to delete this resume', 403);
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
