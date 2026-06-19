// app/enable-admin/page.jsx

"use client";

import { useEffect } from "react";

export default function EnableAdmin() {
  useEffect(() => {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "/";
  }, []);

  return <p>Enabling Admin...</p>;
}