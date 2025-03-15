import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://singhalsparshu9876:A100%23a100%23@vybes.cgi9f.mongodb.net/?retryWrites=true&w=majority&appName=vybes');
    console.log('DB Connected');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1);
  }
};