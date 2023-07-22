import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res, next) => {
  try {
    //first check is user is logined or not using isAuthenticated function
    const { title, description } = req.body; //take title from body

    await Task.create({ title, description, user: req.user }); //stored in db at login user

    res.status(201).json({ success: true, message: "task added successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyTask = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const tasks = await Task.find({ user: userid });
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ErrorHandler("Invalid Id", 404));
    }

    task.isComplited = !task.isComplited;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ErrorHandler("Invalid Id", 404));
    }

    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
