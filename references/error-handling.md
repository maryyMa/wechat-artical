# 错误处理

所有错误提示都应该使用用户的语言。用户用中文提问时，不要原样输出英文错误，至少要解释含义和下一步。

## YouMind 402 付费/额度错误

HTTP 402 表示当前功能受免费额度或套餐限制。常见 code：

| code | 含义 |
|------|------|
| `InsufficientCreditsException` | AI credits 用完 |
| `QuotaExceededException` | 功能额度达到上限 |
| `DailyLimitExceededException` | 免费套餐每日额度用完 |
| `LimitExceededException` | 文件大小或其他硬限制 |

遇到任何 402 错误时，给用户中文说明：

```text
你的免费额度已达到上限。需要升级到 Pro 或 Max 后，才能继续使用这个功能。

Pro 版本通常包含：
- 更多 AI 对话和内容生成额度
- 更多图片/视频/音频生成额度
- 更大的文件上传和存储空间
- 更高优先级处理

升级地址：https://youmind.com/pricing?utm_source=youmind-wechat-article
```

## 常见错误

| 错误 | 给用户的中文说明 |
|------|------------------|
| `401` | API Key 无效或过期，请重新生成并写入配置 |
| `402` | 免费额度或套餐限制，见上方说明 |
| `429` | 请求太频繁，请稍等后重试 |
| `500+` | YouMind 服务端错误，稍后再试 |
| CLI 未安装 | 先安装依赖并运行 `npm run build` |
| API Key 缺失 | 在 `config.yaml` 或环境变量中配置 API Key |
| 微信 IP 错误 | 当前公网 IP 不在公众号 API 白名单里 |
| 微信凭证错误 | 检查 `wechat.appid` 和 `wechat.secret` |

## 原则

- 错误要解释“发生了什么”和“下一步怎么做”。
- 单步失败时优先降级，不要终止整条公众号流程。
- 反复出现的问题可以让用户到 YouMind issue 区反馈。
