#!/usr/bin/env tsx
/**
 * YouMind 微信公众号 Skill 的命令行入口。
 *
 * 用法：
 *   npx tsx src/cli.ts preview article.md --theme simple --color "#3498db"
 *   npx tsx src/cli.ts publish article.md --theme decoration --color "#9b59b6"
 *   npx tsx src/cli.ts themes
 *   npx tsx src/cli.ts colors
 *   npx tsx src/cli.ts theme-preview article.md --color "#e74c3c"
 */

import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { WeChatConverter, previewHtml } from './converter.js';
import {
  DEFAULT_COLOR,
  DEFAULT_THEME,
  type FontFamily,
  type HeadingSize,
  type ParagraphSpacing,
  type Theme,
  type ThemeKey,
  type ThemeStyles,
  listPresetColors,
  listThemes,
} from './theme-engine.js';
import { getAccessToken, uploadImage, uploadThumb } from './wechat-api.js';
import { createDraft } from './publisher.js';

// --- 配置读取 ---

import { existsSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { dirname, join } from 'node:path';

const CONFIG_PATHS = [
  join(process.cwd(), 'config.yaml'),
  join(dirname(import.meta.url.replace('file://', '')), '..', '..', 'config.yaml'),
  join(dirname(import.meta.url.replace('file://', '')), '..', 'config.yaml'),
];

function loadConfig(): Record<string, unknown> {
  for (const p of CONFIG_PATHS) {
    if (existsSync(p)) {
      return parseYaml(readFileSync(p, 'utf-8')) || {};
    }
  }
  return {};
}

function loadCustomTheme(jsonPath: string): Theme {
  const raw = JSON.parse(readFileSync(resolve(jsonPath), 'utf-8'));
  const styles: ThemeStyles = raw.styles ?? raw;
  return {
    name: raw.meta?.name ?? '自定义主题',
    key: 'custom' as ThemeKey,
    description: raw.meta?.description ?? '自定义主题',
    color: raw.tokens?.color ?? DEFAULT_COLOR,
    styles,
  };
}

// --- 命令 ---

const program = new Command();

program
  .name('youmind-wechat')
  .description('YouMind 微信公众号：将 Markdown 转为公众号 HTML，并支持动态主题')
  .version('1.0.0');

program
  .command('preview')
  .description('生成 HTML 预览，并可在浏览器打开')
  .argument('<input>', 'Markdown 文件路径')
  .option('-t, --theme <key>', '主题：simple、center、decoration、prominent', DEFAULT_THEME)
  .option('-c, --color <hex>', '主题色（HEX）', DEFAULT_COLOR)
  .option('-o, --output <path>', '输出 HTML 文件路径')
  .option('--no-open', '不要打开浏览器')
  .option('--font <key>', '字体：default、optima、serif', 'default')
  .option('--font-size <n>', '正文字号（14-18）', '16')
  .option('--heading-size <key>', '标题字号：minus2、minus1、standard、plus1', 'standard')
  .option('--paragraph-spacing <key>', '段落间距：compact、normal、loose', 'normal')
  .option('--custom-theme <path>', '自定义主题 JSON 文件路径')
  .action(async (input: string, opts) => {
    const converter = new WeChatConverter({
      themeKey: opts.theme as ThemeKey,
      color: opts.color,
      fontFamily: opts.font as FontFamily,
      fontSize: parseInt(opts.fontSize),
      headingSize: opts.headingSize as HeadingSize,
      paragraphSpacing: opts.paragraphSpacing as ParagraphSpacing,
      ...(opts.customTheme ? { customTheme: loadCustomTheme(opts.customTheme) } : {}),
    });

    const result = converter.convertFile(input);
    const fullHtml = previewHtml(result.html, converter.getTheme());

    const outputPath = opts.output || input.replace(/\.md$/, '.html');
    writeFileSync(outputPath, fullHtml, 'utf-8');

    console.log(`标题: ${result.title}`);
    console.log(`摘要: ${result.digest}`);
    console.log(`图片数量: ${result.images.length}`);
    console.log(`主题: ${opts.theme} | 颜色: ${opts.color}`);
    console.log(`输出: ${outputPath}`);

    if (opts.open !== false) {
      const { default: open } = await import('open');
      await open(`file://${resolve(outputPath)}`);
      console.log('已在浏览器打开。');
    }
  });

program
  .command('publish')
  .description('转换并发布到微信公众号草稿箱')
  .argument('<input>', 'Markdown 文件路径')
  .option('-t, --theme <key>', '主题 key')
  .option('-c, --color <hex>', '主题色（HEX）')
  .option('--appid <id>', '微信公众号 AppID')
  .option('--secret <key>', '微信公众号 AppSecret')
  .option('--cover <path>', '封面图片路径')
  .option('--title <text>', '覆盖文章标题')
  .option('--author <name>', '文章作者')
  .option('--font <key>', '字体：default、optima、serif', 'default')
  .option('--font-size <n>', '正文字号（14-18）', '16')
  .option('--heading-size <key>', '标题字号', 'standard')
  .option('--paragraph-spacing <key>', '段落间距', 'normal')
  .option('--custom-theme <path>', '自定义主题 JSON 文件路径')
  .action(async (input: string, opts) => {
    const cfg = loadConfig();
    const wechatCfg = (cfg.wechat as Record<string, string>) || {};

    const appid = opts.appid || wechatCfg.appid;
    const secret = opts.secret || wechatCfg.secret;
    const themeKey = (opts.theme || (cfg.theme as string) || DEFAULT_THEME) as ThemeKey;
    const color = opts.color || (cfg.theme_color as string) || DEFAULT_COLOR;
    const author = opts.author || wechatCfg.author;

    if (!appid || !secret) {
      console.error('错误：需要提供 --appid 和 --secret，或在 config.yaml 中配置');
      process.exit(1);
    }

    const converter = new WeChatConverter({
      themeKey,
      color,
      fontFamily: opts.font as FontFamily,
      fontSize: parseInt(opts.fontSize),
      headingSize: opts.headingSize as HeadingSize,
      paragraphSpacing: opts.paragraphSpacing as ParagraphSpacing,
      ...(opts.customTheme ? { customTheme: loadCustomTheme(opts.customTheme) } : {}),
    });

    const result = converter.convertFile(input);

    console.log(`标题: ${result.title}`);
    console.log(`摘要: ${result.digest}`);
    console.log(`发现图片: ${result.images.length}`);
    console.log(`主题: ${themeKey} | 颜色: ${color}`);

    const token = await getAccessToken(appid, secret);
    console.log('已获取 access token。');

    let html = result.html;
    const mdDir = dirname(resolve(input));

    for (const imgSrc of result.images) {
      if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) {
        console.log(`跳过远程图片: ${imgSrc}`);
        continue;
      }

      let imgPath = resolve(imgSrc);
      if (!existsSync(imgPath)) {
        imgPath = join(mdDir, imgSrc);
      }

      if (existsSync(imgPath)) {
        console.log(`正在上传图片: ${imgSrc}`);
        const wechatUrl = await uploadImage(token, imgPath);
        html = html.replace(imgSrc, wechatUrl);
        console.log(`  -> ${wechatUrl}`);
      } else {
        console.log(`警告：图片不存在: ${imgSrc}`);
      }
    }

    let thumbMediaId: string | undefined;
    if (opts.cover) {
      console.log(`正在上传封面: ${opts.cover}`);
      thumbMediaId = await uploadThumb(token, opts.cover);
      console.log(`  -> media_id: ${thumbMediaId}`);
    }

    const title = opts.title || result.title || input.replace(/\.md$/, '');
    const draft = await createDraft({
      accessToken: token,
      title,
      html,
      digest: result.digest,
      thumbMediaId,
      author,
    });

    console.log(`\n草稿已创建！media_id: ${draft.mediaId}`);
  });

