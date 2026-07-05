import React from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import SignUpForm from "../components/SignUpForm.jsx";

export default function SignUpPage({ onEnterApp, onShowLogin }) {
  return (
    <AuthLayout eyebrow="Pand-A Day in My Life" title="Create your panda account">
      <SignUpForm onEnterApp={onEnterApp} onShowLogin={onShowLogin} />
    </AuthLayout>
  );
}
