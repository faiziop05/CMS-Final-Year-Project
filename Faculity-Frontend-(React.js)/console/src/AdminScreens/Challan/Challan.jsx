import React, { useEffect, useState } from "react";
import "./Challan.css";
import { TopNavigationBar } from "../../../components/TopNavigationBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { logoBase64 } from "./string";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const Challan = () => {
  const [formData, setFormData] = useState({
    semester: "",
    issueDate: "",
    dueDate: "",
    tuitionFeeSubsidized: "",
    tuitionFeeNonSubsidized: "",
    utilityCharges: "",
    miscFunds: "",
    university: "Mirpur University of Science and Technology",
    universityCity: "Mirpur, Azad Kashmir",
  });

  const [studentList, setStudentList] = useState([]);
  const [Registeredsession, setRegisteredSession] = useState("");
  const [Registeredprogram, setRegisteredProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const location = useLocation();
  const { user } = location.state || {};

  const fetchStudentList = async () => {
    const bodyData = { Registeredprogram, Registeredsession, semester };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/students/students/semesterStudents",
        bodyData
      );
      setStudentList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching student list:", error);
    }
  };

  useEffect(() => {
    if (Registeredprogram && Registeredsession && semester) {
      fetchStudentList();
    }
  }, [Registeredprogram, Registeredsession, semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margin = 10;
    const columnMargin = 10;
    const columnWidth = (width - margin * 2 - columnMargin * 3) / 4;

    const sectionLabels = [
      "Bank's Copy",
      "Account's Copy",
      "Department's Copy",
      "Student's Copy",
    ];

    const addSection = (x, y, studentData, sectionIndex) => {
      const tuitionFee = studentData.subsidized
        ? parseFloat(formData.tuitionFeeSubsidized)
        : parseFloat(formData.tuitionFeeNonSubsidized);
      const totalPayment =
        tuitionFee +
        parseFloat(formData.utilityCharges) +
        parseFloat(formData.miscFunds);

      doc.setLineWidth(0.5);
      doc.rect(x, y, columnWidth, height - margin * 2);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(sectionLabels[sectionIndex], x + 10, y + 10);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Allied Bank Ltd.", x + 10, y + 30);
      doc.setFontSize(8);
      doc.text(`A/C #: 0010050686280021`, x + 10, y + 40);
      doc.text(
        `Issue Date: ${formData.issueDate} 
Due Date: ${formData.dueDate}`,
        x + 10,
        y + 75
      );
      doc.addImage(logoBase64, "PNG", x + columnWidth - 60, y + 5, 50, 50);
      doc.text(formData.university, x + 10, y + 110);
      doc.text(formData.universityCity, x + 10, y + 120);

      const sectionYCoords = [60, 120, 190, 300, 340, 430, 470];
      sectionYCoords.forEach((coord) => {
        doc.line(x, y + coord + 2, x + columnWidth, y + coord);
      });

      doc.setFontSize(9);
      doc.text(`Roll No: ${studentData.username}`, x + 10, y + 130);
      doc.text(`Name: ${studentData.fullName}`, x + 10, y + 140);
      doc.text(`Semester: ${studentData.semester}`, x + 10, y + 160);
      doc.text(`Session: ${studentData.session}`, x + 10, y + 180);

      doc.setFontSize(8);
      doc.setTextColor(255, 0, 0);
      doc.text("Description:", x + 10, y + 210);
      doc.text("Amount (Rupees)", x + columnWidth - 70, y + 210);

      if (studentData.subsidized) {
        doc.text("Tuition Fee (Subsidized):", x + 10, y + 230);
        doc.text(tuitionFee.toString(), x + columnWidth - 50, y + 230);
      } else {
        doc.text("Tuition Fee (Non-Subsidized):", x + 10, y + 230);
        doc.text(tuitionFee.toString(), x + columnWidth - 50, y + 230);
      }

      doc.text("Utility Charges:", x + 10, y + 250);
      doc.text(
        formData.utilityCharges.toString(),
        x + columnWidth - 50,
        y + 250
      );

      doc.text("Miscellaneous Funds:", x + 10, y + 270);
      doc.text(formData.miscFunds.toString(), x + columnWidth - 50, y + 270);

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 255);
      doc.text("TOTAL PAYMENT UPTO Due Date:", x + 10, y + 290);
      doc.text(totalPayment.toString(), x + columnWidth - 50, y + 290);

      doc.setFontSize(4);
      doc.setTextColor(0, 0, 0);
      doc.text("DEPOSITOR", x + 10, y + 310);
      doc.text("NAME:", x + 10, y + 320);
      doc.text("CONTACT NO:", x + columnWidth - 100, y + 320);
      doc.text("CNIC:", x + 10, y + 330);
      doc.text("SIGNATURE:", x + columnWidth - 100, y + 330);

      doc.rect(x + 25, y + 312, 68, 9);
      doc.rect(x + columnWidth - 70, y + 312, 68, 9);
      doc.rect(x + 25, y + 322, 68, 9);
      doc.rect(x + columnWidth - 70, y + 322, 68, 9);

      doc.setFontSize(7);
      doc.text("Terms and Conditions:", x + 10, y + 350, {
        maxWidth: columnWidth - 20,
      });
      doc.text(
        "Cash/Cheque should always be deposited at the respective counter and electronic computer generated receipt/printout through failed printer on deposit slip/challan should be obtained before leaving the counter. Please be sure to check the receipt and satisfy that complete details including account number and amount deposited are correctly printed failing which the bank will not be responsible.",
        x + 10,
        y + 360,
        { maxWidth: columnWidth - 20 }
      );
      doc.text(
        "On expiry of every due date new challan need to be generated, no manual alteration/authentication accepted.",
        x + 10,
        y + 470,
        { maxWidth: columnWidth - 20 }
      );

      doc.text("Authorized Signature", x + 10, y + 500);
    };

    studentList.forEach((student, index) => {
      if (index > 0) {
        doc.addPage();
      }
      for (let i = 0; i < 4; i++) {
        addSection(
          margin + i * (columnWidth + columnMargin),
          margin,
          student,
          i
        );
      }
    });

    const pdfDataUri = doc.output("datauristring");
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = "challan.pdf";
    link.click();
    setFile({
      dataUri: pdfDataUri,
      name: "challan.pdf",
      type: "application/pdf",
    });
  };

  const getBase64 = (dataUri) => {
    return dataUri.split(",")[1];
  };

  const onUpload = async () => {
    if (!file) {
      alert("Please select the PDF file before uploading.");
      return;
    }
    if (!Registeredprogram && !Registeredsession && !semester) {
      alert("Please select Program, session and semester to upload challan");
      return;
    }

    try {
      const base64File = getBase64(file.dataUri);
      const data = {
        program: Registeredprogram,
        session: Registeredsession,
        semester: semester,
        fileData: base64File,
        fileName: file.name,
        mimeType: file.type,
      };

      const response = await axios.post(
        "http://localhost:3000/api/challan/uploadChallan",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("File uploaded successfully.");
      } else {
        alert(`Failed to upload file: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({
          dataUri: reader.result,
          name: selectedFile.name,
          type: selectedFile.type,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  };

  return (
    <div>
       <TopNavigationBar gotopath="CoordinatorProfile"/>
      <div className="form-container">
        <h2 className="ManageChallanHeadings">Manage Challan</h2>
        <form>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Semester:</label>
            <select
              className="ManageStudentOptionInputs2"
              name="semester"
              value={semester}
              onChange={handleSemesterChange}
            >
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Session:</label>
            <select
              className="ManageStudentOptionInputs2"
              value={Registeredsession}
              onChange={(e) => setRegisteredSession(e.target.value)}
            >
              <option value="">Select Session</option>
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Program:</label>
            <select
              className="ManageStudentOptionInputs2"
              value={Registeredprogram}
              onChange={(e) => setRegisteredProgram(e.target.value)}
            >
              <option value="">Select Program</option>
              {user.assignedDepartments.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Issue Date:</label>
            <input
              className="ChllanInputs"
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
            />
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Due Date:</label>
            <input
              className="ChllanInputs"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">
              Tuition Fee (Subsidized):
            </label>
            <input
              className="ChllanInputs"
              type="number"
              name="tuitionFeeSubsidized"
              value={formData.tuitionFeeSubsidized}
              onChange={handleChange}
              placeholder="Add Tuition Fee for Subsidized here"
            />
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">
              Tuition Fee (Non-Subsidized):
            </label>
            <input
              className="ChllanInputs"
              type="number"
              name="tuitionFeeNonSubsidized"
              value={formData.tuitionFeeNonSubsidized}
              onChange={handleChange}
              placeholder="Add Tuition Fee for Non-Subsidized here"
            />
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Utility Charges:</label>
            <input
              className="ChllanInputs"
              type="number"
              name="utilityCharges"
              value={formData.utilityCharges}
              onChange={handleChange}
              placeholder="Add Utility Charges here"
            />
          </div>
          <div className="challanInputLabelWrapper">
            <label className="inputlableChallan">Miscellaneous Funds:</label>
            <input
              className="ChllanInputs"
              type="number"
              name="miscFunds"
              value={formData.miscFunds}
              onChange={handleChange}
              placeholder="Add Miscellaneous Funds here"
            />
          </div>
        </form>
        <button className="CHallanGenrateButton" onClick={generatePDF}>
          Generate Challan
        </button>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button className="CHallanGenrateButton" onClick={onUpload}>
          Upload
        </button>
      </div>
    </div>
  );
};
