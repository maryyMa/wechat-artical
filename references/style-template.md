# 客户配置模板

新建客户时，创建 `clients/{client}/style.yaml` 并按下面字段填写。这个文件会影响选题、语气、写作结构、排版主题和黑名单。

## 模板

```yaml
name: "客户或账号名"
industry: "行业/垂直领域"
target_audience: "具体读者画像：年龄、职业、兴趣、处境"

topics:
  - 核心方向 1
  - 核心方向 2
  - 核心方向 3

tone: "语气说明，例如：专业但不学术，有观点但不偏激，偶尔自嘲"
voice: "写作者人设，例如：第一人称，像一个懂行的朋友在分享判断"
word_count: "1500-2500"
content_style: "干货 / 故事 / 观点 / 混合"

blacklist:
  words: ["禁用词1", "禁用词2"]
  topics: ["禁写主题1", "禁写主题2"]

reference_accounts: ["参考账号1", "参考账号2"]

theme: "simple"
theme_color: "#3498db"

font: ""
font_size: ""
heading_font: ""
heading_size: ""
paragraph_spacing: ""
line_height: ""
letter_spacing: ""
text_indent: ""

youmind:
  source_boards: []
  save_board: ""

cover_style: "封面图风格说明"
author: "文章作者名"
```

## 字段说明

`tone` 控制语气。不要只写“专业”“有趣”，要写成具体行为。

好例子：

```text
专业但不学术，像资深从业者跟新人聊天，不像教授讲课。
```

`voice` 控制是谁在说话。越具体越稳定。

好例子：

```text
第一人称，36 岁，在互联网行业做了 10 年产品，讨厌空泛方法论。
```

`content_style` 会影响框架选择：

| 值 | 倾向 |
|----|------|
| 干货 | 痛点型、清单型，强调可执行 |
| 故事 | 故事型，强调场景和情绪 |
| 观点 | 对比型、热评型，强调判断 |
| 混合 | 按选题特征自动选择 |

`reference_accounts` 用于风格校准。填 2 到 3 个你希望靠近的公众号即可。

`youmind.source_boards` 是写作资料来源。`youmind.save_board` 是发布后归档位置。

`blacklist.words` 和 `blacklist.topics` 是硬限制，最终文章必须遵守。

## 目录结构

```text
clients/{client}/
├── style.yaml      # 必需：客户配置
├── history.yaml    # 自动生成：发布历史和数据
├── playbook.md     # 可选：从历史语料生成的写作手册
├── corpus/         # 可选：历史文章
├── lessons/        # 自动生成：从人工改稿学到的经验
└── themes/         # 自定义主题 JSON
```

## playbook 优先级

如果客户目录里存在 `playbook.md`，它优先于通用 `writing-guide.md`。通用指南是质量底线，playbook 是这个账号的个性化规则。

## history 反馈循环

`history.yaml` 可以记录阅读、点赞、分享、收藏、完读率等数据。后续选题和框架选择会参考历史表现。
