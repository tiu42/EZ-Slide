import mongoose from "mongoose";
import ElementSchema from "./Element.js";

const TemplateSchema = new mongoose.Schema({
    title: { type: String, required: true, default: 'Untitled Template' },
    thumbnailUrl: { type: String, default: '' },
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    background: {
        type: String,
        value: { type: String, default: '#FFFFFF' },
    },
    elements: [ElementSchema],
}, { timestamps: true });

TemplateSchema.index({ title: 'text', tags: 'text', category: 'text' });

module.exports = mongoose.model("Template", TemplateSchema);