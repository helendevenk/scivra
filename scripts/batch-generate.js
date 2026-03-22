#!/usr/bin/env node

/**
 * 批量生成实验脚本
 *
 * 用法: node batch-generate.js <配置目录> <输出目录>
 */

const fs = require('fs');
const path = require('path');
const { generateExperiment } = require('./generate-experiment-v2');

/**
 * 批量生成实验
 */
async function batchGenerate(configDir, outputDir) {
    console.log('🚀 批量生成实验\n');
    console.log(`📂 配置目录: ${configDir}`);
    console.log(`📂 输出目录: ${outputDir}\n`);

    // 查找所有配置文件
    const configFiles = findConfigFiles(configDir);
    console.log(`📋 找到 ${configFiles.length} 个配置文件\n`);

    if (configFiles.length === 0) {
        console.log('⚠️  没有找到配置文件');
        return { success: 0, failed: 0, total: 0 };
    }

    const results = {
        success: 0,
        failed: 0,
        total: configFiles.length,
        errors: []
    };

    // 逐个生成
    for (let i = 0; i < configFiles.length; i++) {
        const configFile = configFiles[i];
        const configPath = path.join(configDir, configFile);

        console.log(`[${i + 1}/${configFiles.length}] 生成: ${configFile}`);

        try {
            // 读取配置获取 ID
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            const outputPath = path.join(outputDir, `${config.metadata.id}.html`);

            // 生成实验
            const success = await generateExperiment(configPath, outputPath);

            if (success) {
                results.success++;
                console.log(`  ✅ 成功\n`);
            } else {
                results.failed++;
                console.log(`  ❌ 失败\n`);
            }
        } catch (error) {
            results.failed++;
            results.errors.push({
                file: configFile,
                error: error.message
            });
            console.log(`  ❌ 失败: ${error.message}\n`);
        }
    }

    // 输出统计
    console.log('\n' + '='.repeat(50));
    console.log('📊 生成统计');
    console.log('='.repeat(50));
    console.log(`总计: ${results.total}`);
    console.log(`成功: ${results.success} ✅`);
    console.log(`失败: ${results.failed} ❌`);
    console.log(`成功率: ${((results.success / results.total) * 100).toFixed(1)}%`);

    if (results.errors.length > 0) {
        console.log('\n❌ 错误详情:');
        results.errors.forEach(err => {
            console.log(`  - ${err.file}: ${err.error}`);
        });
    }

    return results;
}

/**
 * 查找所有配置文件
 */
function findConfigFiles(dir) {
    const files = [];

    function scan(currentDir) {
        const items = fs.readdirSync(currentDir);

        items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith('.json')) {
                files.push(path.relative(dir, fullPath));
            }
        });
    }

    scan(dir);
    return files;
}

// 命令行使用
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('用法: node batch-generate.js <配置目录> <输出目录>');
        console.log('示例: node batch-generate.js configs/elementary public/experiments/elementary');
        process.exit(1);
    }

    const [configDir, outputDir] = args;

    if (!fs.existsSync(configDir)) {
        console.error(`❌ 配置目录不存在: ${configDir}`);
        process.exit(1);
    }

    batchGenerate(configDir, outputDir)
        .then(results => {
            process.exit(results.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ 批量生成失败:', error);
            process.exit(1);
        });
}

module.exports = { batchGenerate };
