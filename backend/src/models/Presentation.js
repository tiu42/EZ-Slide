import mongoose from "mongoose";

const PresentationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true, default: 'Untitled Presentation' },

    slideOrder: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slide',
    }],

    thumbnailUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model("Presentation", PresentationSchema);