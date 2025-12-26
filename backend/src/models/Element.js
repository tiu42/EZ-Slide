import mongoose from "mongoose";

// 1 - Create Element Schema
const ElementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type:{
        type: String,
        enum: ['text', 'image', 'shape', 'line'],
        required: true
    },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 },
    rotation: { type: Number, default: 0 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },

    content: { type: String, default: ''},  // For text elements
    src: { type: String, default: ''}   ,   // For image elements

    style: {
        fill: { type: String, default: '#000000' },
        stroke: { type: String, default: '#000000' },
        strokeWidth: { type: Number, default: 1 },
        fontSize: { type: Number, default: 16 },
        fontFamily: { type: String, default: 'Arial' },
        textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
        opacity: { type: Number, default: 1 },
        shadowColor: String,
        shadowBlur: Number,
        shadowOffsetX: Number,
        shadowOffsetY: Number
    }
}, { timestamps: true });

export default ElementSchema;