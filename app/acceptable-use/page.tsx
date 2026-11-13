import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "Draft rules for lawful use of TokHive AI access, subscription sharing, credentials and payment systems.",
  robots: { index: false, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "scope", title: "Who this policy covers",
    content: <>
      <p>This policy applies to buyers, Providers, organizations, applications and agents using TokHive. It covers the website, Console, APIs, Bee software and activity performed through an account or API key you control.</p>
      <p>Use the service lawfully, respect the rights of others and follow the restrictions of the upstream service you access. These rules apply alongside the <Link href={LINKS.terms}>Terms of Service</Link>. Data processing is described in the <Link href={LINKS.privacy}>Privacy Policy</Link>.</p>
    </>,
  },
  {
    id: "authorization", title: "Authorized accounts and access",
    content: <ul>
      <li>Use only subscription accounts, credentials, devices and funds that you own or are authorized to use and share. Confirm that upstream terms permit your activity.</li>
      <li>Do not use stolen accounts, sell another person&apos;s credentials, impersonate an account holder or make false claims about subscription permissions.</li>
      <li>Do not evade a suspension, geographic restriction, usage limit, authorization requirement or other access control by rotating identities, devices or keys.</li>
      <li>Keep API keys, Bee credentials and local account files secure. Do not request another user&apos;s secrets or publish them.</li>
    </ul>,
  },
  {
    id: "harm", title: "Illegal and harmful activity",
    content: <ul>
      <li>Do not facilitate violence, terrorism, human trafficking, sexual exploitation or abuse, including any sexual exploitation of children.</li>
      <li>Do not use the service for fraud, phishing, scams, deceptive impersonation, theft, extortion or deliberate manipulation of victims.</li>
      <li>Do not engage in targeted harassment, threats, doxxing or discriminatory abuse.</li>
      <li>Do not create or distribute unlawful content or instructions that meaningfully enable serious physical harm. Lawful analysis, prevention and safety research remain subject to appropriate authorization and safeguards.</li>
    </ul>,
  },
  {
    id: "security", title: "Cybersecurity and platform integrity",
    content: <ul>
      <li>Do not access systems or data without authorization, steal secrets, deploy malware or perform destructive attacks.</li>
      <li>Do not attack Hive, Bee, the TEE, upstream services or other users; interfere with routing; or attempt to extract another user&apos;s prompts, output or credentials.</li>
      <li>Do not forge execution receipts, alter usage evidence, manipulate metering or settlement, falsify supply capabilities, or exploit billing discrepancies.</li>
      <li>Do not overwhelm the service, bypass rate or concurrency limits, or run unauthorized scanning and denial-of-service activity.</li>
      <li>Security testing requires authorization from the owner of the affected system. A public endpoint or open-source repository is not permission to test production systems or other users.</li>
    </ul>,
  },
  {
    id: "privacy", title: "Privacy and intellectual property",
    content: <>
      <p>Only submit content, personal data, code, images or documents that you have permission and a lawful basis to process and disclose. Respect confidentiality obligations, copyright, trademarks and other rights.</p>
      <p>Do not collect sensitive personal information through deception, expose private information without authorization, conduct unlawful surveillance or use generated output to facilitate identity theft. Do not present another person&apos;s identity or work as your own in a deceptive or unlawful way.</p>
    </>,
  },
  {
    id: "responsible-output", title: "Responsible use of AI output",
    content: <>
      <p>AI output can be incorrect or misleading. Use appropriate human review and safeguards before applying output to decisions affecting health, safety, legal rights, finances or other consequential interests. You remain responsible for how your application uses and presents results.</p>
      <p>Do not misrepresent the source or capabilities of a model, falsely claim professional approval, or use automation to evade upstream safeguards. Comply with any disclosure, consent and human-review obligations that apply to your use.</p>
    </>,
  },
  {
    id: "payments", title: "Payments and financial abuse",
    content: <>
      <p>Do not use TokHive for money laundering, stolen payment activity, sanctions evasion, fraudulent deposits or withdrawals, or concealment of unlawful funds. Do not manipulate contribution records or fabricate activity to claim earnings.</p>
      <p>Use only supported payment assets and networks and a withdrawal destination you are authorized to use. Do not send private keys or recovery phrases to support or other users. The US$10 withdrawal minimum does not authorize activity prohibited by this policy.</p>
    </>,
  },
  {
    id: "enforcement", title: "How violations are handled",
    content: <>
      <p>We may investigate credible reports, restrict requests, revoke compromised keys, pause supply or suspend access when reasonably necessary to address a violation, security threat or legal obligation. Urgent protective action may be taken before a review is complete.</p>
      <p>Reviews may use account, request, usage, settlement and diagnostic information described in the Privacy Policy. This policy does not promise that every request is monitored or every form of misuse will be detected.</p>
      <p>Where appropriate and legally permitted, we will explain a restriction and offer a way to request review. Actions concerning balances, refunds or records must follow applicable law and the effective agreement; a restriction does not by itself establish that all accrued earnings are forfeited.</p>
    </>,
  },
  {
    id: "reports", title: "Reports and review requests",
    content: <>
      <p>Report suspected misuse or request review of an account restriction at <a href={LINKS.email}>hello@tokhive.ai</a>. Include the relevant account or request identifiers, a concise explanation and evidence you are authorized to share.</p>
      <p>Report security vulnerabilities privately through <a href={LINKS.reportVulnerability}>GitHub private vulnerability reporting</a> on tokhive/tee. Avoid accessing other users&apos; data, disrupting service or publishing exploit details before they can be addressed. Never include passwords, access tokens or wallet private keys in a report.</p>
    </>,
  },
  {
    id: "updates", title: "Policy updates",
    content: <p>The final policy will state its effective date. We may revise these rules to address service changes, threats or legal requirements, with notice or consent where required. TokHive, Inc., registered in Singapore, operates the service; its registered address and jurisdiction details remain to be completed before this draft takes effect.</p>,
  },
];

export default function AcceptableUsePage() {
  return <LegalDocument title="Acceptable Use Policy" summary="Requirements for lawful, authorized and responsible use of TokHive." href={LINKS.aup} sections={sections} />;
}
