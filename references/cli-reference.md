# 命令行参考

所有命令都在 `{skill_dir}/toolkit/` 目录下运行。`dist/` 里的脚本来自 `npm run build`。

## 核心命令

### 生成 HTML 预览

```bash
node dist/cli.js preview {markdown_path} \
  --theme {theme_key} --color "{hex}" \
  [--font {font}] [--font-size {size}] \
  [--heading-size {size}] [--paragraph-spacing {spacing}] \
  [--custom-theme {theme_json_path}] \
  [--no-open] [-o {output_html_path}]
```

作用：把 Markdown 转成公众号兼容 HTML，并生成本地预览文件。

### 发布到微信公众号草稿箱

```bash
node dist/cli.js publish {markdown_path} \
  --theme {theme_key} --color "{hex}" \
  [--cover {cover_image_path}] [--title "{title}"] \
  [--font {font}] [--font-size {size}] \
  [--heading-size {size}] [--paragraph-spacing {spacing}] \
  [--custom-theme {theme_json_path}]
```

客户配置优先级：

- 发布任何客户 `{client}`：优先读取 `clients/{client}/config.yaml`；不存在时才使用仓库根目录 `config.yaml`。

示例：

```powershell
cd clients\xdt
node ..\..\toolkit\dist\cli.js publish ..\..\output\YYYY-MM-DD\article.md --theme simple --color "#6a994e" --cover ..\..\output\YYYY-MM-DD\images\cover.jpg --title "标题"
```

参数优先级：

```text
--custom-theme > CLI 参数 > style.yaml > 默认值
```

### 生成主题对比预览

```bash
node dist/cli.js theme-preview {markdown_path} --color "{hex}"
```

会为 4 个内置主题分别生成 HTML，方便比较。

### 查看主题和颜色

```bash
node dist/cli.js themes
node dist/cli.js colors
```

## 图片生成

### AI 生图

```bash
node dist/image-gen.js --prompt "{prompt}" \
  --output {output_path} --size {cover|article} \
  [--color "{hex}"] [--mood "{mood}"] [--provider {youmind|gemini|openai|doubao}]
```

### 搜索 Nano Banana Pro 图库

```bash
node dist/image-gen.js --search "{keywords}" --output {output_path}
```

### 使用预制封面兜底

```bash
node dist/image-gen.js --fallback-cover --color "{hex}" --output {output_path}
```

降级链：

```text
API 生图 -> Nano Banana Pro 图库 -> CDN 预制封面 -> 只输出 prompt
```

## YouMind 知识库

```bash
node dist/youmind-api.js mine-topics "{topics_csv}" [--board "{board_id}"] [--top-k 10]
node dist/youmind-api.js search "{query}"
node dist/youmind-api.js web-search "{query}" [--freshness day]
node dist/youmind-api.js get-material "{id}"
node dist/youmind-api.js get-craft "{id}"
node dist/youmind-api.js save-article "{board_id}" --title "{title}" --file "{markdown_path}"
```

## Python 辅助脚本

```bash
python3 {skill_dir}/scripts/fetch_hotspots.py --limit 30
python3 {skill_dir}/scripts/seo_keywords.py --json "keyword1" "keyword2" "keyword3"
```

`fetch_hotspots.py` 抓热点。`seo_keywords.py` 用搜索建议估算关键词潜力。

## 数据复盘和风格学习

```bash
node dist/fetch-stats.js --client {client} --days 7
node dist/learn-edits.js --client {client} --draft {draft_path} --final {final_path}
node dist/learn-edits.js --client {client} --summarize
node dist/build-playbook.js --client {client}
```

## Skill 维护

```bash
python3 ../scripts/validate_skill.py
```

改完 `SKILL.md`、`README.md`、`references/` 或工具源码后，建议跑校验和 `npm run build`。
