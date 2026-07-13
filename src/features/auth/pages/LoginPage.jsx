import React from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import LoginForm from "../components/LoginForm.jsx";

export default function LoginPage({ onEnterApp, onShowSignUp }) {
  return (
    <AuthLayout title="Are you ready to save and raise a panda?">
      <LoginForm onEnterApp={onEnterApp} onShowSignUp={onShowSignUp} />
    </AuthLayout>
  );
}
