# 视觉 AI 指南

本文用于封面图和文中配图。视觉的任务不是装饰，而是帮助读者在信息流里停一下，并让文章气质更统一。

## 生成前必须问用户

除非用户已经说明，否则必须问：

1. 图片范围：封面+文中图、仅封面、仅文中图、不要图片。
2. 风格方向：跟随文章调性、插画、电影感、极简、科技、温暖编辑风等。

默认推荐：封面+文中图，风格跟随文章调性。

## 封面设计

输出 3 个创意方向：

- A：概念型，用隐喻表达文章核心洞察。
- B：场景型，让读者一眼进入文章情境。
- C：抽象编辑型，适合观点和深度文章。

每个方向包含：

- 中文概念说明
- 英文生图 prompt
- 色彩方案
- 适合原因

封面 prompt 必须包含：

```text
no text, no letters, no words
```

微信封面建议比例：900×383，约 2.35:1。

## 文中配图

适合配图的段落：

- 数据或证据段
- 场景描写段
- 观点转折段
- 方法结构段

不适合配图的段落：

- 开头第一钩子
- 纯观点段
- 结尾 CTA
- 已经很短的过渡段

文中图建议 3 到 5 张，图片之间至少间隔约 500 字。

## Prompt 写法

英文 prompt 结构：

```text
subject + scene + mood + composition + lighting + color palette + style, no text, no letters, no words
```

示例：

```text
a small team mapping an AI workflow on a glass wall, warm editorial photography, natural light, clear composition, blue and amber palette, no text, no letters, no words
```

## 风格一致性

同一篇文章的封面和文中图应该共享：

- 颜色倾向
- 光线气质
- 构图密度
- 抽象或写实程度

不要一张科技霓虹、一张水彩、一张写实摄影混在一起。

## 失败降级

图片生成失败时：

1. 搜索 Nano Banana Pro 图库。
2. 下载 CDN 预制封面。
3. 输出 prompt，文章继续发布。

图片失败不能阻塞写作和排版。
