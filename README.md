# TokHive website

Marketing site: Home (`/`), Models & Pricing (`/models`), Network (`/network`),
Providers (`/providers`), and Security (`/security`). All five pages include mobile layouts.
Built from the design handoff in `design_handoff_tokhive_website/` (spec: its `README.md`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## 本地 Hive Mock API

网站以静态文件部署，本地 API 使用独立 Node 服务，无需安装额外依赖。在另一个终端启动：

```bash
npm run mock
```

默认地址为 `http://127.0.0.1:3001/api/public/models`。服务支持文件变更后自动重启。修改 `mock/models.json` 可调整模型及价格；修改后重新请求即可看到新数据。

接口与 Hive 的 `GET /api/public/models` 保持相同结构：无需登录，支持跨域匿名读取及 `HEAD`、`OPTIONS`。`official_prices`、`minimum_prices` 提供输入、输出及适用的缓存读取／写入价格，单位为 USD / 百万 Token，金额为十进制字符串；原有 `official_input_price`、`minimum_input_price` 保留。无可用供给时 `minimum_prices` 和 `minimum_input_price` 均为 `null`。

模型还包含 `protocol`、`cache_mode`、`context_window`（未知为 `null`）和 `capabilities`（未知为 `[]`）。能力标识为 `coding`、`reasoning`、`vision`、`long_context`。mock 数据仅使用 Hive 当前支持的 `anthropic`、`openai` 平台，按 `platform`、`id` 排序。

```bash
curl http://127.0.0.1:3001/api/public/models
MOCK_SCENARIO=empty npm run mock        # 200，空模型列表
MOCK_SCENARIO=unavailable npm run mock  # 200，所有买家价格为 null
MOCK_SCENARIO=error npm run mock        # 503，Hive 标准错误结构
MOCK_PORT=3002 npm run mock             # 自定义端口
npm run mock:test                      # HTTP 契约测试
```

`MOCK_HOST` 默认 `127.0.0.1`，`MOCK_SCENARIO` 默认 `default`。浏览器调用时无需附带凭证或自定义请求头：

```js
const response = await fetch("http://127.0.0.1:3001/api/public/models");
const { currency, unit, models } = await response.json();
```

首页的价格条和 Hive Menu 共用一次 `/api/public/models` 请求；Models 页的列表、筛选、汇总和费用计算器也共用该接口。厂商和能力筛选来自响应，金额计算保留小数精度。开发环境默认请求 `http://127.0.0.1:3001`，因此联调时同时运行 `npm run mock` 和 `npm run dev`。首页价格条不显示无供给的模型，其他位置的无供给模型显示 `Unavailable`；费用计算器不使用默认价格补位；加载失败时支持重试，不回退到示例价格。首屏固定 `−90%` 文案保持不变。

Models 页暂不展示容量、贡献者数量、延迟、吞吐量或热度排序，这些指标需接入真实统计后提供。Models 页只列出当前有报价（有在线供给）的模型，列表、筛选、汇总和费用计算器都不包含无供给的模型；汇总中的模型数即当前可报价模型数。

`NEXT_PUBLIC_HIVE_API_URL` 可覆盖 API base URL；生产构建默认使用 `https://console.tokhive.ai`。这是浏览器环境变量，修改后需重启开发服务，静态部署时需在构建前设置：

```bash
NEXT_PUBLIC_HIVE_API_URL=http://127.0.0.1:3002 npm run dev
NEXT_PUBLIC_HIVE_API_URL=https://console.tokhive.ai npm run build
```

`npm test` 验证首页客户端的接口处理及价格精度（使用 Node.js 22.18+）；`npm run mock:test` 验证 mock 的 HTTP 契约。

## 首页已结算收益

首页首屏 `paid out` 和收益区块共用一次 `GET /api/public/earnings` 请求，API base URL 同样由 `NEXT_PUBLIC_HIVE_API_URL` 决定。mock 数据位于 `mock/earnings.json`，启动后可直接访问 `http://127.0.0.1:3001/api/public/earnings`。

`paid out` 的口径为**已结算贡献收益**：Hive 汇总真实模型的 `settlements.provider_amount`，排除平台佣金、失败／未结算请求和测试模型，不使用钱包余额或提现金额。收益划转或提现不减少累计值。完整口径记录在 Hive 的 `docs/model-pricing.md`。

- `all_time_usd`：历史累计收益，两处金额展示取自同一字段。
- `monthly`：最近 12 个 UTC 月的 `{month, amount_usd}`，包含当前未完结月份，零收益月份补零。前端直接读取月份，不生成固定起止标签，也不预设柱状图持续增长。
- `average_month`、`average_monthly_provider_usd`、`earning_providers`：上一个完整 UTC 月中有正收益贡献者的人均收益、对应月份及人数；无此类贡献者时平均值为 `null`，页面说明该月无人取得正收益。
- `currency=USD`、`basis=settled_provider_earnings`、`timezone=UTC`、`as_of`：金额币种、统计口径、时区及快照截止时间。金额是十进制字符串，图表比例使用精确整数计算；展示金额按美分舍入，微小正收益显示 `<$0.01`。

Hive 默认缓存汇总一分钟。前端加载失败时显示不可用并支持重试，不回退到旧示例金额或伪装成零收益。mock 的 `empty` 场景返回零累计、12 个零收益月份和 `null` 平均值；`error` 场景返回 503；`unavailable` 只表示模型无可用供给，不会抹掉已结算收益。请求流程与 TEE 示例保持原样，首屏固定 `−90%` 保持原样。

全站收益文案口径：每笔成功请求实时结算到收益余额；提现与结算独立，最低提现金额为 **$20**，使用 **Web3 稳定币**。不承诺按周／周一支付，不宣称银行转账提现，也不指定尚未确认的代币、网络、费用或到账时间。提现门槛不会阻止小额收益实时结算。本轮仅统一网站展示规则，未实现新的提现资金流程。

## Network 页实时数据

Network 页读取两个公开接口，API base URL 同样由 `NEXT_PUBLIC_HIVE_API_URL` 决定：

- `GET /api/public/network`：KPI、在线账号（服务中／空闲）、24h／7d／30d Token 用量、模型占比与空闲容量、套餐分布、回执验证率和最近回执。页面每 60 秒轮询一次，Hive 缓存一分钟。
- `GET /api/public/network/requests`：最近 20 次已结算执行，用于实时请求流。页面每 10 秒轮询一次，按 `id` 去重；不使用 WebSocket。

字段与统计口径见 Hive 的 `docs/model-pricing.md`。页面只在标签页可见时轮询；某次轮询失败时保留上一次的数据，首次加载失败显示不可用，不回退到示例数据。

与旧 mock 相比的改动：只展示 OpenAI 和 Anthropic，不展示 Google；实时请求流显示厂商而不是地区，Hive 不记录 Provider 地区；ROUTING OVERHEAD 改为首个输出 p50，包含模型推理时间；REQUESTS / SEC 改为 24 小时请求数和单小时峰值；回执显示摘要前 12 位而不是请求 ID，上游 OpenAI 为 `chatgpt.com`；Claude Max 不区分 5x 和 20x。蜂巢图只是示意：在线 Provider 少于 30 个（`MIN_LIVE_PROVIDERS`，见 `components/network/LiveNetwork.tsx`）时，蜂巢图按固定的示例数量（服务中 1,906、空闲 1,506）闪烁，达到 30 个后按真实数量；图例中的服务中、空闲数量和页面其他数据始终是真实值。

mock 数据位于 `mock/network.json` 和 `mock/network-requests.json`，`empty`、`unavailable`、`error` 场景分别表示无流量、无在线账号和 503。

## Models 页暂缓的数据

记录日期：2026-10-26。Models 页接入公开接口时，以下原有 mock 展示已隐藏。此表记录待补工作；统计口径尚未确定，不代表接口已经支持这些字段。

| 数据 | 原 mock 字段 | 原展示位置 | 恢复前需要补齐 |
| --- | --- | --- | --- |
| 模型贡献者数量 | `providers` | 展开详情中的 `providers` / `PROVIDERS` | 明确按用户还是订阅账号去重，以及统计已上报、在线或当前可用供给中的哪一种 |
| P50 延迟 | `p50Ms` | 展开详情中的 `p50 latency` / `P50 LATENCY` | 明确首 Token 延迟还是完整请求耗时、样本范围、聚合窗口及最小样本量 |
| 输出吞吐速度 | `tokPerSec` | 展开详情中的 `throughput` / `THROUGHPUT`，单位 tok/s | 明确 Token 与耗时口径、聚合方式、统计窗口及最小样本量 |
| 模型热度 | `popularity` | 默认 `Popular` 排序 | 明确热度依据、时间窗口及排序规则；当前默认改为 `Name` |

其他一并移除或替换的示例展示：

| 展示 | 当前处理 | 恢复前需要补齐 |
| --- | --- | --- |
| 展开详情中的上游域名 `upstreamHost` / `UPSTREAM` | 随原 `LIVE · 1H` 详情区块移除；它属于模型信息，不是运行统计 | 确定公开域名的真实来源和含义，避免把静态厂商域名当作实际路由目标 |
| 页头固定 `−58% avg. vs list` | 已移除；当前汇总显示可报价模型数，以及固定月费 `$0` | 若恢复平均节省比例，需定义简单平均或用量加权、参与模型范围、无报价及官方零价的处理方式 |
| `LIVE · 1H` 标签、`last repriced 14:00 UTC` 时间，以及按小时重新定价的文案 | 已移除，不再暗示存在真实一小时统计或固定调价时间 | 提供真实统计窗口和价格更新时间，定义它们分别代表什么；请求时间不能代替价格更新时间 |

恢复顺序：先确定口径并实现 Hive 统计，再增加公开接口和对应 mock，最后恢复页面展示。运行统计拟使用 `/api/public/models/stats`；该路径目前尚未实现。上游域名、价格更新时间等字段应根据实际来源决定归属，不强行放入统计接口。

上下文长度、能力标签和完整价格已经接入 `/api/public/models`，不属于上述暂缓项。可用容量已恢复：桌面列表 `CAPACITY` 列、移动卡片进度条和 `Capacity` 排序读取 `/api/public/network` 的 `capacity`，含义是当前在线账号中该模型空闲并发的比例；没有在线供给时显示 `no supply`，接口不可用时不显示。上下文未配置时显示未知，能力未配置时不生成标签；不使用旧 mock 值补位。本记录仅覆盖 Models 页。

首页 Hero 的 `avg. −N% vs list` 按最近 24 小时各模型 Token 用量加权计算输入价节省比例：权重取自 `/api/public/network` 的 `models[].tokens`，价格取自 `/api/public/models` 的官方输入价和最低输入价，缺少任一价格的模型不计入，没有可计算的用量时不显示。首页回执示例的上游和模型取自 network 接口最新一条回执，Security 页终端示例的 measurement 取自 network 接口；接口不可用时使用示例值。页面共用一次 network 请求。

## 法律页面草稿

`/terms`、`/privacy`、`/acceptable-use` 分别提供英文服务条款、隐私政策和可接受使用政策草稿，共用 `components/legal/LegalDocument.tsx`。全站页脚、移动端简版页脚及 Providers 页政策链接均使用 `lib/links.ts` 中的统一地址。

按用户要求暂不填写运营主体名称、地址和法域。三页明确标记 `Draft for review`，不设置生效日期，并使用 `noindex, follow` 元数据。正式发布为有效政策前，还需确认主体、适用法律、实际处理地点、逐类数据保存期限、删除流程和法律审核；当前正文不得被当作完整的已生效协议。

隐私草稿依据 Hive 实现描述账户与会话、Bee 加密凭据、请求处理、结算记录，以及失败诊断可能落盘的请求／响应内容（Hive 的 `hive/internal/service/inference_diagnostics.go`）。未沿用旧示例中的零内容存储承诺、13 个月或 90 天保存期，也未把固定银行提现、reserve 功能或每周结算写入条款。提现按用户确认规则描述：Web3 稳定币、最低 $20，与实时收益结算分开。

审核参考：[FTC 关于 AI 隐私承诺的说明](https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/01/ai-companies-uphold-your-privacy-confidentiality-commitments)、[EDPS 关于数据最小化和控制者职责的术语说明](https://www.edps.europa.eu/data-protection/data-protection/glossary/d_en)。这些资料用于核对透明披露原则，不代表已经确认任何法域适用或完成合规审查。

## Deployment

The site exports static HTML to `out/`. Every push to `main` runs lint and a
production build, then deploys to GitHub Pages through `.github/workflows/deploy.yml`.
The repository's Pages publishing source must be **GitHub Actions** and its custom
domain must be **tokhive.ai**. The custom domain is configured in GitHub settings,
not through a CNAME file (the workflow publishes an Actions artifact).

Configure the following DNS records at the domain provider:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | tokhive.github.io |

After DNS propagates and GitHub issues a certificate, enable **Enforce HTTPS**
in the repository's Pages settings.

## Layout

- `app/globals.css`: design tokens (`@theme`, Tailwind v4's config) and shared utilities: `clip-hex`, `clip-chevron`, `outline-word`, `eyebrow`, `chip`, buttons.
- `components/HexField.tsx`: animated honeycomb (`flow` on Home, `sparkle` on Network). Mutates the SVG DOM directly and goes static under `prefers-reduced-motion`.
- `components/{home,models,network,providers}/`: page sections, mobile model cards and filters, and the provider earnings calculator.
- `components/Accordion.tsx`: single-open FAQs shared by Home and Providers.
- `lib/mock/*.ts`: sample data behind typed interfaces. Swap for the backend endpoints listed in the handoff spec (`/v1/models`, `/v1/network/*`, SSE stream).
- `lib/links.ts`: shared navigation, Console, legal and contact destinations. Community links remain placeholders.

The Models filters (`q`, `vendor`, `tag`, `sort`) are mirrored to the URL query string.
On mobile, filters open in a bottom sheet; pricing and network attestations use cards.
Provider earnings use sample plan rates. Legal pages are review drafts; the independent
audit and record-specific data retention still require confirmation.
Providers 页的计算器仅作示意估算，不提供额度预留设置；共享由用户手动开始或停止。页面不再宣称 reserve、自动为个人使用暂停、日限额或定时共享功能。

TEE platform copy follows the implementation in `tokhive/tee`: AWS EC2 confidential
VMs using AMD SEV-SNP, combined AMD/NitroTPM attestation and RA-TLS/mTLS. This
supersedes the Intel TDX terminology in the original design references. Attestation
examples use the `snp-app:<sha256>` application identity and remain sample data.

## Providers 页收益估算

收益计算器的套餐与 Hive 上报的套餐一致：Claude Max（不区分 5x、20x，按 $100 计算覆盖比例）、Claude Pro、ChatGPT Pro、ChatGPT Pro Lite 和 ChatGPT Plus，不再列出 Gemini。

「跑满上限」取自 `/api/public/earnings` 的 `plan_capacity`：Hive 用账号当前额度窗口内的结算收益除以窗口已用比例，推算额度全部卖出时一周的收益，每个套餐取最高值，页面乘以 30/7 换算为月收益。已用比例包含号主自用，因此单个账号的推算值偏低，取最高值最接近全部卖给 TokHive 的情况；结果随当前价格和买家模型结构变化。套餐没有合格测量（窗口已用不足 10% 或窗口内收益不足 $1）或接口不可用时使用 `lib/mock/providers.ts` 中的示例值，标注 `illustrative estimate`。估算月收益 = 跑满上限 × 未使用额度比例。

结算示例（`SETTLEMENT_EXAMPLE`）仍是示意数据，模型和金额按当前最低价粗算，未扣平台佣金。
