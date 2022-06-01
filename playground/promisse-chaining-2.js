require('../src/db/mongoose');

const { count } = require('../src/models/Task');
const Task = require('../src/models/Task');

// Task.findByIdAndDelete('6296ba6657bce4e116da4907')
//   .then((user) => {
//     if (!user) return console.log('Task not found.');

//     console.log(user);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount('6296cbedce13681ea9678ac9').then((count) => {
  console.log('count: ', count);
});
