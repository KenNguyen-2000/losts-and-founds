import mongoose, { Model } from 'mongoose';

interface Otp extends Document {
  userId: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const otpSchema = new mongoose.Schema<Otp>({
  userId: {
    type: String,
    require: true,
  },
  otp: {
    type: String,
    require: true,
  },
  createdAt: { type: Date, require: true },
  expiresAt: { type: Date, require: true },
});

const Otp: Model<Otp> = mongoose.model('otp', otpSchema);

export default Otp;
