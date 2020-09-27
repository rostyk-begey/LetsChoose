const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true, default: '' },
    bio: { type: String, default: '', maxlength: 150 },
    confirmed: { type: Boolean, required: true, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = model('User', schema);
