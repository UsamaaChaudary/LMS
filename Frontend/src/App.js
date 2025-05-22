import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import CanteenDashboard from './components/CanteenDashboard';
import AddItem from './components/AddItem';
import DeleteItem from './components/DeleteItem';
import ItemList from './components/ItemList';
import NewOrders from './components/NewOrders';
import OrderFood from './components/OrderFood';
import UploadAssignment from './components/UploadAssignment';
import ViewAssignments from './components/ViewAssignments';
import MarkAttendance from './components/MarkAttendance';
import AdminDashboard from './components/AdminDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import AddBook from './components/AddBook';
import AvailableBooks from './components/AvailableBooks';
import DeleteBook from './components/DeleteBook';
import MyApprovals from './components/MyApprovals';
import RequestBook from './components/RequestBook';
import NewApplications from './components/NewApplications';
import UploadResult from './components/UploadResult';
import UploadQuiz from './components/UploadQuiz';
import Results from './components/Results';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PersonalInfo from './components/PersonlInfo';
import AcademicForm from './components/Academic';
import SelectProgramForm from './components/SelectProgram';
import OnlineTest from './components/OnlineTest';
import MeritList from './components/MeritList';
import AddCourseForm from './components/AddCourseForm';
import FeeConfirmation from './components/FeeConfirmation';
import CoursePage from './components/CourseList';
import ProtectedRoute from './components/ProtectedRoute';
import AddTeacher from './components/AddTeacher';
import AddStudent from './components/AddStudent';
import UploadNews from './components/UploadNews';
import Approvals from './components/Approvals';
import AdmissionSignup from './components/AdmissionSignup';
import AdmissionLogin from './components/AdmissionLogin';
import OnlineFee from './components/OnlineFee';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/admission/personalinfo" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
                <Route path="/admission/academic" element={<ProtectedRoute><AcademicForm /></ProtectedRoute>} />
                <Route path="/admission/selectprogram" element={<ProtectedRoute><SelectProgramForm /></ProtectedRoute>} />
                <Route path="/admission/onlinetest" element={<OnlineTest />} />
                <Route path="/admission/meritlist" element={<MeritList />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
                <Route path="/canteen-dashboard" element={<CanteenDashboard />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/delete-item" element={<DeleteItem />} />
                <Route path="/item-list" element={<ItemList />} />
                <Route path="/new-orders" element={<NewOrders />} />
                <Route path="/order-food" element={<OrderFood />} />
                <Route path="/upload-assignment" element={<UploadAssignment />} />
                <Route path="/view-assignments" element={<ViewAssignments />} />
                <Route path="/mark-attendance" element={<MarkAttendance />} />
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/available-books" element={<AvailableBooks />} />
                <Route path="/delete-books" element={<DeleteBook />} />
                <Route path="/request-book" element={<RequestBook />} />
                <Route path="/my-approvals" element={<MyApprovals />} />
                <Route path="/new-applications" element={<NewApplications />} />
                <Route path="/upload-result" element={<UploadResult />} />
                <Route path="/upload-quiz" element={<UploadQuiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/addcourse" element={<AddCourseForm />} />
                <Route path="/courses" element={< CoursePage/>} />
                <Route path="/fee" element={< FeeConfirmation/>} />
                <Route path="/add-teacher" element={<AddTeacher />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/upload-news" element={<UploadNews />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/admission/signup" element={<AdmissionSignup />} />
                <Route path="/admission/login" element={<AdmissionLogin />} />
                <Route path="/admission/login" element={<AdmissionLogin />} />
                <Route path="/submit-fee" element={<OnlineFee />} />
             

                
                
            </Routes>
        </Router>
    );
}

export default App;