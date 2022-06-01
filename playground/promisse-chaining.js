require('../src/db/mongoose');

const User = require('../src/models/User');

// User.findByIdAndUpdate('6296b7a90e24368a5e7bfd39', { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount('6296cadacb16c44f2713e4b5', 2)
  .then((count) => {
    console.log(count);
  })
  .catch((error) => {
    console.log(error);
  });
