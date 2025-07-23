"use client";

import { useParams } from "next/navigation";

export default function page() {
  const params = useParams<{ id: string }>();

  const verifyEmail = async () => {
    const response = await fetch(
      `http://localhost:5000/email-verification/${params.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    console.log(data);
  };

  verifyEmail();

  return <div className="h-screen w-full"></div>;
}
