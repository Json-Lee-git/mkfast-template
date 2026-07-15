# 小红书运营系统技术结合备忘录

> 阶段：开发前技术讨论。
> 目的：说明这套小红书运营系统如果验证通过，未来怎么接进当前
> `mkfast-template` 项目。
> 边界：这是调研/讨论文档，不是开发任务；当前不改业务代码。

相关文档：

- 调研交付总报告：`docs/growth/xiaohongshu-ops-system-final-report.md`
- 调研包总索引：`docs/growth/xiaohongshu-ops-system-index.md`
- 产品讨论决策稿：`docs/growth/xiaohongshu-ops-system-decision-brief.md`
- 调研收束讨论稿：`docs/growth/xiaohongshu-ops-system-discussion-memo.md`
- 证据审计与缺口清单：`docs/growth/xiaohongshu-ops-system-evidence-audit.md`
- 系统蓝图：`docs/growth/xiaohongshu-ops-system-blueprint.md`
- 无代码表格模板：`docs/growth/xiaohongshu-ops-system-no-code-template.md`
- 真实商品验证方案：`docs/growth/xiaohongshu-ops-system-validation-plan.md`
- 规则核验备忘录：`docs/growth/xiaohongshu-ops-system-rule-check.md`

## 1. 当前项目技术底盘

当前项目是一个已经具备 SaaS 雏形的应用，不是空项目。

从代码结构看，它主要由这些部分组成：

| 能力 | 当前位置 | 对小红书系统的意义 |
| --- | --- | --- |
| TanStack Start + React 19 | `src/routes/`、`src/server.ts` | 可以承载 Web 工作台、仪表盘、表单和报告页面 |
| 文件路由 | `src/routes/` | 可以按模块拆出商品库、对标库、内容计划、数据回填页面 |
| Server Functions | `src/api/` | 适合做 CRUD、AI 拆解、复盘建议、规则检查 |
| D1 + Drizzle | `src/db/` | 适合存商品、供应商、对标、计划、指标、规则 |
| Better Auth | `src/auth/` | 可以复用登录、用户、会话、权限基础 |
| 支付模块 | `src/payment/`、`src/api/payment.ts` | 验证后可做订阅/买断/人工服务，不适合第一步就用 |
| AI 调用 | `src/api/ai.ts`、`src/api/ai-readiness/ai.ts` | 可以复用为对标拆解、内容计划、复盘建议 |
| 邮件与通知 | `src/mail/`、通知 webhook 线索 | 后续可做日报、复盘提醒、人工服务通知 |
| 内容/SEO 页面 | `content/`、`src/routes/blog` 等 | 可以沉淀公开方法论、案例和获客内容 |

所以，如果 7 天无代码验证跑通，这个项目本身适合承接成 Web SaaS 或内部运营工作台。

但它不适合跳过验证直接开工。当前最大风险不是技术实现，而是用户是否愿意录入、执行和回填。

## 2. 最适合复用的模块

### 2.1 Auth 和用户体系

可复用：

- 用户注册登录。
- 登录态保护。
- 管理员/普通用户分层。
- 后续项目空间、团队空间、付费状态判断。

小红书系统里可以映射为：

| 当前能力 | 未来业务对象 |
| --- | --- |
| user | 运营者、商家、内部研究员 |
| session | 登录状态 |
| admin middleware | 模板库、规则库、人工审核后台 |
| payment status | 付费版本、人工服务权限 |

第一版开发时，建议先做单用户空间，不急着做团队权限。团队权限会把协作、审计、数据隔离和计费复杂度一起带进来。

### 2.2 D1 + Drizzle 数据层

当前 `src/db/app.schema.ts` 已经有非 auth 业务表，例如 payment、userFiles、checkerSubmissions、reportTokens、manualAuditOrders、monitorRequests、webhookEvents、aiUsage、conversionEvents、aiVisibilitySnapshots。

这说明项目已经在用“业务表集中放在 app.schema.ts，再通过 schema.ts 合并导出”的模式。

未来小红书模块可以沿用这个模式。

建议后续表名：

