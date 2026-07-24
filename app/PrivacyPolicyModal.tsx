"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/browser-config";

type PrivacyPolicyModalProps = {
  open: boolean;
  onClose: () => void;
};

function PrivacyPolicyLine({ line, index }: { line: string; index: number }) {
  if (!line || line === "PRIVACY POLICY") return null;
  if (/^(Effective Date|Last Updated):/.test(line)) {
    return <p className="legal-meta" key={index}>{line}</p>;
  }
  if (/^\d+\.\s/.test(line)) {
    return <h4 key={index}>{line}</h4>;
  }
  if (/^[A-E]\.\s/.test(line) || line === "Submitting a Request" || line === "Exceptions") {
    return <h5 key={index}>{line}</h5>;
  }
  if (line.startsWith("* ")) {
    return <p className="legal-bullet" key={index}>{line.slice(2)}</p>;
  }
  return <p key={index}>{line}</p>;
}

export default function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  const [policyText, setPolicyText] = useState("");
  const [loadError, setLoadError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const policyUrl = assetPath("/privacy-policy.txt");

  useEffect(() => {
    if (!open || policyText) return;

    const controller = new AbortController();
    setLoadError(false);
    fetch(policyUrl, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Privacy Policy could not be loaded.");
        return response.text();
      })
      .then(setPolicyText)
      .catch(error => {
        if (error instanceof Error && error.name !== "AbortError") setLoadError(true);
      });

    return () => controller.abort();
  }, [open, policyText, policyUrl]);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  const lines = policyText.split(/\r?\n/).map(line => line.trim());

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div
        className="modal-card privacy-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="modal-head">
          <div>
            <small>Effective July 24, 2026</small>
            <h3 id="privacy-policy-title">Privacy Policy</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Privacy Policy">×</button>
        </div>
        <div className="modal-body privacy-policy-body">
          {!policyText && !loadError && <p className="legal-loading">Loading Privacy Policy…</p>}
          {loadError && (
            <p className="legal-loading">
              The policy could not be displayed here.{" "}
              <a href={policyUrl} target="_blank" rel="noreferrer">Open the text version</a>.
            </p>
          )}
          {lines.map((line, index) => <PrivacyPolicyLine line={line} index={index} key={`${index}-${line.slice(0, 20)}`}/>)}
        </div>
        <div className="modal-footer legal-modal-footer">
          <a href={policyUrl} target="_blank" rel="noreferrer">Open text version</a>
          <button className="button" type="button" onClick={onClose}>Close Privacy Policy</button>
        </div>
      </div>
    </div>
  );
}
