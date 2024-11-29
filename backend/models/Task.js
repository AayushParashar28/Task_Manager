const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title:{
    type:String,
    required:true
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: Date,
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'Low' },
}, {
  timestamps: true
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;