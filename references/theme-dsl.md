# 微信公众号自定义主题设计语言

本文用于设计 `clients/{client}/themes/` 下的自定义主题 JSON。目标是让公众号排版有稳定气质，而不是堆装饰。

## 先完成设计判断

写 CSS 前先回答：

1. 这篇/这个账号的情绪是什么：冷静、锋利、温暖、文学、科技、商业、轻松？
2. 读者应该先看到什么：标题、金句、结构、图片、代码、数据？
3. 文章节奏是紧密还是舒展？
4. 装饰是为了分层，还是为了品牌记忆？
5. 主色表达什么情绪？
6. 移动端阅读是否舒适？

## 主题 JSON 结构

推荐结构：

```json
{
  "meta": {
    "id": "my-theme",
    "name": "我的主题",
    "description": "适合某类账号的说明"
  },
  "tokens": {
    "color": "#3498db",
    "fontFamily": "default",
    "fontSize": 16,
    "lineHeight": 1.75,
    "paragraphSpacing": 20
  },
  "styles": {
    "container": "...",
    "h1": "...",
    "h2": "...",
    "p": "...",
    "blockquote": "...",
    "img": "..."
  }
}
```

`styles` 里的 CSS 必须是微信安全的内联 CSS。不要使用 `<style>`、外链样式、复杂动画、CSS Grid 或脚本。

## 设计原则

层级：H1、H2、正文、引用、列表、图片必须明显区分。

节奏：段落间距要服务阅读，不要为了“高级感”拉太开。

颜色：正文不要用纯黑。主色用于标题、强调和装饰；辅助色用于说明、引用、边框。

装饰：装饰只服务结构。每个线条、色块、边框都要有作用。

移动端优先：微信文章主要在手机看，字号、行高、图片宽度都要按手机优化。

## 微信安全限制

可以用：

- 内联 `style`
- 常规颜色、边距、边框、背景色
- 系统字体栈
- 简单表格
- 图片

不要用：

- `<script>`
- `<style>`
- 外链 CSS
- animation、transition、transform
- CSS Grid
- iframe、video、audio
- 依赖浏览器运行的交互

## 内置主题

内置主题：

- `simple`：简约现代
- `center`：优雅居中
- `decoration`：精致装饰
- `prominent`：醒目标题

简单改风格时优先用内置主题加颜色。只有当内置主题不能表达账号气质时，再写自定义主题。

## 质量检查

自定义主题完成后检查：

- 文章只看正文是否仍然舒服。
- 标题和小标题是否够清楚。
- 长段落是否压迫。
- 引用和金句是否突出但不过度。
- 图片是否不会撑破版面。
- 深色或高饱和颜色是否只用于重点。

预览命令：

```bash
node dist/cli.js preview article.md --custom-theme clients/{client}/themes/my-theme.json --no-open
```
