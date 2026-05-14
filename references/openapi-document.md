# YouMind OpenAPI 中文速查

本文是给 Agent 使用的中文速查。接口路径、字段名、HTTP 方法必须保留英文，因为它们是 API 契约。

## 认证

请求头：

```http
Authorization: Bearer sk-ym-xxxx
Content-Type: application/json
```

Base URL：

```text
https://youmind.com/openapi/v1
```

## 通用约定

- 返回 JSON。
- 出错时通常包含 `message`、`code`、`status`。
- 401 表示 key 错误或过期。
- 402 表示额度或套餐限制。
- 429 表示请求过快。
- 500+ 表示服务端错误。

## Board

Board 是 YouMind 里的知识库/资料板。

常见操作：

```http
GET /boards
GET /boards/{board_id}
POST /boards
PATCH /boards/{board_id}
DELETE /boards/{board_id}
```

公众号流程中常用：

- 列出可用 board。
- 读取客户配置里的 `source_boards`。
- 发布后保存到 `save_board`。

## Material

Material 是知识库里的素材，例如网页、笔记、文件或片段。

常见操作：

```http
GET /materials
GET /materials/{material_id}
POST /materials
DELETE /materials/{material_id}
```

写作时用它读取事实、案例和引用来源。不要把 material 原文直接复制进文章。

## Craft / Document

Craft 或 Document 是 YouMind 里的文档型内容。

常见操作：

```http
GET /crafts
GET /crafts/{craft_id}
POST /crafts
PATCH /crafts/{craft_id}
```

公众号流程中用于：

- 读取用户已有文章或笔记。
- 将发布后的文章归档成文档。

## Search

语义搜索用于从知识库中找相关材料。

常见请求：

```http
POST /search
```

请求体通常包含：

```json
{
  "query": "搜索问题",
  "board_id": "可选 board",
  "top_k": 10
}
```

使用建议：

- 选题阶段搜索宽一点。
- 写作阶段搜索具体一点。
- 如果客户有指定 board，优先限制在该 board。

## Web Search

网页搜索用于获取新信息。

常见请求：

```http
POST /web-search
```

请求体示例：

```json
{
  "query": "搜索问题",
  "freshness": "day"
}
```

公众号流程中用于热点背景、最新资料和 SEO 关键词补充。

## Save Article

发布后可把 Markdown 文章保存回 YouMind。

工具命令：

```bash
node dist/youmind-api.js save-article "{board_id}" --title "{title}" --file "{markdown_path}"
```

归档失败不应阻塞微信草稿箱发布。

## 生图 Relay

当配置 YouMind API Key 时，图片生成可以走 YouMind Relay 调用 Nano Banana Pro。

注意：

- 封面 prompt 必须要求无文字。
- 图片失败时按降级链处理。
- 不要因为生图失败中断文章主流程。

## 在本 Skill 中的封装

优先使用工具封装，而不是手写 HTTP：

```bash
node dist/youmind-api.js search "{query}"
node dist/youmind-api.js web-search "{query}" --freshness day
node dist/youmind-api.js get-material "{id}"
node dist/youmind-api.js get-craft "{id}"
node dist/youmind-api.js mine-topics "{topics_csv}" --top-k 10
```

只有封装命令无法覆盖需求时，才直接参考 OpenAPI。
