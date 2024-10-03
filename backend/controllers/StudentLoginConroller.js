// controllers/authController.js
import StudentLogin from '../models/StudentLogin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const StudentloginController = async (req, res) => {
  const { Session, Program, RollNo, password ,expoPushToken } = req.body;
  const username = `${Session}-${Program}-${RollNo}`;
  console.log(username);
  try {
    const user = await StudentLogin.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const student = await Student.findOne({ username });

    if (student) {
      student.expoPushToken = expoPushToken || student.expoPushToken;
      await student.save();
    }
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, 'mysecret', (err, token) => {
      if (err) throw err;
      res.json({ token, _id: user._id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export { StudentloginController };
