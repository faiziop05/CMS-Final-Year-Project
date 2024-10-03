import React, { useState, useEffect } from "react";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import "./ManageSemester.css";
import axios from "axios";

export const ManageSemester = () => {
  const [semesterName, setSemesterName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [semester, setSemester] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const newdate = new Date().toISOString();
    const ongoingSemester = semester.some((item) => item.deadline > newdate);

    if (ongoingSemester) {
      alert("There is already an ongoing semester. Please wait until it ends before adding a new one.");
      return;
    }

    const data = { deadline, semesterName };
    try {
      await axios.post("http://localhost:3000/api/semester/add", data);
      alert("Successfully Uploaded Semester");
      fetchSemester(); // Fetch updated semester list
    } catch (error) {
      alert("Error uploading semester. Please try again.");
    }
  };

  const fetchSemester = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/semester/get");
      setSemester(res.data);
    } catch (error) {
      alert("Error fetching semester data. Please try again.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSemester();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const newdate = new Date().toISOString();

  return (
    <div>
      <TopNavigationBar gotopath='AdminProfile'/>
      <div className="SemesterinnerContainerWrapper">
        <div className="mangeSemesterLabelInputWwrapperDataTime">
          <label htmlFor="semstername">Enter Name of semester: </label>
          <input
            type="text"
            id="semstername"
            name="semstername"
            placeholder="Name of semester"
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
          />
        </div>
        <div className="mangeSemesterLabelInputWwrapperDataTime">
          <label htmlFor="date">Select Deadline:</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit} className="SemesterStartButton">
          Start
        </button>
      </div>
      <div>
        {isLoading ? (
          <p style={{textAlign:"center"}}>Loading...</p>
        ) : (
          semester?.length > 0 ? (
            semester.map((item) => {
              const backgroundColor = item.deadline > newdate ? "green" : "red";
              return (
                <div className="uploadedAssignmentWrapper" key={item._id}>
                  <div>
                    <p>
                      <strong>Semester: </strong>
                      {item.semesterName}
                    </p>
                    <p>
                      <strong>Upload Date: </strong>
                      {formatDate(item.uploadDate)}
                    </p>
                    <p>
                      <strong>Deadline: </strong>
                      {formatDate(item.deadline)}
                    </p>
                  </div>
                  <p
                    style={{
                      backgroundColor: backgroundColor,
                      height: 50,
                      borderRadius: 10,
                      padding: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      color: "white",
                    }}
                  >
                    {item.deadline > newdate ? "On Going" : "Ended"}
                  </p>
                </div>
              );
            })
          ) : (
            <p style={{textAlign:"center"}}>No semesters uploaded yet.</p>
          )
        )}
      </div>
    </div>
  );
};
