# 流水线执行说明

本文说明完整公众号文章流程。跑完整写作任务时按这里执行。

## 输出目录

把 `output/` 视为完稿区。生成任何交付物前，先按执行当天本地日期创建目录：

```text
output/{YYYY-MM-DD}/
```

文章 Markdown、HTML 预览、视觉方案、数据分析报告都放在这个日期目录内。图片统一放在：

```text
output/{YYYY-MM-DD}/images/
```

Markdown 中引用文中图时使用相对路径 `images/{filename}`，这样移动或发布当天目录时不会断链。

## Step 1：读取客户配置

读取 `clients/{client}/style.yaml`。

配置优先级：

- 指定客户 `{client}` 时，优先读取 `clients/{client}/config.yaml`。
- 只有客户目录没有 `config.yaml` 时，才退回仓库根目录 `config.yaml`。

路由规则：

- 客户目录不存在：提示用户参考 `references/style-template.md` 创建配置。
- 用户给了明确主题：跳过热点抓取和选题生成，进入知识挖掘和框架选择。
- 用户给了原始 Markdown：跳过写作，直接进入排版和发布。
- 用户给了已经人工打磨好的 Markdown 且只要求排版、预览或发布：跳过 Step 5.5，直接进入 Step 7。
- 用户明确说“全自动”“跳过人工打磨”或“直接发布”：跳过 Step 5.5。

## Step 1.5：YouMind 知识挖掘

当 `config.yaml` 里有 `youmind.api_key` 时执行。

用 `youmind-api.js mine-topics` 按客户主题和来源 board 搜索资料，保留前 10 条作为 `knowledge_context`。有知识库支撑的选题加分。

失败时跳过，`knowledge_context` 置空。

## Step 2：抓热点

运行 `fetch_hotspots.py`，抓微博、头条、百度热点。按客户主题过滤不相关内容，并粗略标记可写性。

失败时依次降级：YouMind 网页搜索、通用网页搜索、请用户给主题。

## Step 2.5：历史去重和 SEO 评分

并行做两件事：

1. 读取 `history.yaml`，提取最近 7 天关键词，避免重复选题。
2. 对候选关键词运行 `seo_keywords.py`，估算搜索潜力。

脚本失败时可以自行估算，并标记为 estimated。

## Step 3：生成选题

阅读 `references/topic-selection.md`。生成 10 个候选选题，每个选题必须包含：

- 标题/选题表达
- 核心洞察草稿
- 热度
- 读者匹配度
- 角度价值
- 互动潜力
- 深度潜力
- 总分
- 是否近期重复
- 是否有知识库支撑

自动模式选择最高分。交互模式展示表格让用户选。

## Step 3.5：选择文章框架

阅读 `references/frameworks.md`。为选题生成 5 个框架方案，包含：

- 开头策略
- 情绪曲线
- H2 大纲
- 金句位置
- 结尾方式
- 推荐分

自动模式选最高分。交互模式展示给用户选择。

## Step 4：写正文

写作前必须阅读 `references/writing-guide.md`，如存在 `clients/{client}/playbook.md` 也必须读取。

写作要求：

- 先明确一句话核心洞察。
- 先设计情绪曲线，文章 60% 到 70% 处应有情绪或观点峰值。
- 如果有 `knowledge_context`，读取相关完整资料，自然吸收事实和视角，不要复制粘贴。
- 遵守所选框架。
- H1 标题 20 到 28 个汉字。
- 正文 1500 到 2500 字。
- 避免客户黑名单词和禁写主题。
- 不插入图片占位符，图片由 Step 6 处理。

写完后做三次自检：

1. 深度检查：至少两处进入“所以呢”的第三层。
2. 截图测试：至少有一段值得截图转发。
3. 声音检查：去 AI 味、节奏变化、具体细节、非工整结构。

不合格时先重写弱段，再进入 Step 5。

## Step 5：SEO 和去 AI 味

阅读 `references/seo-rules.md`，执行：

1. 生成 3 个标题备选并选最佳。
2. 关键词在前 200 字出现，全文自然出现 3 到 5 次。
3. 做完整去 AI 味检查。
4. 写不超过 54 个汉字的摘要。
5. 生成 5 个标签。
6. 检查段落长度、钩子间隔、节奏变化。

## Step 5.5：人工打磨确认稿

自动模式和交互模式都默认执行本步骤。只有用户明确说“全自动”“跳过人工打磨”或“直接发布”，才跳过。

执行方式：

1. 将 Step 5 完成后的 Markdown 草稿写入当天输出目录：`output/{YYYY-MM-DD}/{article}.md`。
2. 暂停流程，不进入 Step 6，不生成图片，不排版，不发布。
3. 告诉用户直接编辑这个 Markdown 文件。
4. 用户回复 `继续排版` 后，读取同一个 Markdown 文件作为人工终稿。

暂停提示必须包含：

- Markdown 文件路径
- 当前标题
- 当前摘要
- 人工打磨建议检查项：开头是否够快、案例是否真实、语气是否像账号本人、是否有不想发布的表达
- 继续口令：`继续排版`

继续后限制：

- 人工终稿是最终正文。
- AI 不再改正文观点、段落、语气和表达。
- AI 只能插入图片 Markdown、修正图片路径、生成 HTML/发布所需结构。
- 如果人工终稿缺少 H1 标题、标题明显不符合公众号规则、图片路径断链，先提示用户确认，不自行重写正文。

## Step 6：视觉设计和生图

阅读 `references/visual-prompts.md`。

生成图片前必须问用户两件事：

1. 图片范围：封面+文中图、仅封面、仅文中图、不要图片。结构化提问可用 `AskUserQuestion`，选项值建议映射为 `cover + inline images`、`cover only`、`inline only`、`no images`。
2. 风格方向：跟随文章调性，或用户指定的插画、电影感、极简、科技、温暖编辑风等。

默认推荐“封面+文中图”和“跟随文章调性”。

封面给 3 个创意方向，每个方向包含概念、英文 prompt、色彩方案。prompt 必须包含 `no text, no letters, no words`。

文中图选择数据、场景、转折段落，避免放在纯观点、开头钩子和结尾 CTA。

## Step 7：排版并发布

默认发布到微信公众号草稿箱。

使用 `cli.js publish`，主题和颜色来自 `style.yaml` 或用户覆盖参数。若有封面，带上 `--cover`。

发布指定客户时，必须让 CLI 读取客户目录下的配置。推荐做法是在 `clients/{client}` 目录作为工作目录运行发布命令，Markdown、封面和输出路径使用相对路径回到仓库根目录。例如发布 `xdt` 时从 `clients/xdt` 运行，这样优先读取 `clients/xdt/config.yaml`；发布 `xx` 时从 `clients/xx` 运行，优先读取 `clients/xx/config.yaml`。

发布失败时生成本地 HTML 预览，并把路径告诉用户。

## Step 7.5：历史记录和归档

追加到 `clients/{client}/history.yaml`：

- 日期
- 标题
- 选题来源
- 关键词
- 知识库引用
- 框架
- 字数
- media_id
- 主题
- human_polished: true/false
- polish_stage: "step_5_5" 或 "skipped"
- stats: null

如果配置了 `youmind.save_board`，把文章归档到 YouMind。

## Step 8：最终汇报

告诉用户：

- 最终标题，以及 2 个备选标题和策略
- 摘要
- 标签
- 主题和颜色
- media_id
- 是否已进入草稿箱
- 哪些步骤使用了降级