| 未来表 | 来源于无代码表 | 用途 |
| --- | --- | --- |
| `xhsProducts` | Products | 商品候选、状态、评分、下一步动作 |
| `xhsSuppliers` | Suppliers | 货源、成本、履约、售后风险 |
| `xhsBenchmarks` | Benchmarks | 对标笔记、店铺、商品、截图证据 |
| `xhsTemplates` | Templates | 模板库、机制、适配类目、风险标签 |
| `xhsContentPlans` | ContentPlans | 标题、封面、正文结构、测试批次 |
| `xhsPublishing` | Publishing | 发布排期、账号、链接、状态 |
| `xhsMetrics` | Metrics | 曝光、互动、加购、成交、退款、负反馈 |
| `xhsRules` | Rules | 规则、来源、核验日期、风险提示语 |
| `xhsValidationRuns` | 验证方案 | 一轮 7 天测试的聚合记录 |

不建议一开始把所有字段都产品化。开发版可以先保留 P0 字段，让其余字段进 `notes` 或 `metadataJson`，等真实使用稳定后再结构化。

### 2.3 Server Functions

当前项目用 `createServerFn()` 承载后端逻辑。小红书系统也适合走这条路，而不是另起传统 API 层。

未来可以新增：

```text
src/api/xhs/products.ts
src/api/xhs/suppliers.ts
src/api/xhs/benchmarks.ts
src/api/xhs/content-plans.ts
src/api/xhs/metrics.ts
src/api/xhs/rules.ts
src/api/xhs/ai.ts
```

适合放在 server function 里的动作：

- 新建商品候选。
- 计算选品评分。
- 保存对标样本。
- 生成 7 天内容测试计划。
- 保存每日数据回填。
- 生成复盘建议。
- 做发布前风险检查。

不适合放进去的动作：

- 自动登录小红书。
- 自动采集私域平台内容。
- 自动发布笔记。
- 绕过平台权限抓数据。
- 替用户自动判定官方合规。

### 2.4 AI 能力

当前项目已经有 Workers AI 和部分 AI 调用封装，还存在 AEO 审计场景中的结构化提示词和结果解析经验。

小红书系统里 AI 的位置应该是：

| 环节 | AI 适合做 | AI 不该做 |
| --- | --- | --- |
| 商品录入 | 帮用户拆人群、场景、痛点 | 替用户判断货源可靠 |
| 对标拆解 | 拆标题、封面、正文、评论机制 | 抄袭或复刻原文 |
| 内容计划 | 生成测试方向和标题备选 | 编造销量、反馈、清仓事实 |
| 风险检查 | 提醒可能存在的虚假、IP、功效风险 | 声称自动合规 |
| 数据复盘 | 根据回填数据建议下一步 | 替用户决定继续投钱或进货 |

技术上可以用已有 AI 封装，但产品上必须保留人工确认。

### 2.5 文件和截图证据

`userFiles` 表已经提供了用户文件元数据的模式，虽然 `wrangler.jsonc` 里当前注释显示 R2 尚未启用。

小红书系统会非常依赖截图证据：

- 对标笔记截图。
- 商品链接截图。
- 千帆/商家后台规则截图。
- 数据回填截图。
- 供应商沟通截图。
- 封面素材图。

建议未来这样处理：

| 阶段 | 做法 |
| --- | --- |
| 无代码验证 | 先把截图放飞书附件或网盘 |
| 内部原型 | 只存外链和简短证据摘要 |
| Web SaaS | R2 启用后再存附件和缩略图 |

没有 R2 之前，不要为了截图证据把数据库塞成大文本或 base64。

### 2.6 支付、邮件、通知

支付、邮件、通知都已经有基础，但不建议早用。

合理顺序是：

1. 无代码验证跑通。
2. 内部工作台证明节省时间。
3. 有 3-5 个真实案例。
4. 再用支付模块做订阅、买断或人工服务。
5. 再用邮件/通知做复盘提醒、周报、交付通知。

这类能力属于放大器，不属于验证器。

## 3. 未来路由形态

当前项目有 `dashboard`、`admin`、`settings` 等路由目录。

小红书系统未来可以有两种接法：

### 3.1 作为用户工作台

```text
src/routes/dashboard/xhs.tsx
src/routes/dashboard/xhs.products.tsx
src/routes/dashboard/xhs.products.$productId.tsx
src/routes/dashboard/xhs.benchmarks.tsx
src/routes/dashboard/xhs.content-plans.tsx
src/routes/dashboard/xhs.metrics.tsx
src/routes/dashboard/xhs.rules.tsx
```

