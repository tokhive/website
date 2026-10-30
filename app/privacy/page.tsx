import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Draft privacy policy for TokHive account information, API processing, encrypted credentials, diagnostics and payment records.",
  robots: { index: false, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "scope", title: "Scope and privacy contact",
    content: <>
      <p>This policy covers personal information processed through the TokHive website, Console, APIs and Bee connections. It describes account, operational and financial records as well as the handling of requests and upstream credentials.</p>
      <p>The legal operator&apos;s identity, address and applicable privacy jurisdictions remain to be completed. For privacy questions or requests in the meantime, contact <a href="mailto:hello@tokhive.ai?subject=Privacy%20request">hello@tokhive.ai</a>. This is a review draft, not a claim of compliance with every jurisdiction&apos;s requirements.</p>
    </>,
  },
  {
    id: "information", title: "Information processed",
    content: <ul>
      <li><strong>Account and access information.</strong> Email address, account identifiers, password hashes, session records, API key metadata and security or account-recovery settings. Authentication secrets and password values have different handling from public key names or prefixes.</li>
      <li><strong>Bee and subscription metadata.</strong> Device identifiers, connected platforms, subscription capabilities, account status, availability, quota reports and encrypted credential envelopes.</li>
      <li><strong>API requests and responses.</strong> Prompts, messages, attachments, tool data and generated output that you submit or request for model processing.</li>
      <li><strong>Usage and operational records.</strong> Request IDs, models, timestamps, token counts, price snapshots, settlement evidence, error records, IP addresses and technical logs needed to operate and secure the service.</li>
      <li><strong>Financial and support records.</strong> Buyer and earnings balances, charges, settlements, transfers, blockchain addresses and transaction references, together with information you send in support messages.</li>
    </ul>,
  },
  {
    id: "credentials", title: "Local sign in and encrypted credentials",
    content: <>
      <p>Providers sign in to upstream subscription accounts on their own computers. Local sign-in and credential maintenance can involve plaintext credentials on that local device. Bee encrypts upstream access credentials with the TEE public key before uploading them. Hive holds encrypted envelopes and the metadata needed to manage them.</p>
      <p>The protected TEE execution environment decrypts the access credentials for authorized upstream requests. They are not exposed to other buyers or through public model and earnings endpoints. This protection does not remove the need to secure your own computer or the upstream account.</p>
      <p>Platform API keys and Bee device credentials are separate from upstream subscription credentials. Do not send any of these secrets, or wallet private keys, in support email.</p>
    </>,
  },
  {
    id: "request-content", title: "Request content and diagnostics",
    content: <>
      <p>Hive receives and processes buyer API requests for routing and execution, including transformations required by the selected API. Requests are forwarded through the TEE to the relevant upstream AI service. The upstream service receives the content needed to perform inference and processes it under its own applicable terms and privacy practices.</p>
      <p>When no Provider subscription account can take a request, it may instead be sent through the TEE to a third-party API reseller, currently wokey, which passes it on to the model vendor. The reseller then receives the request and response content and processes it under its own terms and privacy practices, which TokHive does not control. Fallback is on by default; you can turn it off under Fallback Supply in your account settings, and calls served this way are marked in your call records.</p>
      <p>Bee relays encrypted upstream traffic and does not expose buyer request or response content to the Provider through the normal relay path. This does not mean Hive itself never processes request content.</p>
      <p>When failure diagnostics are enabled, a failed request&apos;s body and related upstream response content can be written to diagnostic files for troubleshooting. Content may therefore be present in diagnostic storage; this policy does not make a zero-content-retention promise. Deployment settings, access controls and retention for these records need to be confirmed before this draft becomes effective.</p>
      <p>Only send information you are authorized to disclose to TokHive and the relevant upstream service. Avoid unnecessary sensitive information in prompts or support messages.</p>
    </>,
  },
  {
    id: "purposes", title: "Purposes and legal bases",
    content: <>
      <p>Information is used to authenticate accounts, provide model access, maintain authorized subscription connections, route requests, calculate charges, settle earnings, provide records and support, investigate failures, prevent fraud and comply with legal obligations.</p>
      <p>Where applicable law requires a legal basis, the proposed bases are performance of the service agreement, compliance with legal obligations, legitimate interests in security and reliable operation where permitted, and consent where required. A final notice must match the operator&apos;s actual processing and the laws that apply to it.</p>
    </>,
  },
  {
    id: "sharing", title: "Recipients and public information",
    content: <>
      <p>Information necessary to fulfill a request is shared with the relevant upstream AI service and, for requests served through fallback, with the third-party API reseller that serves them. Hosting, infrastructure, security and support providers may process information needed for their functions. Required disclosures may also be made to authorities or other parties where legally required or necessary to protect legal rights.</p>
      <p>Public model listings and earnings summaries contain market-level information. They do not disclose individual provider identities, account balances, emails or prompts through those endpoints.</p>
      <p>Blockchain transactions can expose addresses, amounts and transaction history publicly. Public blockchain data is not controlled by TokHive and generally cannot be removed by closing an account. Third-party sites reached through our links have their own policies.</p>
    </>,
  },
  {
    id: "cookies", title: "Cookies and browser controls",
    content: <>
      <p>The Console uses an authentication session cookie to keep you signed in and support account security. Public model and earnings endpoints can be read without an authenticated session. Blocking or clearing cookies may prevent account features from working or sign you out.</p>
      <p>Website hosting and network services can process technical connection information when you visit. Any optional analytics, advertising technologies or additional cookies require their own accurate disclosures and any consent required by applicable law.</p>
    </>,
  },
  {
    id: "retention", title: "Retention and deletion",
    content: <>
      <p>Retention depends on the record&apos;s purpose, account activity, security needs, disputes and applicable accounting or legal obligations. Financial records and settlement evidence may need to remain after account closure; deleting an account does not necessarily remove records we are required or entitled to retain.</p>
      <p>Diagnostic files, operational logs, account records, encrypted envelopes and backups can have different lifecycles. Specific record-by-record periods and deletion procedures remain under review. This draft does not adopt the illustrative retention periods shown in earlier website mockups or promise immediate deletion from all backups.</p>
      <p>You can contact us to request deletion and an explanation of records that must be retained. Public blockchain records remain outside our deletion control.</p>
    </>,
  },
  {
    id: "international", title: "Processing locations and safeguards",
    content: <>
      <p>Hosting providers, upstream AI services, third-party API resellers and support functions may process information in countries other than your own. Processing locations and any required transfer safeguards must be confirmed for the deployment before publication of an effective notice.</p>
      <p>Security measures include encrypted transport, access controls and TEE encryption for uploaded upstream access credentials. No service or encryption system removes every security risk, and users remain responsible for protecting their own devices and secrets.</p>
    </>,
  },
  {
    id: "rights", title: "Your choices and rights",
    content: <>
      <p>Depending on the law that applies, you may have rights to access, correct, delete or receive a copy of personal information, restrict or object to processing, withdraw consent, and complain to the relevant data protection authority. These rights can be subject to lawful exceptions, including recordkeeping duties and the rights of others.</p>
      <p>Send requests to <a href="mailto:hello@tokhive.ai?subject=Privacy%20request">hello@tokhive.ai</a>. We may need proportionate verification that you control the relevant account before acting. Do not include passwords, API keys or wallet private keys. You can also revoke API keys and stop sharing through the available account or Bee controls.</p>
    </>,
  },
  {
    id: "changes", title: "Updates and related policies",
    content: <>
      <p>A final policy will identify its effective date, operator and applicable details. Material changes to processing will be communicated and any required consent obtained. New data uses must be covered by an accurate disclosure rather than silently added to an earlier privacy promise.</p>
      <p>See the <Link href={LINKS.terms}>Terms of Service</Link> for account and payment rules and the <Link href={LINKS.aup}>Acceptable Use Policy</Link> for restrictions on content and account misuse.</p>
    </>,
  },
];

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" summary="How account information, requests, encrypted credentials and settlement records are handled." href={LINKS.privacy} sections={sections} reviewNote="Deployment-specific retention periods and processing locations also remain under review." />;
}
