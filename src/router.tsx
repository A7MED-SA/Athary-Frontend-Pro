import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LandingPage from './features/landing/LandingPage';
import CourseCatalog from './features/catalog/CourseCatalog';
import CourseDetails from './features/catalog/CourseDetails';
import CartCheckout from './features/cart/CartCheckout';
import AuthPage from './features/auth/AuthPage';
import StudentDashboard from './features/student/StudentDashboard';
import InstructorDashboard from './features/instructor/InstructorDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import AboutContactPublic from './features/about/AboutContactPublic';
import ProfileSettings from './features/profile/ProfileSettings';
import PublicProfile from './features/profile/PublicProfile';
import NotFound from './components/layout/NotFound';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'catalog', element: <CourseCatalog /> },
      { path: 'course/:courseId', element: <CourseDetails /> },
      { path: 'checkout', element: <CartCheckout /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'instructor', element: <InstructorDashboard /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'about', element: <AboutContactPublic /> },
      { path: 'profile', element: <ProfileSettings /> },
      { path: 'instructor/:name', element: <PublicProfile /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
