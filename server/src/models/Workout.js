import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    workoutName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    category: {
      type: String,
      required: true,
      enum: ["Strength", "Cardio", "HIIT", "Mobility", "Sports"],
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },

    workoutDate: {
      type: Date,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workout =
  mongoose.models.Workout ||
  mongoose.model("Workout", workoutSchema);

export default Workout;