program
  .command('themes')
  .description('列出可用主题')
  .action(() => {
    console.log('可用主题:\n');
    for (const t of listThemes()) {
      console.log(`  ${t.key.padEnd(16)} ${t.name}  (${t.description})`);
    }
  });

program
  .command('colors')
  .description('列出预设颜色')
  .action(() => {
    console.log('预设颜色:\n');
    for (const [name, hex] of Object.entries(listPresetColors())) {
      console.log(`  ${name.padEnd(20)} ${hex}`);
    }
    console.log('\n也可以用 --color 指定任意 HEX 颜色。');
  });

program
  .command('theme-preview')
  .description('用指定颜色生成 4 个主题的预览')
  .argument('<input>', 'Markdown 文件路径')
  .option('-c, --color <hex>', '主题色（HEX）', DEFAULT_COLOR)
  .option('--no-open', '不要打开浏览器')
  .option('--font <key>', '字体', 'default')
  .option('--font-size <n>', '字号', '16')
  .action(async (input: string, opts) => {
    const themes = listThemes();

    for (const t of themes) {
      const converter = new WeChatConverter({
        themeKey: t.key,
        color: opts.color,
        fontFamily: opts.font as FontFamily,
        fontSize: parseInt(opts.fontSize),
      });

      const result = converter.convertFile(input);
      const fullHtml = previewHtml(result.html, converter.getTheme());

      const outputPath = input.replace(/\.md$/, `.${t.key}.html`);
      writeFileSync(outputPath, fullHtml, 'utf-8');
      console.log(`  ${t.key.padEnd(16)} -> ${outputPath}`);
    }

    if (opts.open !== false) {
      const firstOutput = input.replace(/\.md$/, `.${themes[0].key}.html`);
      const { default: open } = await import('open');
      await open(`file://${resolve(firstOutput)}`);
    }

    console.log(`\n已用颜色 ${opts.color} 生成 ${themes.length} 个主题预览。`);
  });

program.parse();

