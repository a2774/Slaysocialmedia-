import React from "react";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p
        style={{
          padding: "12px",
        }}
      >
        Oops! The page you are looking for does not exist.
      </p>
      <div
        style={{
          padding: "12px",
        }}
      >
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
};

export default Custom404;
