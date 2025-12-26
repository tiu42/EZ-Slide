import mongoose from "mongoose";
import ElementSchema from "./Element.js";

// 1 - Create Slide Schema
const SlideSchema = new mongoose.Schema({
    presentationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Presentation',
        required: true,
        index: true
    },
    background: {
        type: String,
        value: { type: String, default: '#FFFFFF' },
    },
    elements: [ElementSchema],
    notes: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model("Slide", SlideSchema);