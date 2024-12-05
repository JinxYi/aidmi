import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate } from "@refinedev/react-router-v6";
import { Outlet, Route, Routes } from "react-router-dom";

import AiderLayout from "@/layouts/aider-layout";
import MimiLayout from "@/layouts/mimi-layout";
import PublicLayout from "@/layouts/public-layout";
import ConfirmEmailSent from "@/pages/confirm-email-sent";
import ConsultationEnded from "@/pages/consult-ended";
import ConsultationPage from "@/pages/consultation";
import ForgetPasswordEmailSent from "@/pages/email-sent";
import ForgotPassword from "@/pages/forgot-password";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import PatientList from "@/pages/patients/list";
import PatientDetails from "@/pages/patients/show";
import Register from "@/pages/register";
import UpdateProfile from "@/pages/update-profile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Layout */}
      <Route
        element={
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        }
      >
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/forgot-password/email-sent"
          element={<ForgetPasswordEmailSent />}
        />
        <Route path="/confirm-email-sent" element={<ConfirmEmailSent />} />
        <Route path="/consult/end" element={<ConsultationEnded />} />
      </Route>
      {/* mimi routes */}
      <Route
        element={
          <Authenticated
            key="authenticated-inner-patient"
            fallback={<CatchAllNavigate to="/login" />}
          >
            <MimiLayout>
              <Outlet />
            </MimiLayout>
          </Authenticated>
        }
      >
        <Route path="/consult" element={<ConsultationPage />} />
      </Route>
      <Route
        element={
          <Authenticated
            key="public-inner-patient-2"
            fallback={<CatchAllNavigate to="/login" />}
          >
            <Outlet />
          </Authenticated>
        }
      >
        <Route path="/profile" element={<UpdateProfile />} />
      </Route>
      {/* aider routes */}
      <Route
        element={
          <Authenticated
            key="authenticated-inner"
            fallback={<CatchAllNavigate to="/login" />}
          >
            <AiderLayout>
              <Outlet />
            </AiderLayout>
          </Authenticated>
        }
      >
        {/* Define sider nav items here */}
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="/patients" element={<PatientList />} />
      </Route>
      {/* admin routes */}
      {/* <Route
        element={
          <Authenticated
            key="authenticated-inner"
            fallback={<CatchAllNavigate to="/login" />}
          >
            <AiderLayout>
              <Outlet />
            </AiderLayout>
          </Authenticated>
        }
      >
        <Route path="/a/clinician" element={<ClinicianList />} />
        <Route path="/a/clinician/create/:id" element={<CreateClinician />} />
      </Route>
      */}
    </Routes>
  );
};

export default AppRoutes;
