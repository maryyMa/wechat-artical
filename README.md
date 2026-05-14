#微信公众号 Skill

这是一个面向微信公众号的 AI 工作流。你给主题、简报、资料或 Markdown，它负责把内容推进到公众号草稿箱：选题、资料检索、写作、SEO、人工打磨确认、配图、排版、发布和复盘。

## 一句话能做什么

| 你说 | Skill 做什么 |
|------|--------------|
| `给 demo 写一篇公众号文章` | 跑完整流程：热点、选题、写作、SEO，暂停给你人工打磨后继续配图、排版、发布草稿 |
| `写一篇关于高考志愿的文章` | 跳过热点，围绕指定主题写作 |
| `把这篇 Markdown 发到草稿箱` | 跳过写作，直接排版并发布 |
| `全自动写完直接发布` | 跳过人工打磨暂停，直接配图、排版和发布 |
| `用紫色 decoration 主题预览` | 用指定主题和颜色生成 HTML 预览 |
| `看看最近 7 天文章表现` | 拉取数据，分析表现，并给下一篇建议 |
| `根据我的修改学习风格` | 对比初稿和终稿，把人工修改沉淀为写作经验 |
| `创建新客户 my-brand` | 建立客户目录并引导填写账号风格配置 |

## 安装

环境要求：

- Node.js 18 或更高
- Python 3.9 或更高
- 已认证微信公众号，并开通 API 能力

```bash
cd toolkit && npm install && npm run build && cd ..
pip install -r requirements.txt
cp config.example.yaml config.yaml
```

`config.yaml` 至少需要：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| `wechat.appid` | 是 | 微信公众号 AppID |
| `wechat.secret` | 是 | 微信公众号 AppSecret |
| `wechat.author` | 否 | 文章作者名，默认 YouMind |
| `youmind.api_key` | 推荐 | 用于知识库搜索、联网搜索、文章归档、AI 生图 |
| `image.providers.*.api_key` | 否 | 配置后启用对应生图 provider |

## 获取 AppID、AppSecret 和配置 IP 白名单

微信开发者平台：<https://developers.weixin.qq.com/platform?tab1=basicInfo&tab2=dev>

1. 打开微信开发者平台，点击“前往使用”并登录。
2. 在“我的业务”里进入“公众号”。
3. 在公众号“基础信息”页面复制 AppID。
4. 在“开发密钥”区域重置并保存 AppSecret。
5. 在同一区域编辑 API IP 白名单，填入当前公网 IP。

Windows PowerShell 获取公网 IP：

```powershell
(Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()
```

家庭宽带 IP 可能变化。发布时报 IP 相关错误时，重新获取 IP 并更新白名单即可。

## 运行模式

自动模式：默认模式。AI 写完正文、SEO 和去 AI 味后，会输出 Markdown 并暂停给你人工打磨；你回复 `继续排版` 后，再生成图片、排版和发布。明确说“全自动”“跳过人工打磨”或“直接发布”时，才跳过这个暂停。

交互模式：说“交互模式”“让我选题”“让我选框架”“让我选主题”。Skill 会在关键选择点暂停，且仍默认保留人工打磨确认稿。

## 主题系统

4 款内置主题，支持任意 HEX 颜色：

| 主题 | 风格 | 适合 |
|------|------|------|
| `simple` | 简约干净 | 日常推送、知识科普 |
| `center` | 居中排版 | 短篇、金句、情感内容 |
| `decoration` | 装饰线条 | 品牌感强的内容 |
| `prominent` | 大标题 | 深度长文、观点输出 |

需要更深定制时，按 `references/theme-dsl.md` 写自定义主题 JSON，放到 `clients/{client}/themes/`，发布时加 `--custom-theme`。

## 配图降级链

图片生成按这个顺序尝试：

```text
AI 生图 provider -> Nano Banana Pro 图库搜索 -> CDN 预制封面 -> 只输出 prompt
```

即使图片生成失败，也不会中断文章排版和发布流程。

## 多客户目录

每个客户/账号一个目录：

```text
clients/demo/
├── style.yaml      # 账号定位、目标读者、语气、主题、黑名单
├── playbook.md     # 写作手册，可由历史语料生成
├── history.yaml    # 已发布文章记录和数据
├── corpus/         # 历史文章语料
├── lessons/        # 从人工改稿中学到的经验
└── themes/         # 专属主题 JSON
```

## 常用命令

所有命令在 `toolkit/` 下运行。

```bash
node dist/cli.js preview article.md --theme simple --color "#3498db"
node dist/cli.js publish article.md --theme decoration --color "#9b59b6" --cover cover.jpg
node dist/cli.js theme-preview article.md --color "#e74c3c"
node dist/cli.js themes
node dist/cli.js colors
```

更多命令见 `references/cli-reference.md`。

## 常见问题

发布报 IP 错误：公网 IP 变了。重新获取 IP，并更新公众号 API IP 白名单。

图片生成失败：不影响发布。Skill 会走降级链，最差输出 prompt 供人工生成。

文章有 AI 味：完善 `style.yaml`，加入历史文章到 `corpus/`，再用 `build-playbook` 生成写作手册。

想定制排版：先换主题和颜色；不够再写自定义主题 JSON；复杂设计参考 `theme-dsl.md`。

## 重要参考

- 完整流水线：`references/pipeline.md`
- 写作指南：`references/writing-guide.md`
- 命令说明：`references/cli-reference.md`
- 微信限制：`references/wechat-constraints.md`
- YouMind 接入：`references/youmind-integration.md`
- OpenAI Agent 配置：`agents/openai.yaml`
- 结构校验脚本：`scripts/validate_skill.py`
- 生图工具源码：`image-gen.ts`
- YouMind API 工具源码：`youmind-api.ts`
- 数据拉取工具源码：`fetch-stats.ts`
- 写作手册生成源码：`build-playbook.ts`
- 改稿学习源码：`learn-edits.ts`

维护时可运行：

```bash
npm run validate-skill
```
