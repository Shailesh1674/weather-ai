import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    select: false, // Don't return password by default
  },
  provider: {
    type: String,
    default: 'email',
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
