# 运营操作参考

本文处理文章发布前后的常见操作：改稿、换图、换主题、复盘、建客户和学习风格。

## 输出归档

所有完稿、预览、图片、视觉方案和数据分析报告都写入当天日期目录：

```text
output/{YYYY-MM-DD}/
```

不要把交付文件直接散放在 `output/` 根目录。当天文章图片放在 `output/{YYYY-MM-DD}/images/`，Markdown 内用 `images/{filename}` 引用。

## 发布后的常见命令

| 用户说 | 执行动作 |
|--------|----------|
| 润色、缩短、扩写、换语气 | 按 `writing-guide.md` 的编辑规则改文章 |
| 封面换成暖色 | 改封面 prompt 并重新生成 |
| 图片风格改成插画/电影感/极简 | 重新执行视觉步骤 |
| 删除第 N 张文中图 | 从 Markdown 移除对应图片 |
| 用框架 B 重写 | 回到 Step 4，保留选题，换框架写 |
| 继续排版 | 读取 Step 5.5 的同一个 Markdown 文件作为人工终稿，继续 Step 6/7 |
| 跳过人工打磨 | 本篇将 `polish_stage` 记为 `skipped`，直接进入 Step 6/7 |
| 换一个主题 | 回到 Step 3 或让用户给新主题 |
| 换主题/颜色预览 | 用 `cli.js preview` 或 `theme-preview` |
| 查看文章数据 | 用 `fetch-stats.js` 拉数据并分析 |
| 列出主题 | `cli.js themes` |
| 创建新客户 | 执行客户初始化流程 |
| 根据我的修改学习风格 | 执行 learn-from-edits 流程 |
| 搜索我的资料/知识库 | 用 `youmind-api.js search` |
| 根据我的笔记写 | 把指定材料作为 Step 4 的主资料 |

## 只做排版

用户提供 Markdown 且不需要重写时，直接用 `cli.js preview` 或 `cli.js publish`。需要主题对比时用 `cli.js theme-preview`。这种场景视为用户已经人工确认终稿，不再强制 Step 5.5。

## 人工打磨后继续排版

用户回复 `继续排版` 时：

1. 读取 Step 5.5 提示里的同一个 Markdown 文件。
2. 把该文件视为人工终稿。
3. 不再改正文观点、段落、语气和表达。
4. 只做图片引用、路径修正、HTML 预览、草稿箱发布和历史记录。
5. 若缺少 H1 标题、标题明显不符合公众号规则、图片路径断链，先提示用户确认。

## 数据复盘

用户要看表现时：

1. 用 `fetch-stats.js` 拉取公众号数据。
2. 回填 `history.yaml`。
3. 分析最佳文章：为什么好，标题、选题、框架、发布时间分别起了什么作用。
4. 分析较差文章：可能的问题在哪里。
5. 给下一篇的选题、标题和框架建议。

## 新建客户

用户说“创建新客户”“导入历史文章”“建立 playbook”时：

1. 建立 `clients/{client}/`。
2. 创建 `style.yaml`、`history.yaml`、`corpus/`、`lessons/`、`themes/`。
3. 引导用户填写账号定位、读者、语气、主题色、禁用词。
4. 如果 `corpus/` 有 20 篇以上历史文章，运行 `build-playbook.js`。

## 从人工改稿中学习

不要默认学习每次人工打磨。只有用户明确说“学习我的修改风格”“根据我的修改学习风格”等请求时，才执行本节。

运行：

```bash
node dist/learn-edits.js --client {client} --draft {draft_path} --final {final_path}
```

它会分类记录：

- 词语替换
- 段落新增/删除
- 结构调整
- 标题修改
- 语气变化

每积累 5 条经验，可以运行：

```bash
node dist/learn-edits.js --client {client} --summarize
```

再刷新 `playbook.md`。

## 自定义主题

按复杂度分三层：

1. 简单改颜色、字体、字号：直接用 CLI 参数。
2. 设计一种明确风格：阅读 `theme-dsl.md`，生成主题 JSON，放到 `clients/{client}/themes/`。
3. 深度定制：完整走主题设计流程，先定情绪、层级、节奏、装饰和颜色。

## 首次配置

如果 `config.yaml` 不存在：

1. 从 `config.example.yaml` 复制。
2. 若 `node_modules/` 不存在，运行 `cd toolkit && npm install && npm run build`。
3. 引导用户填写微信公众号 `appid` 和 `secret`。
4. 推荐配置 `youmind.api_key`。
5. 可选配置 Gemini、OpenAI、豆包等生图 key。
6. 获取公网 IP 并加入微信 API 白名单。

Windows PowerShell 获取公网 IP：

```powershell
(Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()
```
