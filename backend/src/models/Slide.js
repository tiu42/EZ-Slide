import mongoose from "mongoose";

// 1 - Create Slide Schema
const SlideSchema = new mongoose.Schema({
    presentationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Presentation',
        required: true,
        index: true
    },
    width: { type: Number, default: 1920 },
    height: { type: Number, default: 1080 },
    elements: { type: Array, default: [] },
    thumbnail: { type: String, default: '' },
    background: { type: String, default: '#ffffff' },
    backgroundImage: { type: String, default: '' },
    backgroundImageMeta: {
        width: { type: Number, default: null },
        height: { type: Number, default: null }
    },
    backgroundImageFit: { type: String, default: 'cover' },
    notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model("Slide", SlideSchema);