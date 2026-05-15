---
name: wechat-article
version: 1.0.1
description: |
  用 AI 完成微信公众号文章从选题、资料检索、写作、去 AI 味、SEO、排版、封面配图到发布草稿箱的全流程。
  适用于“写公众号文章”“微信推文”“微信排版”“发布到草稿箱”“公众号复盘”等请求。
  支持 YouMind 知识库资料检索，也支持 YouMind、Gemini、OpenAI、豆包等多种生图 provider。
  English compatibility: write WeChat article, publish to WeChat drafts, format for WeChat.
  不用于普通博客、邮件 newsletter、PPT、短视频脚本或非微信场景的 SEO 内容。
triggers:
  - "公众号"
  - "微信公众号"
  - "微信文章"
  - "微信公众号文章"
  - "推文"
  - "草稿箱"
  - "微信排版"
  - "公众号排版"
  - "公众号写作"
  - "选题"
  - "封面图"
  - "配图"
  - "公众号配图"
  - "文章复盘"
  - "写公众号"
  - "WeChat article"
  - "wechat article"
  - "write WeChat"
  - "WeChat format"
  - "WeChat publish"
  - "publish to WeChat"
  - "WeChat drafts"
  - "给公众号写文章"
  - "发布到微信草稿箱"
  - "公众号样式"
platforms:
  - openclaw
  - claude-code
  - cursor
  - codex
  - gemini-cli
  - windsurf
  - kilo
  - opencode
  - goose
  - roo
metadata:
  openclaw:
    emoji: "✍️"
    primaryEnv: YOUMIND_API_KEY
    requires:
      anyBins: ["node", "npm", "python3"]
      env: ["YOUMIND_API_KEY"]
