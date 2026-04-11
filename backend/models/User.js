const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    createdOn: { type: Date, default: Date.now },
    monthlyBudget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function () {
 // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return; // Just return in an async function
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // DO NOT call next() here
  } catch (error) {
    throw error; // Throwing inside an async hook handles the error correctly
  }
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// This line was likely missing or broken
module.exports = mongoose.model("User", UserSchema);