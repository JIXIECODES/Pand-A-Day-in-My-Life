import React from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import SignUpForm from "../components/SignUpForm.jsx";

export default function SignUpPage({ onShowLogin }) {
  return (
    <AuthLayout eyebrow="Pand-A Day in My Life" title="Create your panda account">
      <SignUpForm onShowLogin={onShowLogin} />
    </AuthLayout>
  );
}