"use client";

import React, { useState } from "react";
import styles from "./Newsletter.module.css";
import Button from "@/components/ui/Button";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Simulate async subscribe — wire up to Supabase / Mailchimp later
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>Stay in the Loop</span>
          <h2 id="newsletter-heading" className={styles.heading}>
            New drops. <em className={styles.accent}>No noise.</em>
          </h2>
          <p className={styles.sub}>
            Subscribe for early access to collections, exclusive offers, and
            studio events in Brampton.
          </p>
        </div>

        {status === "success" ? (
          <div className={styles.success} role="alert">
            <span className={styles.successIcon}>✓</span>
            <p>You&apos;re in. Watch your inbox.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
            />
            <Button
              type="submit"
              size="lg"
              variant="primary"
              className={status === "loading" ? styles.loading : ""}
            >
              {status === "loading" ? "…" : "Subscribe"}
            </Button>
            {status === "error" && (
              <p id="newsletter-error" className={styles.error} role="alert">
                Something went wrong. Try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
