'use client';
import Image from 'next/image';
import LoginPage from "./login/page";

export default function Home() {

  return (
    <>
      <LoginPage />

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <a
          href="/SultanCRM.apk"
          download
          style={{
            padding: "14px 28px",
            background: "linear-gradient(135deg, #00b894, #0984e3)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "transform 0.2s ease-in-out",
            textDecoration:'none'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/android.png" // ✅ Image must be in /public folder
            alt="android"
            width={24}
            height={24}
          />
          Download Android App
        </a>
      </div>

    </>
  );
}