适合目标：给用户自己使用。

优点：

- 和现有 dashboard 心智一致。
- 能直接复用登录、导航、付费判断。
- 适合后续做 SaaS。

缺点：

- 一旦上线就是正式产品，需要更完整的 UX 和权限控制。

### 3.2 作为内部运营后台

```text
src/routes/admin/xhs.tsx
src/routes/admin/xhs.products.tsx
src/routes/admin/xhs.validation-runs.tsx
src/routes/admin/xhs.rules.tsx
src/routes/admin/xhs.templates.tsx
```

适合目标：先给内部研究和代运营使用。

优点：

- 版本可以更粗糙。
- 更适合验证规则库、模板库、人工服务流程。
- 不需要一开始解决所有用户体验问题。

缺点：

- 用户无法自助使用。
- 价值验证更偏服务，不一定能证明 SaaS 留存。

我的建议：

**如果无代码验证通过，第一版 Web 也先做内部运营后台，不急着开放给用户。**

原因是小红书系统涉及规则、截图、对标、商品和执行复盘，早期需要人工判断很多。先做内部工具，比直接做用户端更容易控质量。

## 4. 无代码表到数据库的映射

无代码阶段的 8 张表可以直接成为未来数据库雏形，但字段需要分级。

### 4.1 P0 字段必须结构化

这些字段会频繁筛选、排序、统计，应该进正式列：

- userId
- productId
- status
- category
- productType
- cost
- price
- score
- nextAction
- benchmarkUrl
- evidenceStrength
- planStatus
- publishStatus
- publishedAt
- views
- likes
- saves
- comments
- addToCart
- orders
- refunds
- riskLevel
- verifiedAt
- createdAt
- updatedAt

### 4.2 P1 字段可先放 JSON

这些字段早期会变，适合先进 JSON：

- 场景描述。
- 标题结构拆解。
- 封面构图说明。
- 评论区打法。
- 风险解释。
- AI 输出草稿。
- 供应商沟通记录。
- 复盘长文本。

等验证后再决定哪些字段值得独立成列。

### 4.3 附件只存引用

截图、图片、视频、文件不进 D1。

D1 只存：

- r2Key。
- 外链。
- 原始文件名。
- 内容类型。
- 文件大小。
- 上传人。
- 关联对象。

## 5. 分阶段路线图

### Phase 0：继续无代码验证

目标：

- 用飞书多维表格跑 3 个真实商品。
- 验证字段是否过重。
- 验证用户是否愿意每天回填。
- 验证系统能否给出下一步动作。

技术动作：

- 不开发。
- 不建表。
- 不接 AI 接口。
- 不做自动化。

完成条件：

- 至少 2 个商品完整跑完。
- 至少 1 个商品产生真实下一步决策。
- 至少 1 个规则风险被识别。

### Phase 1：内部运营后台

目标：

- 把飞书表里跑通的 P0 字段搬进后台。
- 让内部人员更快录入、评分、复盘。

可能功能：

- 商品候选 CRUD。
- 对标样本 CRUD。
- 内容计划 CRUD。
- 每日数据回填。
- 选品评分计算。
- 规则风险标签。
- 简单筛选视图。

不做：

- 用户自助 onboarding。
- 团队协作。
- 支付。
- 自动采集。
- 自动发布。

### Phase 2：AI 辅助工作流

目标：

- 把最费脑子的步骤半自动化。

可能功能：

- 对标链接/截图的人工摘要后，AI 拆解结构。
- 根据商品和对标生成 7 天测试计划。
- 根据数据回填生成复盘建议。
- 发布前风险提醒。

关键原则：

- AI 产出必须可编辑。
- AI 不编造经营事实。
- AI 不声称自动合规。
- AI 输出要保存提示词版本和生成时间。

### Phase 3：用户端工作台

目标：

- 让真实商家自己使用。

可能功能：

- 项目/商品空间。
- 商品录入向导。
- 对标证据上传。
- 内容计划生成。
- 每日回填提醒。
- 周复盘报告。
- 导出飞书/CSV。

进入条件：

- 内部后台已经服务过真实用户。
- 用户知道为什么要填这些字段。
- 每日回填能压到 3 分钟以内。

