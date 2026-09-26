import Workout from "../models/workout.js";
export async function summary(req, res, next) {
    try {
        const rows = await Workout.find({
            user: req.user.id
        }).sort({
            workoutDate: 1
        });

        const totalWorkouts = rows.length;

        const totalCalories = rows.reduce(
            (a, w) => a + w.caloriesBurned,
            0
        );

        const avgDuration = totalWorkouts
            ? Math.round(
                rows.reduce((a, w) => a + w.duration, 0) /
                totalWorkouts
            )
            : 0;

        const byCategory = {};

        rows.forEach((w) => {
            byCategory[w.category] =
                (byCategory[w.category] || 0) + 1;
        });

        const last7 = rows.filter(
            (w) =>
                Date.now() -
                new Date(w.workoutDate).getTime() <
                7 * 864e5
        ).length;

        const series = rows.slice(-14).map((w) => ({
            date: new Date(w.workoutDate).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric"
                }
            ),
            calories: w.caloriesBurned,
            duration: w.duration
        }));

        res.json({
            success: true,
            stats: {
                totalWorkouts,
                totalCalories,
                avgDuration,
                last7,
                byCategory
            },
            series
        });
    } catch (e) {
        next(e);
    }
}