const mongoose = requrie('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  username:
      {type: String, index: true, unique: true, dropDups: true, required: true},
  passwordHash: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

module.exports = User;