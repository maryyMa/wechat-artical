# YouMind 接入指南

YouMind 在这个 Skill 里负责四类能力：

1. 搜索你的知识库资料。
2. 联网搜索新资料。
3. 读取材料或文档全文。
4. 把生成后的文章归档回知识库。

## 什么时候用 YouMind

应该使用：

- 用户说“根据我的资料/笔记/知识库写”。
- 客户配置里有 `youmind.source_boards`。
- 需要查新资料或热点背景。
- 发布后需要自动归档。

可以跳过：

- 用户只要求格式化一篇现成 Markdown。
- `config.yaml` 没有 `youmind.api_key`。
- API 报错且主流程可以继续。

## 配置

`config.yaml`：

```yaml
youmind:
  api_key: "sk-ym-xxxxxxxx"
  base_url: "https://youmind.com/openapi/v1"
```

客户配置 `style.yaml`：

```yaml
youmind:
  source_boards: []
  save_board: ""
```

`source_boards` 控制写作时搜索哪些 board。`save_board` 控制发布后归档到哪里。

## 流水线接入点

### Step 1.5：知识挖掘

```bash
node dist/youmind-api.js mine-topics "AI,效率工具,公众号" --top-k 10
```

结果作为 `knowledge_context`，参与选题评分和写作资料。

### Step 4：深度阅读

当某条资料和文章高度相关时，读取全文：

```bash
node dist/youmind-api.js get-material "{id}"
node dist/youmind-api.js get-craft "{id}"
```

写作时只吸收事实、数据、案例和观点，不要复制原文。

### Step 7.5：文章归档

```bash
node dist/youmind-api.js save-article "{board_id}" --title "{title}" --file "{markdown_path}"
```

归档失败不阻塞发布。

## 常用命令

```bash
node dist/youmind-api.js search "{query}"
node dist/youmind-api.js web-search "{query}" --freshness day
node dist/youmind-api.js list-boards
node dist/youmind-api.js get-board "{board_id}"
node dist/youmind-api.js list-materials "{board_id}"
node dist/youmind-api.js list-crafts "{board_id}"
```

## 写作使用原则

- 用资料支持判断，不要把资料堆成摘要。
- 有来源的事实要自然交代来源。
- 多条资料冲突时，说明不确定性。
- 知识库内容优先于临时网页搜索。
- 客户 playbook 优先于通用写作风格。

## 失败处理

- API Key 缺失：跳过 YouMind 增强能力。
- 搜索失败：用网页搜索或让用户给资料。
- 读取全文失败：只用摘要，不阻塞写作。
- 归档失败：告知用户，不影响草稿箱发布。
