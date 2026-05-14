# Skill 维护说明

只有在修改、重构或审查这个 Skill 本身时才读本文。

## 核心定位

这个 Skill 的主职责是：微信公众号文章生产工作流。不要把它扩成无边界的内容平台。

用户执行说明放在 `SKILL.md`。维护者说明放在本文或脚本里。某个功能长成独立产品面时，应该拆新 Skill，而不是继续塞进主 Skill。

未来可能拆分的方向：

- 客户初始化和 playbook 生成
- 数据复盘和改稿学习
- 高级主题设计

## description 规则

frontmatter 的 `description` 用于触发 Skill，不是项目介绍。

应该包含用户真实说法：

- 公众号
- 微信推文
- 草稿箱
- 微信排版
- 复盘文章表现

应该包含动作：

- 写
- 改写
- 排版
- 预览
- 发布
- 复盘

不要把普通博客、邮件、PPT、短视频脚本等相邻但错误的场景写成强触发。

## 常见坑维护规则

`Gotchas` 只写高价值失败模式。格式应是：症状、为什么错、怎么修。

高价值类型：

- AI 腔
- 选题浅
- 单步失败导致整条流程停掉
- 忘记检查黑名单
- 文档和真实命令漂移

## 校验流程

修改这些内容后建议执行：

```bash
python3 scripts/validate_skill.py
cd toolkit && npm run build
```

文档漂移是产品问题，不是小瑕疵。能用脚本检查的，不要只靠文字提醒。

视觉生成行为必须保持：

- Step 6 前主动询问图片范围和风格。
- 如果宿主支持结构化提问，优先用结构化提问。

## 数据和持久化

当前可变数据在 Skill 目录内：

- `clients/*/history.yaml`
- `clients/*/lessons/`
- `output/`
- `config.yaml`

如果未来作为共享插件分发，应把可变数据迁移到稳定的数据目录。

## 什么时候拆 Skill

当某块能力独立有用，或让正常写文章时加载过多无关上下文，就应该拆分。

可能拆分：

- `youmind-wechat-ops`
- `youmind-wechat-theme-design`
- `youmind-wechat-publish`
