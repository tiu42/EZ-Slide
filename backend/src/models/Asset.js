import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  
  // URL file trên Cloud (Cloudinary, S3, Firebase Storage...)
  url: { type: String, required: true },
  
  // Public ID của file trên Cloud (để tiện xóa file gốc)
  publicId: String,

  filename: String, // Tên file gốc lúc upload
  mimeType: String, // 'image/png', 'image/jpeg', 'video/mp4'
  size: Number, // Kích thước file (bytes)

  // META DATA QUAN TRỌNG CHO CANVAS
  // Lưu kích thước gốc để khi drop vào canvas giữ đúng tỷ lệ
  meta: {
    width: Number,
    height: Number,
    duration: Number // Nếu là video
  },

  // Phân loại để dễ filter trong thư viện ảnh
  type: { 
    type: String, 
    enum: ['image', 'video', 'font', 'audio'], 
    default: 'image' 
  }

}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);