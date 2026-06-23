import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import NotFound from './components/layout/NotFound';
import { DashboardSkeleton } from './components/shared/Skeleton';

const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const CourseCatalog = lazy(() => import('./features/catalog/CourseCatalog'));
const CourseDetails = lazy(() => import('./features/catalog/CourseDetails'));
const CartCheckout = lazy(() => import('./features/cart/CartCheckout'));
const AuthPage = lazy(() => import('./features/auth/AuthPage'));
const StudentDashboard = lazy(() => import('./features/student/StudentDashboard'));
const InstructorDashboard = lazy(() => import('./features/instructor/InstructorDashboard'));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard'));
const AboutContactPublic = lazy(() => import('./features/about/AboutContactPublic'));
const ProfileSettings = lazy(() => import('./features/profile/ProfileSettings'));
const PublicProfile = lazy(() => import('./features/profile/PublicProfile'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <DashboardSkeleton />
  </div>
);

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <LazyPage><LandingPage /></LazyPage> },
      { path: 'catalog', element: <LazyPage><CourseCatalog /></LazyPage> },
      { path: 'course/:courseId', element: <LazyPage><CourseDetails /></LazyPage> },
      { path: 'checkout', element: <LazyPage><CartCheckout /></LazyPage> },
      { path: 'auth', element: <LazyPage><AuthPage /></LazyPage> },
      { path: 'dashboard', element: <LazyPage><StudentDashboard /></LazyPage> },
      { path: 'instructor', element: <LazyPage><InstructorDashboard /></LazyPage> },
      { path: 'admin', element: <LazyPage><AdminDashboard /></LazyPage> },
      { path: 'about', element: <LazyPage><AboutContactPublic /></LazyPage> },
      { path: 'profile', element: <LazyPage><ProfileSettings /></LazyPage> },
      { path: 'instructor/:name', element: <LazyPage><PublicProfile /></LazyPage> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
