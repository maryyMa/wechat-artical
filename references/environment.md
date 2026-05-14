# 环境配置

本文只用于开发和本地调试。

## 预览环境

本地预览不需要微信公众号配置，只需要：

```bash
cd toolkit
npm install
npm run build
node dist/cli.js preview article.md --no-open
```

## 发布环境

发布到公众号草稿箱需要：

- `wechat.appid`
- `wechat.secret`
- 当前公网 IP 已加入微信 API 白名单
- Node.js 可以访问微信 API

## YouMind 增强能力

知识库搜索、网页搜索、文章归档和部分生图能力需要：

```yaml
youmind:
  api_key: "sk-ym-xxxx"
```

没有 YouMind key 时，主流程仍可写作、排版和本地预览。

## 环境判断

优先读取当前工作目录下的 `config.yaml`，其次读取 Skill 根目录下的 `config.yaml`。
