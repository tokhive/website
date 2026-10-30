"use client";

import { Fragment } from "react";
import { useNetworkSnapshot } from "@/components/network/useNetworkSnapshot";
import { SAMPLE_MEASUREMENT, verifyTerminal } from "@/lib/mock/security";
import { shortMeasurement } from "@/lib/public-network";

export function VerifyTerminal() {
  const measurement = useNetworkSnapshot()?.attestations.measurement;
  return (
    <code>
      {verifyTerminal(measurement ? shortMeasurement(measurement) : SAMPLE_MEASUREMENT).map((l, i) => (
        <Fragment key={i}>
          <span style={{ color: l.c }}>{l.t}</span>
          {"\n"}
        </Fragment>
      ))}
    </code>
  );
}
