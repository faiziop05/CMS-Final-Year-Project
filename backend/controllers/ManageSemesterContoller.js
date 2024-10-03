import Semester from "../models/ManageSemester.js";
export const AddSemester = async (req, res) => {
    try {
      const SemesterData = req.body;
      const result = await Semester.insertMany(SemesterData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error adding Semester', error });
      console.log(error);
    }
  };
export const getSemester = async (req, res) => {
    try {
      // const SemesterData = req.body;
      const result = await Semester.find();
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error getting Semester', error });
      console.log(error);
    }
  };
  export const getOngoingSemester = async (req, res) => {
    try {
      const currentDate = new Date();
      const result = await Semester.find({ deadline: { $gt: currentDate } });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error getting Semester', error });
      console.error(error);
    }
  };