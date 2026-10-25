import { StepList } from "@/components/StepList";

const STEPS = [
  {
    t: "Enclave-locked relay",
    d: "Provider credentials are protected inside an AMD SEV-SNP confidential VM. Nobody at TokHive can read them.",
  },
  {
    t: "Official endpoints only",
    d: "The enclave pins TLS to vendor certificates, so it cannot route to a proxy or a cheaper model.",
  },
  {
    t: "Signed receipt per call",
    d: "Every response carries an attestation report you can check with our open-source verifier.",
  },
];

export function VerifiedOrigin() {
  return (
    <section className="verified-origin site-container grid items-center gap-20 py-[120px] max-[899px]:gap-12 max-[899px]:py-20 min-[900px]:grid-cols-[360px_1fr]">
      <div className="seal-desktop relative mx-auto flex h-[368px] w-[320px] items-center justify-center max-md:hidden">
        <svg width="320" height="368" viewBox="0 0 320 368" className="absolute inset-0" aria-hidden="true">
          <polygon points="160,4 316,94 316,274 160,364 4,274 4,94" fill="none" stroke="#C8F031" strokeWidth="1.5" />
          <polygon
            points="160,36 288,110 288,258 160,332 32,258 32,110"
            fill="rgba(200,240,49,.06)"
            stroke="rgba(200,240,49,.4)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        </svg>
        <div className="relative flex flex-col items-center gap-2.5 text-center">
          <span className="eyebrow">TEE ATTESTED</span>
          <span className="text-[64px] leading-none font-bold tracking-[-0.04em]">100%</span>
          <span className="text-sm text-text-2">official endpoints</span>
        </div>
      </div>
      <div className="flex items-center gap-5 md:hidden">
        <div className="relative flex h-32 w-28 shrink-0 items-center justify-center">
          <svg viewBox="0 0 320 368" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <polygon points="160,4 316,94 316,274 160,364 4,274 4,94" fill="none" stroke="#C8F031" strokeWidth="4" />
            <polygon
              points="160,36 288,110 288,258 160,332 32,258 32,110"
              fill="rgba(200,240,49,.06)"
              stroke="rgba(200,240,49,.4)"
              strokeWidth="2"
              strokeDasharray="6 10"
            />
          </svg>
          <span className="relative text-[26px] font-bold tracking-[-.04em]">100%</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="eyebrow">TEE ATTESTED</span>
          <p className="text-sm leading-[1.5] text-text-2">Official vendor endpoints only, with proof on every call.</p>
        </div>
      </div>
      <div className="flex flex-col gap-7">
        <h2 className="h2 max-w-[680px]">No resellers of resellers. No swapped models. Proof attached.</h2>
        <StepList steps={STEPS} className="grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6" />
      </div>
    </section>
  );
}
