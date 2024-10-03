import cron from 'node-cron';
import {calculateResult} from '../controllers/calculateResultContoller.js';
import Semester from '../models/ManageSemester.js';

// Temporary schedule to run the calculation every minute for testing purposes
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const nowISO = now.toISOString();

  // Find semesters where the deadline matches the current time (up to the minute)
  const semesters = await Semester.find({
    deadline: {
      $gte: new Date(now.setSeconds(0, 0)),
      $lt: new Date(now.setMinutes(now.getMinutes() + 1, 0, 0))
    }
  });

  if (semesters.length > 0) {
    for (const semester of semesters) {
      await calculateResult(semester._id);
    }
    console.log('Results calculated and saved.');
  } else {
    console.log('No semester deadline matches the current time.');
  }
});
