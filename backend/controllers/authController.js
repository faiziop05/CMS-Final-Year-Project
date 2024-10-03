// controllers/authController.js
import jwt from 'jsonwebtoken';
import Coordinator from '../models/ManageCoordinator.js';

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Coordinator.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = password === user.password;
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'mysecret', // replace with your own secret key
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token,_id:user._id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
export { login };