### Phase 4：商业化

可选模式：

| 模式 | 说明 | 前提 |
| --- | --- | --- |
| 订阅 | 按月使用工作台和 AI 次数 | 用户端留存已验证 |
| 买断报告 | 单个商品/店铺诊断报告 | 人工服务流程成熟 |
| 人工陪跑 | 7 天或 30 天小红书实物电商验证 | 有可交付 SOP |
| 模板库会员 | 买模板、案例和规则更新 | 模板库足够厚 |

项目已有支付能力，但商业化不应早于价值验证。

### Phase 5：外部集成

只有在规则和用户价值都清晰后，再考虑：

- 千帆数据手动导入。
- CSV 导入。
- 第三方数据平台链接管理。
- 浏览器插件。
- 半自动截图归档。
- 小红书开放平台 API 接入。
- 服务市场/内容工具类目上架。

仍不建议做：

- 自动切号。
- 自动登录。
- 自动发布。
- 绕过权限采集。
- 把服务市场上架作为 MVP 前提。

## 6. Cloudflare Workers 约束

当前项目运行在 Cloudflare Workers 体系里，开发时要注意：

| 约束 | 对小红书系统的影响 |
| --- | --- |
| Workers 不是传统 Node 服务器 | 不要依赖本地文件系统、长进程、Node-only 包 |
| D1 适合结构化数据 | 商品、计划、指标、规则适合进 D1 |
| 大文件应放对象存储 | 截图、图片、视频不要进 D1 |
| AI 调用要注意成本和超时 | AI 功能要有额度、降级和错误提示 |
| 外部请求应服务端执行 | 对标摘要、规则检查、AI 处理不要暴露密钥 |

虽然项目启用了 `nodejs_compat`，但仍应按 Workers 思维设计，不把它当完整 Node 后端。

## 7. 安全与合规边界

小红书运营系统最容易踩的不是代码 bug，而是数据和平台边界。

### 7.1 私域资料

当前研究来自飞书 SOP 和知识星球资料。进入产品后，应只沉淀：

- 方法论。
- 字段结构。
- 分类标签。
- 自己的风控解释。
- 用户自己上传的证据。

不应把私域原文、截图、课程内容直接产品化展示。

### 7.2 用户数据

必须避免：

- 暴露用户店铺后台截图。
- 暴露客户姓名、手机号、地址、订单号。
- 未脱敏保存快递面单。
- 把用户货源链接开放给其他用户。

建议：

- 截图上传前提示脱敏。
- 订单/面单类证据默认高风险。
- 对标库分公共模板和用户私有证据。

### 7.3 平台动作

系统可以建议用户怎么准备和复盘，但不应替用户做高风险平台动作。

不建议第一版做：

- 自动发布笔记。
- 自动挂车。
- 自动评论。
- 自动私信。
- 自动批量采集。
- 自动切换账号。

这些动作会把产品从“经营辅助”推向“平台自动化工具”，风险和维护成本都明显上升。

## 8. 开发前进入条件

只有满足这些条件，才值得从调研进入开发讨论：

| 条件 | 为什么重要 |
| --- | --- |
| 3 个真实商品至少跑完 2 个 | 证明流程不是只在样本里成立 |
| 每个商品至少 3 条对标 | 防止 AI 凭空创作 |
| 用户能接受字段数量 | 防止产品变成填表负担 |
| 每日回填能控制在 3 分钟 | 决定留存 |
| 至少形成 1 次明确下一步动作 | 证明系统不只是记录 |
| 后台规则截图完成首轮核验 | 防止系统给出不可靠建议 |
| 明确第一版是内部后台还是用户端 | 决定路由、权限和 UX 范围 |

如果这些条件没满足，最应该做的是继续改无代码模板，不是写代码。

## 9. 推荐技术结论

这个项目适合承接小红书运营系统，但承接顺序应该是：

```text
无代码验证 -> 内部运营后台 -> AI 辅助 -> 用户端工作台
-> 商业化 -> 外部集成
```

最早的开发版本不应该追求“完整系统”，而应该追求：

```text
把已经验证有效的经营动作，变成更快、更稳、更少出错的内部工具。
```

因此，当前最优决策仍然是：

**先用飞书多维表格完成真实验证；验证通过后，再用当前项目做内部运营后台。**
