import mongoose from 'mongoose';

const SavedCitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

SavedCitySchema.index({ userId: 1, lat: 1, lon: 1 }, { unique: true });

export default mongoose.models.SavedCity || mongoose.model('SavedCity', SavedCitySchema);
