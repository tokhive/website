import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Draft terms covering TokHive accounts, model access, provider participation, pricing, deposits, settlement and withdrawals.",
  robots: { index: false, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "scope", title: "The service and these terms",
    content: <>
      <p>TokHive connects people who share access to eligible AI subscription capacity with buyers who use AI through the TokHive API. The service includes this website, the Console, APIs and Bee software.</p>
      <p>These draft terms describe the proposed rules for using those services. The service is operated by TokHive, Inc. (&ldquo;TokHive&rdquo;, &ldquo;we&rdquo; or &ldquo;us&rdquo;). Its registered address, the governing law and the court or arbitration forum have not yet been specified in this draft.</p>
      <p>The <Link href={LINKS.aup}>Acceptable Use Policy</Link> sets out prohibited conduct. The <Link href={LINKS.privacy}>Privacy Policy</Link> explains personal data processing. Separate signed agreements, if any, take priority where they expressly address the same subject.</p>
    </>,
  },
  {
    id: "accounts", title: "Accounts and authorization",
    content: <>
      <p>You must have legal capacity to use the service and enter an agreement. If acting for an organization, you must have authority to bind it. Provide accurate account information and use only accounts, credentials, funds and systems you are authorized to use.</p>
      <p>Keep login credentials, API keys and Bee device credentials secure. Revoke compromised credentials and notify us promptly. Do not share another person&apos;s account or bypass an account restriction. An API key can incur charges against its associated buyer balance.</p>
    </>,
  },
  {
    id: "providers", title: "Sharing subscription capacity",
    content: <>
      <p>Providers sign in to their upstream subscription accounts locally. Bee encrypts upstream access credentials with the TEE public key before uploading them for protected execution. Your computer must remain awake, connected to the internet and running Bee while serving requests.</p>
      <p>You can start or stop sharing. Stopping new work does not cancel completed usage or remove settled earnings; requests already in progress may finish and settle. There is no commitment in these terms to reserve quota automatically for your own requests.</p>
      <p>You are responsible for checking that your upstream subscription terms permit your use and sharing. TokHive is not an endorsement by, or an affiliation with, an upstream AI vendor. Vendors may change access, limits or availability, and earnings are not guaranteed.</p>
      <p>A vendor may limit, suspend or close an account that is shared. You bear that risk, and TokHive does not compensate for a lost or restricted subscription. When an upstream service rejects or rate-limits an account, Hive stops assigning it new requests; requests in progress may fail, failed requests do not create earnings, and settled earnings are not affected. TokHive may pause or ban an account from supply after repeated upstream rejections, a policy violation or a security concern.</p>
      <p>Each subscription account can be registered for sharing by only one TokHive account, on a first-come basis. If an account you control was registered by someone else, contact us; after verifying your control we may release it.</p>
      <p>When an OpenAI account has used up its subscription window but still has paid credits, it can continue to serve requests and the upstream service charges those credits to you until they run out or reach your overage limit. Pause sharing if you do not want them used.</p>
      <p>If you add an OpenAI Platform API key, it serves as fallback supply and is encrypted for the TEE like subscription credentials. The upstream service bills you for that usage under your own agreement with it, while your earnings follow your usual quote, less the platform commission. Your earnings can be lower than what the upstream service charges you, including for usage it prices at premium rates such as cache writes or long-context requests.</p>
      <p>Your quote for each billing item is the model&apos;s base price multiplied by your quote factor, which is either the platform default or a factor you set. Buyers pay your quote; TokHive takes the platform commission from it, and your earnings are the remainder. Requests are assigned to lower available quotes first.</p>
    </>,
  },
  {
    id: "pricing", title: "Prices and buyer charges",
    content: <>
      <p>Prices are displayed in USD per applicable unit, such as one million input, output or cached tokens. Rates reference upstream prices and may be adjusted periodically with supply and demand. Estimates and model listings are informational; displayed availability is not a reservation.</p>
      <p>A request is billed using the applicable price locked when its execution attempt is dispatched and the verified billable usage of a successfully completed request. Failed attempts are not added to settled usage charges. TokHive buyer quotes include the platform commission.</p>
      <p>A request served through fallback by a third-party API reseller, when no Provider subscription account can take it, is billed at that reseller&apos;s price for the model, locked at dispatch, without the platform commission. Reseller prices change with the reseller&apos;s own pricing, so the same model can cost a different amount depending on how a request is served, and the charge can differ from the listed price. Such calls are marked in your call records. Fallback is on by default and can be turned off in your account settings.</p>
      <p>You must maintain a positive buyer balance to start new requests. A final charge can exceed the balance available when the request began, so a balance is not a per-request spending cap. You remain responsible for valid usage charges.</p>
    </>,
  },
  {
    id: "settlement", title: "Provider earnings and settlement",
    content: <>
      <p>Successful requests with complete verified usage settle in real time after the execution evidence is accepted. Provider earnings are credited to a separate earnings balance. Failed, incomplete or unverifiable execution does not create settled earnings; interrupted settlement may require recovery before credit is confirmed.</p>
      <p>Provider earnings are distinct from the buyer&apos;s total charge and exclude the platform commission. You can transfer earnings to your buyer balance as a separate, one-way action that cannot be reversed; an earnings balance is not automatically used for API spending.</p>
      <p>Website figures described as &ldquo;paid out&rdquo; mean cumulative settled provider earnings, not completed external withdrawals. Monthly summaries use UTC settlement dates. Projections and illustrative calculators do not guarantee future income.</p>
    </>,
  },
  {
    id: "deposits", title: "Deposits",
    content: <>
      <p>You can add funds to your buyer balance by sending a supported stablecoin to the deposit address shown in the Console for the network you select. One token unit is credited as US$1. There is no minimum deposit.</p>
      <p>Send only the token and network shown with that address. Tokens sent on another network, other tokens, or transfers to any other address may not be credited and may not be recoverable. A deposit is credited once it meets the confirmation or finality requirement shown with the address; a deposit can be held for review while a network is paused or reconciliation finds a discrepancy.</p>
      <p>Deposits are not returned to the sending address. Deposited funds can be taken out only through a withdrawal under the rules below.</p>
    </>,
  },
  {
    id: "withdrawals", title: "Withdrawals and payment records",
    content: <>
      <p>Settlement and withdrawal are separate. Withdrawals, when offered, use supported Web3 stablecoins at one token unit per US$1 and have a <strong>minimum withdrawal amount of US$10</strong>. A network fee based on the actual on-chain cost is deducted from the amount you request, so you receive the requested amount less that fee. Small earnings can settle before the minimum is reached. There is no weekly or Monday settlement schedule.</p>
      <p>You can withdraw the part of your buyer balance that comes from on-chain deposits, earnings you have transferred from your earnings balance, and refunded withdrawals. To withdraw earnings, first transfer them to your buyer balance. Credits granted by TokHive, such as administrator, promotional or bonus credits, can be spent on API usage but cannot be withdrawn, and usage charges draw on those credits first.</p>
      <p>Each withdrawal requires an authenticator app and a one-time code. A destination address can be used 24 hours after you add it, and you can keep up to 20 addresses. You cannot request a withdrawal while you have API requests in progress or awaiting settlement. A withdrawal above US$1,000, or one that would take the day&apos;s automatically approved withdrawals above US$5,000 (UTC), is held for manual review and may be approved or rejected; a rejected withdrawal is refunded to your balance. Per-transfer and daily limits may also apply.</p>
      <p>Use only the asset, network and destination supported by the withdrawal instructions. Review any disclosed fees and confirmation requirements before authorizing a transfer. Stablecoins can lose value, and blockchain transfers may be irreversible; an unsupported network or incorrect address may prevent recovery.</p>
      <p>Keep your own payment and tax records and meet obligations that apply to you. Contact us with transaction references or request IDs for billing corrections, refunds or balance questions. Requests will be assessed under applicable law and payment conditions presented to you; mandatory consumer rights are not waived.</p>
    </>,
  },
  {
    id: "content", title: "Your requests and AI output",
    content: <>
      <p>You retain the rights you hold in content you submit. You authorize the processing and transmission needed to fulfill requests, operate the service, verify usage and handle security or support issues as described in the Privacy Policy.</p>
      <p>Only submit content you have permission to use and disclose to the applicable upstream service. AI output may be inaccurate, incomplete, offensive or similar to output provided to others. Check results before relying on them, especially for consequential decisions.</p>
      <p>Upstream model terms and restrictions may also apply. These terms do not grant rights that TokHive or the upstream vendor does not hold.</p>
    </>,
  },
  {
    id: "acceptable-use", title: "Acceptable use and security",
    content: <>
      <p>Follow the <Link href={LINKS.aup}>Acceptable Use Policy</Link>, applicable law and relevant upstream restrictions. Do not use the service for unauthorized access, credential theft, exploitation, fraud, harassment or abuse of the platform or its users.</p>
      <p>Do not defeat rate limits, metering, evidence verification, credential protections or account restrictions. Security research must avoid unauthorized access to other users&apos; data or disruption; report suspected vulnerabilities to <a href="mailto:security@tokhive.ai">security@tokhive.ai</a>.</p>
    </>,
  },
  {
    id: "availability", title: "Availability and service changes",
    content: <>
      <p>Supply, model support, performance and upstream access can vary. Maintenance, exhausted subscription quota, network issues, vendor restrictions or security incidents may interrupt service. When subscription supply is short, a request may be served through a third-party API reseller, or refused if fallback is turned off or unavailable. Unless a separate agreement says otherwise, no particular uptime, model capacity, throughput or earnings level is promised.</p>
      <p>Features and supported assets may change. Material changes affecting ongoing commitments will be communicated where required. A demonstration, roadmap item or illustrative estimate is not a guarantee that a feature is available.</p>
    </>,
  },
  {
    id: "suspension", title: "Suspension and account closure",
    content: <>
      <p>We may restrict requests, disable compromised credentials or suspend access when reasonably necessary to address misuse, security threats, legal obligations or material breaches. Where practicable, we will explain the reason and provide a way to ask for review, except where doing so would create a security risk or violate law.</p>
      <p>You can stop using the service and request account closure. Stopping use does not erase valid charges or automatically forfeit legitimate settled earnings. Remaining balances, corrections and record retention are handled under applicable law and the relevant payment terms.</p>
    </>,
  },
  {
    id: "responsibility", title: "Responsibilities and mandatory rights",
    content: <>
      <p>You are responsible for your authorized use, content, local device security and upstream account permissions. We are responsible for obligations imposed on us by applicable law and any effective agreement.</p>
      <p>To the extent permitted by law, service availability and AI output are provided without a guarantee of uninterrupted operation, fitness for a particular purpose or error-free results. Nothing in these terms excludes liability or remedies that applicable law does not allow to be excluded, or limits non-waivable consumer rights.</p>
    </>,
  },
  {
    id: "changes", title: "Changes and questions",
    content: <>
      <p>Future versions will state their effective date. Material changes will be notified as required by applicable law, and consent will be requested where required. No change removes rights already accrued where the law protects them.</p>
      <p>Contact <a href={LINKS.email}>hello@tokhive.ai</a> with questions or a dispute. Include enough information to identify the issue without sending secrets. This draft remains subject to jurisdiction and legal review.</p>
    </>,
  },
];

export default function TermsPage() {
  return <LegalDocument title="Terms of Service" summary="Rules for accounts, AI access, sharing quota and handling earnings." href={LINKS.terms} sections={sections} />;
}
