import studentModel from "../model/student.model.js";
import { generateToken } from "../utills/jwt.js";

const genrateRandomId = () => {
  const id = Math.floor(10000000 + Math.random() * 10000000);
  return id;
};

const genrateRandomPassword = () => {
  const string = "abcdefghijklmnopqrstuvwxyz1234567890";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += string[Math.floor(Math.random() * string.length)];
  }

  return password;
};

//  create user
export const createStudent = async (req, res) => {
  try {
    const { fullName, mobileNo, aadhar } = req.body;
    const mobilregix = /^[6-9]\d{9}$/;

    if (!mobilregix.test(mobileNo)) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid mobile number",
      });
    }

    if (!fullName || !mobileNo || !aadhar) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }
    const existingStudent = await studentModel.findOne({ mobileNo });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already registered with this number",
      });
    }

    // files access
    const tenthDMC = req.files["tenthDMC"]?.[0]?.path;
    const sign = req.files["sign"]?.[0]?.path;
    const photo = req.files["photo"]?.[0]?.path;

    if (!tenthDMC || !sign || !photo) {
      return res.status(400).json({
        success: false,
        message: "Please upload all documents",
      });
    }
    const newStudent = await studentModel.create({
      fullName,
      mobileNo,
      aadhar,
      tenthDMC,
      sign,
      photo,
    });
    return res.status(200).json({
      success: true,
      message: "Student Registered successfully",
      data: newStudent,
    });
  } catch (error) {
    console.log("error from create student ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create 100 students

// export const createStudent = async (req, res) => {
//   try {
//     const { fullName, mobileNo, aadhar } = req.body;

//     const mobileregix = /^[6-9]\d{9}$/;

//     if (!mobileregix.test(mobileNo)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid mobile number",
//       });
//     }

//     const tenthDMC = req.files?.["tenthDMC"]?.[0]?.path;
//     const sign = req.files?.["sign"]?.[0]?.path;
//     const photo = req.files?.["photo"]?.[0]?.path;

//     if (!tenthDMC || !sign || !photo) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload all documents",
//       });
//     }

//     let students = [];

//     for (let i = 0; i < 100; i++) {

//       let newMobile = (Number(mobileNo) + i).toString();
//       let newAadhar = (Number(aadhar) + i).toString();

//       students.push({
//         fullName: `${fullName} ${i + 1}`,
//         mobileNo: newMobile,
//         aadhar: newAadhar,
//         tenthDMC,
//         sign,
//         photo,
//       });
//     }

//     const createdStudents = await studentModel.insertMany(students);

//     return res.status(200).json({
//       success: true,
//       message: `${createdStudents.length} students created`,
//       data: createdStudents,
//     });

//   } catch (error) {
//     console.log("Bulk create error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// get user by id

export const getUserById = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student Id is required",
      });
    }
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).json({
      success: false,
      message: ` Internal server error ${error.message}`,
    });
  }
};

// update student status
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    // check student id
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student Id is required",
      });
    }

    // find student
    const student = await studentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // generate random credentials only if they don't exist
    if (!student.randomId && !student.randomPassword) {
      student.randomId = genrateRandomId();
      student.randomPassword = genrateRandomPassword();
    }

    // update status
    student.status = status;

    // save student
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.log("error from update student", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all student
export const getAllStudent = async (req, res) => {
  try {
    // Validate query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive numbers",
      });
    }

    const startIndex = (page - 1) * limit;

    // Fetch total count for pagination info
    const totalStudents = await studentModel.countDocuments();

    // Fetch students with pagination and newest first
    const students = await studentModel
      .find({
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          // { mobileNo: { $regex: search, $options: "i" } },
          // { aadhar: { $regex: search, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    if (students.length < 1) {
      return res.status(404).json({
        success: false,
        message: "Students not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All students fetched successfully",
      data: students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
      },
    });
  } catch (error) {
    console.log("error from get all student ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student Id is required",
      });
    }

    const deletedStudent = await studentModel.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log("error from delete student ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// login student
export const loginStudent = async (req, res) => {
  try {
    const { mobileNo, randomId, randomPassword } = req.body;

    if (!mobileNo || !randomId || !randomPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const student = await studentModel.findOne({ mobileNo });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Account not found with this mobile number",
      });
    }
    if(!student.status){
      return res.status(400).json({
        success: false,
        message: "Your account is inactive now",
      });

    }

    if (
      randomId !== student.randomId ||
      randomPassword !== student.randomPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({ studentId: student._id });
  
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token : token,
      data: student,
    });
  } catch (error) {
    console.log("error from login student ", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
