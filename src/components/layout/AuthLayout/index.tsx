// Authlayout.tsx
import { ReactNode } from "react";
// Create this component if it doesn't exist
import { useRouter } from "next/router";
import Script from "next/script";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <meta charSet="utf-8" />
      <meta name="author" content="codexcoder" />
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <link rel="icon" type="image/png" href="assets/images/favicon.png" /> */}
      <link rel="icon" href="favicon.jpg" />
      {/* ====== All css file ========= */}
      <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="assets/css/icofont.min.css" />
      <link rel="stylesheet" href="assets/css/lightcase.css" />
      <link rel="stylesheet" href="assets/css/animate.css" />
      <link rel="stylesheet" href="assets/css/swiper-bundle.min.css" />
      <link rel="stylesheet" href="assets/css/style.min.css" />
      {/* site title */}
      <title>SINGH DOMAIN APP</title>

      <header className="header home-4">
        <div className="container-fluid">
          <div className="header__content">
            <div
              className="header__logo"
              style={{
                cursor: "pointer",
              }}
              onClick={() => window.location.assign("/")}
            >
              <img src="assets/images/Singhlogo.png" alt="logo" />
            </div>
          </div>
        </div>
      </header>

      {children}
      <Script
        type="text/javascript"
        src="//cdn.cookie-script.com/s/5e71a1d889e7c51c0ceaa267315f3831.js"
      ></Script>
    </div>
  );
};

export default AuthLayout;
