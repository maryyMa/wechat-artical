# 安装与认证

## 安装依赖

在 Skill 目录运行：

```bash
cd toolkit && npm install && npm run build && cd ..
pip install -r requirements.txt
cp config.example.yaml config.yaml
```

## 配置微信公众号

编辑 `config.yaml`：

```yaml
wechat:
  appid: "你的公众号 AppID"
  secret: "你的公众号 AppSecret"
  author: "作者名"
```

发布到草稿箱前，必须把当前公网 IP 加入微信公众号 API IP 白名单。

Windows PowerShell：

```powershell
(Invoke-WebRequest -Uri "https://ifconfig.me" -UseBasicParsing).Content.Trim()
```

## 配置 YouMind

YouMind API Key 用于知识库搜索、联网搜索、文章归档和部分生图能力。

```yaml
youmind:
  api_key: "sk-ym-xxxxxxxx"
```

不要让用户把真实 key 直接贴到聊天里。应引导用户自己写入 `config.yaml` 或环境变量。

## 验证

```bash
cd toolkit
npm run build
node dist/cli.js themes
```

如果只想本地预览，不配置微信公众号也可以运行 `preview`。