allowed-tools:
  - Bash(node dist/cli.js *)
  - Bash(python3 scripts/*)
  - Bash(npm install)
  - Bash(npm run build)
  - Bash([ -n "$YOUMIND_API_KEY" ] *)
---

# 微信公众号文章工作流

让 Agent 可以把一个主题、简报或 Markdown 初稿，变成一篇可以进入微信公众号草稿箱的文章。它不是单纯的“写文章提示词”，而是一套带工具链的生产流程：选题、资料、写作、SEO、人工打磨确认、配图、排版、发布和复盘。

## 首次提示

当用户刚安装这个 Skill 时，直接给出下面的中文说明，不要先问“要不要了解功能”：

>  微信公众号文章工作流已安装。
>
> 你可以直接告诉我主题，我会帮你写成公众号文章，并在配置完成后发布到微信草稿箱。
>
> 可以试试：“帮我写一篇关于 AI 编程趋势的公众号文章”。
>
> 它能做这些事：
> - 从热点、关键词和知识库里规划选题
> - 写出更像真人的公众号文章
> - 用公众号友好的主题排版
> - 生成封面图和文中配图
> - 发布到微信公众号草稿箱
>
> 首次配置需要：
> 1. 安装依赖：`cd toolkit && npm install && npm run build && cd .. && pip install -r requirements.txt`
> 2. 复制配置：`cp config.example.yaml config.yaml`
> 3. 在 `config.yaml` 填入微信公众号 `appid`、`secret`，并配置 API IP 白名单
> 4. 推荐填入 YouMind API Key，用于知识库、联网搜索、归档和部分生图能力

更多初始化和运营说明见 `references/operations.md`。

## 使用方式

用户可以提供三类输入：

- 指定主题：`帮我写一篇关于 AI Agent 工作流的公众号文章`
- 指定客户/账号：`给 demo 客户写一篇推文，主题是远程办公最佳实践`
- 提供 Markdown：`把这篇 Markdown 排版成公众号样式并发布到草稿箱`

默认是自动模式。如果用户说“交互模式”“让我选题”“让我选框架”，就在选题、框架、配图和主题环节暂停，让用户选择。自动模式和交互模式都默认在 Step 5.5 暂停，让用户人工打磨 Markdown；用户明确说“全自动”“跳过人工打磨”或“直接发布”时才跳过。

## 安装与配置

环境要求：

- Node.js 18 或更高
- Python 3.9 或更高
- 已认证且有 API 权限的微信公众号

安装依赖：

```bash
cd toolkit && npm install && npm run build && cd ..
pip install -r requirements.txt
cp config.example.yaml config.yaml
```

`config.yaml` 中至少填写：

```yaml
wechat:
  appid: "wx_your_appid"
  secret: "your_secret"
  author: "你的作者名"
```

推荐填写：

```yaml
youmind:
  api_key: "sk-ym-xxxxxxxxxxxxxxxxxxxx"
```

微信公众号发布还必须配置 API IP 白名单。Windows PowerShell 获取公网 IP：

```powershell
(Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()
```

拿到 IP 后，在微信公众平台的公众号开发配置里，把它加入 API IP 白名单。

## 文件目录说明

<!-- validate anchor: ## Skill Directory -->

这个 Skill 是一个文件夹。需要什么读什么，不要一次性读完整个目录。

| 路径 | 作用 | 什么时候读 |
|------|------|------------|
| `references/pipeline.md` | 完整执行流程，Step 1 到 Step 8 | 跑完整写作流水线时 |
| `references/operations.md` | 改稿、换封面、换主题、复盘、建客户、首次配置 | 处理运营动作时 |
| `references/writing-guide.md` | 写作、深度、去 AI 味、声音风格 | 写正文前 |
| `references/frameworks.md` | 文章结构模板 | 选择文章框架时 |
| `references/topic-selection.md` | 选题评分模型 | 生成或筛选选题时 |
| `references/seo-rules.md` | 标题、摘要、关键词、标签 | SEO 和去 AI 味时 |
| `references/visual-prompts.md` | 封面和文中配图设计 | 生成图片前 |
| `references/theme-dsl.md` | 自定义公众号主题设计语言 | 做自定义主题时 |
| `references/youmind-integration.md` | YouMind 搜索、资料读取和归档 | 使用知识库能力时 |
| `references/cli-reference.md` | 命令行工具说明 | 运行工具命令时 |
| `references/wechat-constraints.md` | 微信 HTML/CSS 限制 | 调试排版和发布时 |
| `references/style-template.md` | 客户/账号配置模板 | 新建客户时 |
| `references/openapi-document.md` | YouMind OpenAPI 中文速查 | 直接调用 YouMind API 时 |
| `references/skill-maintenance.md` | Skill 维护规范 | 改这个 Skill 本身时 |
| `references/builtin-themes.json` | 内置主题 CSS 示例 | 参考或定制主题时 |
| `clients/{client}/style.yaml` | 账号定位、语气、选题、黑名单、主题 | Step 1 |
| `clients/{client}/config.yaml` | 指定账号的微信、YouMind、生图配置；发布该客户时优先使用 | Step 1、Step 7 |
| `clients/{client}/playbook.md` | 专属写作手册 | Step 4 |
| `clients/{client}/history.yaml` | 历史文章记录 | Step 2.5 去重 |
| `config.yaml` | 全局微信、YouMind、生图配置；仅在客户目录没有 config 时兜底 | 首次检查和发布时 |
| `output/{YYYY-MM-DD}/` | 当天完稿、预览、图片、视觉方案和分析报告 | 生成任何交付物时 |
| `toolkit/dist/*.js` | 编译后的可执行脚本 | 运行工具时 |
| `scripts/*.py` | 热点和 SEO 辅助脚本 | Step 2、Step 2.5 |

客户配置优先级：

- 通用规则：发布任何指定客户 `{client}` 时，优先使用 `clients/{client}/config.yaml`；该文件不存在时才退回仓库根目录 `config.yaml`。

## 执行模式

自动模式：默认模式。自动完成选题、框架、写作和 SEO 后，在 Step 5.5 输出 Markdown 草稿并暂停，等待用户人工打磨。用户回复“继续排版”后继续配图、排版和发布。用户明确说“全自动”“跳过人工打磨”或“直接发布”时才跳过 Step 5.5。生成图片前必须询问一次图片范围和风格，除非用户已经说明。

交互模式：用户说“交互模式”“让我选题”“让我选框架”“让我选主题”时启用。在关键选择点暂停，其余步骤继续自动执行；Step 5.5 人工打磨仍默认启用。

## 质量规则

<!-- validate anchor: ## Critical Quality Rules -->

这些规则不能跳过：

1. 写正文前先读 `references/writing-guide.md`。
2. 必须执行去 AI 味检查，避免模板化、过度工整、空泛总结。
3. H1 标题控制在 20 到 28 个汉字，转换器会把 H1 当作微信标题。
4. 摘要不超过 54 个汉字，微信摘要有字节限制。
5. 正文建议 1500 到 2500 字，1500 到 2000 字通常更利于完读。
6. 每个观点都要落到具体细节、案例或判断上。
7. 深度优先于漂亮排版。文章没有独特洞察时先重写，不要只润色。
8. 必须遵守 `style.yaml` 里的黑名单词和禁写主题。
9. 如果存在 `playbook.md`，客户专属 playbook 优先于通用写作指南。
10. 生成视觉前必须询问图片范围和风格。
11. 默认发布到公众号草稿箱。发布失败时生成本地 HTML 预览。
12. 所有生成到 `output/` 的完稿内容必须先进入当天日期目录，如 `output/2026-05-14/`；图片放在该日期目录下的 `images/`。
13. Step 5.5 之后，人工打磨后的 Markdown 是最终正文。AI 不再改正文观点、段落、语气和表达，只能做图片引用、路径修正、预览和发布所需处理。
14. 指定客户发布时必须优先读取 `clients/{client}/config.yaml`。不要因为仓库根目录没有 `config.yaml` 就判定无法发布。

## 流水线总览

<!-- validate anchor: ## Pipeline Overview -->

详细说明见 `references/pipeline.md`。

| Step | 动作 | 关键参考 |
|------|------|----------|
| 1 | 读取客户配置并判断路由 | `style.yaml` |
| 1.5 | 从 YouMind 知识库挖掘资料 | `youmind-integration.md` |
| 2 | 抓取热点 | `fetch_hotspots.py` |
| 2.5 | 历史去重和 SEO 关键词评分 | `history.yaml`、`seo_keywords.py` |
| 3 | 生成 10 个选题并评分 | `topic-selection.md` |
| 3.5 | 选择文章框架 | `frameworks.md` |
| 4 | 写正文并做深度检查 | `writing-guide.md` |
| 5 | SEO 优化和去 AI 味 | `seo-rules.md` |
| 5.5 | 人工打磨确认稿 | `pipeline.md` |
| 6 | 设计并生成封面/配图 | `visual-prompts.md` |
| 7 | 排版并发布到微信草稿箱 | `cli-reference.md` |
| 7.5 | 记录历史并归档到 YouMind | `youmind-integration.md` |
| 8 | 汇报标题、摘要、标签、主题、media_id | - |

路由捷径：

- 用户给了明确主题：跳过热点选题，直接做资料检索和框架选择。
- 用户给了已经打磨好的 Markdown 且只要排版/发布：跳过写作和 Step 5.5，直接排版、预览或发布。

## 失败时的处理

单个步骤失败不能让整条流程停掉。每一步都要有降级：

| 步骤 | 降级方案 |
|------|----------|
| 知识库检索失败 | 跳过，`knowledge_context` 置空 |
| 热点抓取失败 | 用 YouMind 网页搜索；再失败就请用户给主题 |
| SEO 评分失败 | 自行估算，并标记为 estimated |
| 选题生成失败 | 请用户手动给主题 |
| 图片生成失败 | 输出 prompt，文章继续走文本流程 |
| 发布失败 | 生成本地 HTML 预览 |
| 历史/归档失败 | 告知用户，但不阻塞主流程 |
| Python/Node 缺失 | 给出安装命令 |

## 运营动作

用户发布后可能继续要求：

- 润色、缩短、扩写、换语气
- 换封面、换配图风格
- 换主题或预览主题
- 看最近文章数据
- 创建新客户配置
- 根据人工修改学习风格
- 搜索知识库素材

这些都按 `references/operations.md` 执行。

## 常见坑

<!-- validate anchor: ## Gotchas -->

AI 腔：文章像一篇正确但无聊的说明文。要重做声音、节奏和具体细节。

浅选题：只追热点，没有独特判断。找不到一句话核心洞察时，换角度或换题。

堆字数：为了凑 2000 字变啰嗦。每段都要能回答“删掉会损失什么”。

只重排版不重内容：漂亮封面救不了空文章。先把观点写扎实。

忘记黑名单：发布前必须扫描客户配置里的禁用词和禁写主题。

一错就停：工具失败时要降级，不要让整条流程卡死。

## 参考

- YouMind API：`references/openapi-document.md`
- 命令行工具：`references/cli-reference.md`
- 微信限制：`references/wechat-constraints.md`
- 写作指南：`references/writing-guide.md`
