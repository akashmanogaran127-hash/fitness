
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { api } from "../lib/api";

const blank = {
  workoutName: "",
  category: "Strength",
  duration: 30,
  caloriesBurned: 200,
  workoutDate: new Date().toISOString().slice(0, 10),
};

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(blank);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load workouts
  const load = async () => {
    try {
      console.log("Loading workouts...");

      const result = await api(
        "/workouts" +
          (q ? `?q=${encodeURIComponent(q)}` : "")
      );

      console.log("GET /workouts response:", result);

      setItems(result.workouts || []);
    } catch (error) {
      console.error("LOAD WORKOUTS ERROR:", error);
    }
  };

  // Load workouts when page/search changes
  useEffect(() => {
    load();
  }, [q]);

  // Add workout
  const add = async (e) => {
    e.preventDefault();

    console.log("================================");
    console.log("ADD WORKOUT CLICKED");
    console.log("Form data:", form);
    console.log("================================");

    try {
      setLoading(true);

      const workoutData = {
        workoutName: form.workoutName,
        category: form.category,
        duration: Number(form.duration),
        caloriesBurned: Number(form.caloriesBurned),
        workoutDate: new Date(form.workoutDate),
      };

      console.log("Sending workout:", workoutData);

      const result = await api("/workouts", {
        method: "POST",
        body: JSON.stringify(workoutData),
      });

      console.log("POST /workouts response:", result);

      // Reset form
      setForm({
        ...blank,
        workoutDate: new Date()
          .toISOString()
          .slice(0, 10),
      });

      // Close form
      setOpen(false);

      // Reload workouts
      await load();

      console.log("Workout successfully added and list reloaded.");
    } catch (error) {
      console.error("ADD WORKOUT ERROR:", error);

      alert(
        error?.message ||
          "Failed to add workout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete workout
  const del = async (id) => {
    try {
      console.log("Deleting workout:", id);

      await api(`/workouts/${id}`, {
        method: "DELETE",
      });

      console.log("Workout deleted successfully.");

      await load();
    } catch (error) {
      console.error("DELETE WORKOUT ERROR:", error);

      alert(
        error?.message ||
          "Failed to delete workout."
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="top">
        <div>
          <p className="eyebrow">TRAINING LOG</p>

          <h1>Your workouts.</h1>

          <p className="muted">
            One place for every session.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setOpen(true)}
        >
          <Plus />
          Log workout
        </button>
      </header>

      {/* Search */}
      <div className="toolbar">
        <div className="search">
          <Search />

          <input
            placeholder="Search workouts or categories"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Add Workout Form */}
      {open && (
        <form
          className="panel workoutForm"
          onSubmit={add}
        >
          <h3>Log a workout</h3>

          <div className="formGrid">
            {/* Workout Name */}
            <input
              required
              placeholder="Workout name"
              value={form.workoutName}
              onChange={(e) =>
                setForm({
                  ...form,
                  workoutName: e.target.value,
                })
              }
            />

            {/* Category */}
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              <option>Strength</option>
              <option>Cardio</option>
              <option>HIIT</option>
              <option>Mobility</option>
              <option>Sports</option>
            </select>

            {/* Duration */}
            <input
              type="number"
              min="1"
              required
              placeholder="Duration"
              value={form.duration}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration: e.target.value,
                })
              }
            />

            {/* Calories */}
            <input
              type="number"
              min="0"
              required
              placeholder="Calories"
              value={form.caloriesBurned}
              onChange={(e) =>
                setForm({
                  ...form,
                  caloriesBurned: e.target.value,
                })
              }
            />

            {/* Date */}
            <input
              type="date"
              required
              value={form.workoutDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  workoutDate: e.target.value,
                })
              }
            />
          </div>

          {/* Buttons */}
          <div className="actions">
            <button
              type="button"
              className="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save session"}
            </button>
          </div>
        </form>
      )}

      {/* Workout List */}
      <div className="workoutList">
        {items.map((w) => (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={w._id}
            className="workoutRow"
          >
            {/* Icon */}
            <div className="workoutBadge">
              <ActivityIcon cat={w.category} />
            </div>

            {/* Name */}
            <div className="workoutMain">
              <b>{w.workoutName}</b>

              <span>{w.category}</span>
            </div>

            {/* Duration */}
            <div>
              <small>DURATION</small>

              <b>{w.duration} min</b>
            </div>

            {/* Calories */}
            <div>
              <small>CALORIES</small>

              <b>{w.caloriesBurned} kcal</b>
            </div>

            {/* Date */}
            <div>
              <small>DATE</small>

              <b>
                {w.workoutDate
                  ? new Date(
                      w.workoutDate
                    ).toLocaleDateString()
                  : "-"}
              </b>
            </div>

            {/* Delete */}
            <button
              className="iconBtn"
              onClick={() => del(w._id)}
            >
              <Trash2 />
            </button>
          </motion.div>
        ))}

        {/* Empty state */}
        {!items.length && (
          <div className="empty">
            No workouts yet. Log your first session.
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityIcon() {
  return <CalendarDays />;
}
