import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./CourseContents.css";
import { TopNavigationBar } from "../../../../components/TopNavigationBar";
import axios from "axios";

const fetchContent = async (requestBody) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/courseContents/getContentDetails",
      requestBody
    );
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching course content:", error);
  }
};

const fetchCourseContentFile = async (id) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/courseContents/getContentFile",
      { id }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course content file:", error);
  }
};

const deleteCourseContent = async (id) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/courseContents/deleteContent",
      { id }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting course content:", error);
  }
};

export const CourseContents = () => {
  const [content, setContent] = useState([]);
  const [currentContent, setCurrentContent] = useState({
    title: "",
    description: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const location = useLocation();
  const { students } = location.state || {};
  const [uploadedContent, setUploadedContent] = useState([]);
  const courseId = useSelector((state) => state.auth.courseId);
  const session = students?.[0]?.session;
  const program = students?.[0]?.program;

  const fetchData = async () => {
    const requestBody = { program, session, courseId };
    const data = await fetchContent(requestBody);
    setUploadedContent(data);
  };
  useEffect(() => {
    if (!session || !program || !courseId) {
      return;
    }

    fetchData();
  }, [courseId, program, session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContent({ ...currentContent, [name]: value });
  };

  const handleAddUpdateContent = () => {
    if (editingIndex !== null) {
      const updatedContent = content.map((item, index) =>
        index === editingIndex ? currentContent : item
      );
      setContent(updatedContent);
      setEditingIndex(null);
    } else {
      setContent([...content, { ...currentContent, uploadedFile: null }]);
    }
    setCurrentContent({ title: "", description: "" });
  };

  const handleEditContent = (index) => {
    setCurrentContent(content[index]);
    setEditingIndex(index);
  };

  const handleDeleteContent = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    const updatedContent = content.map((item, i) =>
      i === index ? { ...item, uploadedFile: file } : item
    );
    setContent(updatedContent);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadToServer = async (index) => {
    const contents = content[index];
    if (!contents.uploadedFile) {
      alert("Please choose a file to upload");
      return;
    }

    try {
      const base64File = await getBase64(contents.uploadedFile);

      const data = {
        title: contents.title,
        description: contents.description,
        courseId: courseId,
        session: students[0]?.session,
        program: students[0]?.program,
        fileData: base64File.split(",")[1],
        fileName: contents.uploadedFile.name,
        mimeType: contents.uploadedFile.type,
      };

      const response = await fetch(
        "http://localhost:3000/api/courseContents/uploadData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to upload data:", errorData);
        alert(`Failed to upload data: ${errorData.message}`);
        return;
      }

      alert("Data uploaded successfully");
      fetchData()
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading data");
    }
  };

  const triggerFileInput = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handleDownloadFile = async (id) => {
    try {
      const contentFile = await fetchCourseContentFile(id);
      const link = document.createElement("a");
      link.href = `data:${contentFile.mimeType};base64,${contentFile.fileData}`;
      link.download = contentFile.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDeleteUploadedContent = async (id) => {
    try {
      await deleteCourseContent(id);
      fetchData()
      setUploadedContent(uploadedContent.filter((item) => item._id !== id));
      alert("Content deleted successfully");
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Error deleting content");
    }
  };

  return (
    <div>
      <TopNavigationBar gotopath="TeacherProfile" />
      <div className="Assignmentcontainer">
        <h2 className="center-text">Add Course Content</h2>
        {students?.length === 0 ? (
          <p style={{ textAlign: "center" }}>No registered students.</p>
        ) : (
          <>
            <div className="form-container">
              <input
                type="text"
                name="title"
                value={currentContent.title}
                onChange={handleInputChange}
                placeholder="Content Title"
                className="input-field"
              />
              <textarea
                name="description"
                value={currentContent.description}
                onChange={handleInputChange}
                placeholder="Content Description"
                className="input-field"
              />
              <button onClick={handleAddUpdateContent} className="btn">
                {editingIndex !== null ? "Update Content" : "Add Content"}
              </button>
            </div>
            <div className="assignments-list">
              <ul className="assignment-items">
                {content.map((item, index) => (
                  <div key={index}>
                    <h3 className="center-text">Content List</h3>
                    <li key={index} className="assignment-item">
                      <div className="assignment-item-content">
                        <p>
                          <strong>Title: </strong> {item.title}
                        </p>
                        <p>
                          <strong>Description: </strong> {item.description}
                        </p>
                      </div>
                      <div className="assignment-item-actions">
                        <div>
                          <button
                            onClick={() => handleEditContent(index)}
                            className="btn-small"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteContent(index)}
                            className="btn-small"
                          >
                            Delete
                          </button>
                        </div>
                        <div>
                          <input
                            type="file"
                            id={`completed-file-input-${index}`}
                            onChange={(e) => handleFileUpload(e, index)}
                            className="file-input"
                          />
                          <button
                            onClick={() =>
                              triggerFileInput(`completed-file-input-${index}`)
                            }
                            className="custom-file-button"
                          >
                            Choose File
                          </button>
                          <button
                            onClick={() => handleUploadToServer(index)}
                            className="custom-file-button"
                          >
                            Upload
                          </button>
                          {item.uploadedFile && (
                            <a
                              href={URL.createObjectURL(item.uploadedFile)}
                              download={item.uploadedFile.name}
                              className="download-link"
                            >
                              Download {item.uploadedFile.name}
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="UploadedContentHeading">Uploaded Content</h2>
              <div>
                {uploadedContent?.length > 0 ? (
                  uploadedContent.map((item) => (
                    <div className="uploadedContentWrapper4" key={item._id}>
                      <div>
                        <p>
                          <strong>Title: </strong>
                          {item.title}
                        </p>
                        <p>
                          <strong>Description: </strong>
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDownloadFile(item._id)}
                          className="custom-file-button"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteUploadedContent(item._id)}
                          className="delete-file-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>
                    No content uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
