import React, { Component } from "react";
import { Link } from "react-router-dom";
import JobProfile from "../components/JobProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import "./components/css/table.css";

// import SvgIcon from "../components/SvgIcon";
import { BASE_URL } from "../CONSTANTS";
import { ExportJsonCsv } from "react-export-json-csv";

const tableFields = [
  "#",
  "Enrollment",
  "Full Name",
  "Backlogs",
  "CGPA",
  "profile",
];

const headings = [
  "srno",
  "enrollmentNumber",
  "fullName",
  "backlogs",
  "cgpa",
  "profile",
];

const headingColumnsCsv = [
  {
    key: "enrollmentNumber",
    name: "Enrollment Number",
  },
  {
    key: "fullName",
    name: "Full Name",
  },
  {
    key: "gender",
    name: "Gender",
  },
  {
    key: "contactNo",
    name: "Contact Number",
  },
  {
    key: "email",
    name: "Email",
  },
  {
    key: "passoutBatch",
    name: "Passout year",
  },
  {
    key: "backlogs",
    name: "Backlogs",
  },
  {
    key: "cgpa",
    name: "CGPA",
  },
  {
    key: "linkedInURL",
    name: "LinkedIn",
  },
  {
    key: "resumeUrl",
    name: "Resume",
  },
];

const stuData = [];

const getAppliedStudents = async url => {
  try {
    const data = await fetch(`${BASE_URL}${url}`, {
      method: "get",
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("token")).token,
      },
    });

    const retData = await data.json();

    console.log("data", retData);

    return retData;
  } catch (err) {
    console.error("Error in getting Job Details", err);
  }
};

class JobProfileTpo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      studentsApplied: [],
    };
  }

  componentDidMount() {
    const url = window.location.pathname + "/students";
    const jobId = url.split("/").slice(-1)[0];
    // console.log(url);
    // this.setState({id:ret});

    getAppliedStudents(url).then(val => {
      this.setState({
        studentsApplied: val,
        id: jobId,
      });
    });
  }

  render() {
    stuData.splice(0, stuData.length);

    const students = this.state.studentsApplied.map((val, index) => {
      val = {
        srno: index + 1,
        ...val,
      };

      // console.log("val", val);
      let rowData = [];

      headings.forEach(key => {
        rowData.push({
          key,
          value: val[key],
        });
      });

      // console.log("r", rowData);

      return (
        <tr key={val._id}>
          {rowData.map((data, index) => {
            if (data.key === "profile") {
              return (
                <td key={index} data-heading={data.key}>
                  <Link to={`/studentprofile/${val._id}`}>
                    <FontAwesomeIcon
                      icon={faArrowAltCircleRight}
                      className="ml-2 website-arrow-icon"
                    />
                  </Link>
                </td>
              );
            }
            return (
              <td key={index} data-heading={data.key}>
                {data.value}
              </td>
            );
          })}
        </tr>
      );
    });

    return (
      <div className="flex flex-col overflow-hidden">
        <JobProfile />
        <div className="table-container my-5">
          <div
            className="table-container__title"
            style={{ justifyContent: "space-around" }}
          >
            <h2>Applied Students</h2>
            <ExportJsonCsv
              headers={headingColumnsCsv}
              items={this.state.studentsApplied}
            >
              Download Data
            </ExportJsonCsv>
          </div>
          <table className="table-container__table  table-container__table--break-md">
            <thead>
              <tr>
                {tableFields.map((val, ind) => {
                  return <th key={ind}>{val}</th>;
                })}
              </tr>
            </thead>
            <tbody>{students}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default JobProfileTpo;
