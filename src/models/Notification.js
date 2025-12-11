import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: { 
      type: String, 
      required: true, 
      index: true 
    }, // Matches Farmer.uniqueId
    type: { 
      type: String, 
      required: true 
    }, // e.g., 'crop-status', 'alert'
    message: { 
      type: String, 
      required: true 
    },
    data: { 
      type: Object,
      default: {}
    }, // Flexible field for extra data (e.g., batchId, status)
    read: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
