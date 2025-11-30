import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userScheema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["teacher", "student"],
    default: "student",
  },
});

userScheema.pre("save", async function (next) {
  this.pass = await bcrypt.hash(this.pass, 10);
});

userScheema.methods.matchpass = async function (pass) {
  return bcrypt.compare(pass, this.pass);
};

const User = new mongoose.model("User", userScheema);
export default User;
