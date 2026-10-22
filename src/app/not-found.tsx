import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Large 404 */}
      <p
        className="font-display font-900 text-[120px] sm:text-[180px] leading-none select-none"
        style={{
          background: "linear-gradient(135deg, rgba(75,10,168,0.3) 0%, rgba(124,58,237,0.15) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="font-display text-3xl sm:text-4xl font-800 text-white -mt-4 mb-4">
        Page Not Found
      </h1>
      <p className="text-base max-w-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/#contact" className="btn-secondary">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
