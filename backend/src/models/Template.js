import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
    presentationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Presentation',
        required: true,
        index: true
    },
    title: { type: String, required: true, default: 'Untitled Template' },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    slidePreviews: [{ type: String }], // Array of slide thumbnail URLs
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    isPublished: { type: Boolean, default: true },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

TemplateSchema.index({ title: 'text', tags: 'text', category: 'text' });

export default mongoose.model("Template", TemplateSchema);