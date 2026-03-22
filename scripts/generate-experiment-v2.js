#!/usr/bin/env node

/**
 * 实验生成器 v2.0
 *
 * 基于配置文件生成完整的独立 HTML 实验文件
 */

const fs = require('fs');
const path = require('path');

// 加载代码片段
const snippets = {
    core: {
        sceneSetup: require('./snippets/core/scene-setup.js')
    },
    lighting: {
        threePoint: require('./snippets/lighting/three-point.js')
    },
    materials: {
        pbr: require('./snippets/materials/pbr.js')
    },
    particles: {
        basic: require('./snippets/particles/basic.js')
    },
    utils: {
        performance: require('./snippets/utils/performance.js')
    }
};

/**
 * 主函数：生成实验
 */
async function generateExperiment(configPath, outputPath) {
    try {
        console.log('🚀 开始生成实验...\n');

        // 1. 加载配置
        console.log('📖 加载配置文件:', configPath);
        const config = loadConfig(configPath);

        // 2. 验证配置
        console.log('✅ 验证配置...');
        validateConfig(config);

        // 3. 选择代码片段
        console.log('🔍 选择代码片段...');
        const selectedSnippets = selectSnippets(config);

        // 4. 生成自定义代码
        console.log('💉 生成自定义代码...');
        const customCode = generateCustomCode(config);

        // 5. 组装 HTML
        console.log('🔨 组装 HTML...');
        const html = assembleHTML(config, selectedSnippets, customCode);

        // 6. 写入文件
        console.log('💾 写入文件:', outputPath);
        writeFile(outputPath, html);

        console.log('\n✨ 成功生成实验！');
        console.log(`📄 文件大小: ${(html.length / 1024).toFixed(2)} KB`);
        return true;
    } catch (error) {
        console.error('\n❌ 生成失败:', error.message);
        console.error(error.stack);
        return false;
    }
}

/**
 * 加载配置文件
 */
function loadConfig(configPath) {
    if (!fs.existsSync(configPath)) {
        throw new Error(`配置文件不存在: ${configPath}`);
    }

    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
}

/**
 * 验证配置
 */
function validateConfig(config) {
    const required = ['metadata', 'scene', 'objects', 'controls'];

    for (const field of required) {
        if (!config[field]) {
            throw new Error(`缺少必需字段: ${field}`);
        }
    }

    // 验证元数据
    if (!config.metadata.id || !config.metadata.title) {
        throw new Error('元数据不完整：缺少 id 或 title');
    }

    // 验证场景
    if (!config.scene.lighting) {
        throw new Error('缺少光照配置');
    }

    return true;
}

/**
 * 选择代码片段
 */
function selectSnippets(config) {
    const selected = {
        core: [],
        lighting: [],
        materials: [],
        particles: [],
        utils: []
    };

    // 核心片段（必需）
    selected.core.push(snippets.core.sceneSetup);

    // 光照系统
    if (config.scene.lighting === 'three-point') {
        selected.lighting.push(snippets.lighting.threePoint);
    }

    // 材质系统
    const usesMaterials = config.objects.some(obj => obj.material);
    if (usesMaterials) {
        selected.materials.push(snippets.materials.pbr);
    }

    // 粒子系统
    const hasParticles = config.objects.some(obj => obj.type === 'particles') ||
                        (config.particles && config.particles.enabled);
    if (hasParticles) {
        selected.particles.push(snippets.particles.basic);
    }

    // 工具函数（必需）
    selected.utils.push(snippets.utils.performance);

    return selected;
}

/**
 * 生成自定义代码
 */
function generateCustomCode(config) {
    return {
        objectCreation: generateObjectCreationCode(config.objects, config.particles),
        controls: generateControlsCode(config.controls || []),
        init: config.customCode?.init || '',
        animation: config.customCode?.animation || '',
        interactions: config.customCode?.interactions || ''
    };
}

/**
 * 生成物体创建代码
 */
function generateObjectCreationCode(objects, particlesConfig) {
    let code = '// === 创建物体 ===\n';

    objects.forEach((obj, index) => {
        if (obj.customCode) {
            code += `\n// 自定义物体 ${index + 1}\n`;
            code += obj.customCode + '\n';
        } else if (obj.type === 'particles') {
            code += `\n// 粒子系统 ${index + 1}\n`;
            code += `const particleSystem${index + 1} = createParticleSystem({\n`;
            code += `    count: ${obj.count || 1000},\n`;
            code += `    size: ${obj.size || 0.1},\n`;
            code += `    color: ${obj.color || '0x00c6ff'},\n`;
            code += `    spread: ${obj.spread || 10}\n`;
            code += `});\n`;
        } else {
            code += generateStandardObject(obj, index);
        }
    });

    // 如果有独立的 particles 配置，也创建粒子系统
    if (particlesConfig && particlesConfig.enabled) {
        code += `\n// 粒子系统（独立配置）\n`;
        code += `const particleSystem = createParticleSystem({\n`;
        code += `    count: ${particlesConfig.count || 1000},\n`;
        code += `    size: ${particlesConfig.size || 0.1},\n`;
        code += `    color: '${particlesConfig.color || '#00c6ff'}',\n`;
        code += `    spread: ${particlesConfig.spread || 10}\n`;
        code += `});\n`;
        code += `particleSystem.visible = false; // 初始隐藏\n`;
    }

    return code;
}

/**
 * 生成标准物体代码
 */
function generateStandardObject(obj, index) {
    const varName = `object${index + 1}`;
    let code = `\n// ${obj.type}\n`;

    // 几何体（传入 type 和 geometry）
    const geometryType = getGeometryType(obj.type, obj.geometry);
    code += `const geometry${index + 1} = new THREE.${geometryType};\n`;

    // 材质
    if (obj.material) {
        // 支持对象格式
        if (typeof obj.material === 'object') {
            const preset = obj.material.preset || 'plastic';
            const color = obj.material.color || '#3B82F6';
            code += `const material${index + 1} = createMaterial('${preset}', '${color}');\n`;

            // 应用额外的材质属性
            if (obj.material.metalness !== undefined) {
                code += `material${index + 1}.metalness = ${obj.material.metalness};\n`;
            }
            if (obj.material.roughness !== undefined) {
                code += `material${index + 1}.roughness = ${obj.material.roughness};\n`;
            }
            if (obj.material.transparent !== undefined) {
                code += `material${index + 1}.transparent = ${obj.material.transparent};\n`;
            }
            if (obj.material.opacity !== undefined) {
                code += `material${index + 1}.opacity = ${obj.material.opacity};\n`;
            }
            if (obj.material.emissive) {
                code += `material${index + 1}.emissive = new THREE.Color('${obj.material.emissive}');\n`;
            }
            if (obj.material.emissiveIntensity !== undefined) {
                code += `material${index + 1}.emissiveIntensity = ${obj.material.emissiveIntensity};\n`;
            }
        } else {
            // 支持字符串格式（简化配置）
            code += `const material${index + 1} = createMaterial('${obj.material}', '${obj.color || '#3B82F6'}');\n`;
        }
    } else {
        code += `const material${index + 1} = new THREE.MeshStandardMaterial({ color: '${obj.color || '#3B82F6'}' });\n`;
    }

    // 网格
    code += `const ${varName} = new THREE.Mesh(geometry${index + 1}, material${index + 1});\n`;

    // 设置名称（用于后续引用）
    if (obj.id) {
        code += `${varName}.name = '${obj.id}';\n`;
    }

    // 位置
    if (obj.position) {
        code += `${varName}.position.set(${obj.position.join(', ')});\n`;
    }

    // 旋转（支持角度，自动转换为弧度）
    if (obj.rotation) {
        const rotations = obj.rotation.map(r => `${r} * Math.PI / 180`);
        code += `${varName}.rotation.set(${rotations.join(', ')});\n`;
    }

    // 缩放
    if (obj.scale) {
        if (Array.isArray(obj.scale)) {
            code += `${varName}.scale.set(${obj.scale.join(', ')});\n`;
        } else {
            code += `${varName}.scale.setScalar(${obj.scale});\n`;
        }
    }

    // 阴影
    if (obj.castShadow) {
        code += `${varName}.castShadow = true;\n`;
    }
    if (obj.receiveShadow) {
        code += `${varName}.receiveShadow = true;\n`;
    }

    // 添加到场景
    code += `scene.add(${varName});\n`;

    return code;
}

/**
 * 获取几何体类型（支持字符串和对象格式）
 */
function getGeometryType(type, geometry) {
    // 如果 geometry 是字符串，使用默认参数
    if (typeof geometry === 'string') {
        const types = {
            'box': 'BoxGeometry(1, 1, 1)',
            'sphere': 'SphereGeometry(1, 32, 32)',
            'cylinder': 'CylinderGeometry(1, 1, 2, 32)',
            'cone': 'ConeGeometry(1, 2, 32)',
            'plane': 'PlaneGeometry(10, 10)',
            'torus': 'TorusGeometry(1, 0.4, 16, 100)'
        };
        return types[geometry] || types.box;
    }

    // 如果 geometry 是对象，根据 type 生成带参数的几何体
    switch (type) {
        case 'box':
            return `BoxGeometry(${geometry.width || 1}, ${geometry.height || 1}, ${geometry.depth || 1})`;
        case 'sphere':
            return `SphereGeometry(${geometry.radius || 1}, ${geometry.widthSegments || 32}, ${geometry.heightSegments || 32})`;
        case 'cylinder':
            return `CylinderGeometry(${geometry.radiusTop || 1}, ${geometry.radiusBottom || 1}, ${geometry.height || 2}, ${geometry.radialSegments || 32})`;
        case 'cone':
            return `ConeGeometry(${geometry.radius || 1}, ${geometry.height || 2}, ${geometry.radialSegments || 32})`;
        case 'plane':
            return `PlaneGeometry(${geometry.width || 10}, ${geometry.height || 10})`;
        case 'torus':
            return `TorusGeometry(${geometry.radius || 1}, ${geometry.tube || 0.4}, ${geometry.radialSegments || 16}, ${geometry.tubularSegments || 100})`;
        default:
            return 'BoxGeometry(1, 1, 1)';
    }
}

/**
 * 生成控制逻辑代码
 */
function generateControlsCode(controls) {
    let code = '// === 控制面板逻辑 ===\n';

    controls.forEach((control, index) => {
        const id = control.id || `control${index + 1}`;
        const type = control.type || 'slider';

        if (type === 'button') {
            // 按钮控件
            code += `\ndocument.getElementById('${id}').addEventListener('click', () => {\n`;
            if (control.action) {
                code += `    ${control.action}();\n`;
            }
            code += `});\n`;
        } else if (type === 'slider') {
            // 滑块控件
            code += `\ndocument.getElementById('${id}').addEventListener('input', (e) => {\n`;
            code += `    const value = parseFloat(e.target.value);\n`;
            code += `    document.getElementById('${id}-value').textContent = value.toFixed(${control.decimals || 1});\n`;

            if (control.onChange) {
                code += `    ${control.onChange}\n`;
            }

            code += `});\n`;
        } else if (type === 'checkbox') {
            // 复选框控件
            code += `\ndocument.getElementById('${id}').addEventListener('change', (e) => {\n`;
            code += `    const checked = e.target.checked;\n`;

            if (control.onChange) {
                code += `    ${control.onChange}\n`;
            }

            code += `});\n`;
        }
    });

    return code;
}

/**
 * 组装完整 HTML
 */
function assembleHTML(config, snippets, customCode) {
    const colors = getColorScheme(config.metadata.subject);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.metadata.title} - 交互式科学实验</title>

    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>

    <!-- KaTeX -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

    ${generateStyles(config, colors)}
</head>
<body>
    ${generateHTMLStructure(config)}

    <script>
        ${generateJavaScript(snippets, customCode)}
    </script>
</body>
</html>`;
}

/**
 * 获取颜色方案
 */
function getColorScheme(subject) {
    const schemes = {
        physics: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#93C5FD' },
        chemistry: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD' },
        biology: { primary: '#10B981', secondary: '#34D399', accent: '#6EE7B7' },
        earth: { primary: '#0EA5E9', secondary: '#38BDF8', accent: '#7DD3FC' }
    };

    return schemes[subject] || schemes.physics;
}

/**
 * 生成样式
 */
function generateStyles(config, colors) {
    return `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #e0e0e0;
            overflow-x: hidden;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            text-align: center;
            color: #888;
            margin-bottom: 30px;
            font-size: 1.1em;
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 20px;
            margin-bottom: 30px;
        }

        #canvas-container {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-height: 600px;
            width: 100%;
            height: 600px;
            position: relative;
        }

        .controls-panel {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .controls-panel h3 {
            color: ${colors.primary};
            margin-bottom: 20px;
        }

        .control-group {
            margin-bottom: 25px;
        }

        .control-group label {
            display: block;
            margin-bottom: 8px;
            color: #b0b0b0;
            font-size: 0.9em;
            font-weight: 500;
        }

        .value-display {
            float: right;
            color: ${colors.primary};
            font-weight: 600;
        }

        .control-group input[type="range"] {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.1);
            outline: none;
            -webkit-appearance: none;
        }

        .control-group input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            cursor: pointer;
        }

        .control-button {
            width: 100%;
            padding: 12px 20px;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .control-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }

        .control-button:active {
            transform: translateY(0);
        }

        @media (max-width: 1024px) {
            .main-content {
                grid-template-columns: 1fr;
            }
        }

        .formula-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .formula-section h2 {
            color: ${colors.primary};
            margin-bottom: 15px;
            font-size: 1.5em;
        }

        .formula-item {
            margin: 15px 0;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border-left: 3px solid ${colors.primary};
        }

        .formula-item p {
            margin-top: 8px;
            color: #888;
            font-size: 0.9em;
        }

        .knowledge-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .knowledge-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .knowledge-card:hover {
            transform: translateY(-5px);
            border-color: ${colors.primary};
        }

        .knowledge-card h3 {
            color: ${colors.primary};
            margin-bottom: 10px;
            font-size: 1.2em;
        }

        .knowledge-card p {
            color: #b0b0b0;
            line-height: 1.6;
            font-size: 0.95em;
        }

        .quiz-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 30px;
        }

        .quiz-section h2 {
            color: ${colors.primary};
            margin-bottom: 20px;
            font-size: 1.5em;
        }

        .quiz-question {
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }

        .quiz-question h4 {
            color: #e0e0e0;
            margin-bottom: 15px;
            font-size: 1.1em;
        }

        .quiz-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .quiz-option {
            padding: 12px 18px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .quiz-option:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: ${colors.primary};
        }

        .quiz-option.correct {
            background: rgba(76, 175, 80, 0.2);
            border-color: #4caf50;
        }

        .quiz-option.incorrect {
            background: rgba(244, 67, 54, 0.2);
            border-color: #f44336;
        }

        .quiz-feedback {
            margin-top: 15px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }

        .feedback-correct {
            color: #4caf50;
        }

        .feedback-incorrect {
            color: #f44336;
        }
    </style>
    `;
}

/**
 * 生成 HTML 结构
 */
function generateHTMLStructure(config) {
    return `
    <div class="container">
        <h1>${config.metadata.icon || ''} ${config.metadata.title}</h1>
        <p class="subtitle">${config.metadata.subtitle || ''}</p>

        <div class="main-content">
            <div id="canvas-container"></div>

            <div class="controls-panel">
                <h3>控制面板</h3>
                ${generateControlsHTML(config.controls)}
            </div>
        </div>

        ${config.formulas ? generateFormulasSection(config.formulas) : ''}
        ${config.knowledgeCards ? generateKnowledgeCards(config.knowledgeCards) : ''}
        ${config.quiz ? generateQuizSection(config.quiz) : ''}
    </div>
    `;
}

/**
 * 生成公式区域
 */
function generateFormulasSection(formulas) {
    if (!formulas || formulas.length === 0) return '';

    return `
    <div class="formula-section">
        <h2>关键公式</h2>
        ${formulas.map(formula => `
        <div class="formula-item">
            <strong>${formula.title}:</strong> $${formula.formula}$
            ${formula.description ? `<p>${formula.description}</p>` : ''}
        </div>
        `).join('')}
    </div>
    `;
}

/**
 * 生成知识卡片
 */
function generateKnowledgeCards(cards) {
    if (!cards || cards.length === 0) return '';

    return `
    <div class="knowledge-cards">
        ${cards.map(card => `
        <div class="knowledge-card">
            <h3>${card.title}</h3>
            <p>${card.content}</p>
        </div>
        `).join('')}
    </div>
    `;
}

/**
 * 生成测验区域
 */
function generateQuizSection(quiz) {
    if (!quiz || quiz.length === 0) return '';

    return `
    <div class="quiz-section">
        <h2>测试你的知识</h2>
        ${quiz.map((question, qIndex) => `
        <div class="quiz-question">
            <h4>${qIndex + 1}. ${question.question}</h4>
            <div class="quiz-options">
                ${question.options.map((option, oIndex) => `
                <div class="quiz-option" onclick="checkAnswer(this, ${oIndex === question.correctIndex}, '${question.explanation || ''}')">
                    ${option}
                </div>
                `).join('')}
            </div>
            <div class="quiz-feedback"></div>
        </div>
        `).join('')}
    </div>

    <script>
    function checkAnswer(element, isCorrect, explanation) {
        const options = element.parentElement.children;
        const feedback = element.parentElement.nextElementSibling;

        // 禁用所有选项
        for (let option of options) {
            option.style.pointerEvents = 'none';
        }

        if (isCorrect) {
            element.classList.add('correct');
            feedback.innerHTML = '<div class="feedback-correct">✅ 正确！' + (explanation ? ' ' + explanation : '') + '</div>';
        } else {
            element.classList.add('incorrect');
            feedback.innerHTML = '<div class="feedback-incorrect">❌ 不正确。' + (explanation ? ' ' + explanation : '') + '</div>';
        }

        feedback.style.display = 'block';
    }
    </script>
    `;
}

/**
 * 生成控制面板 HTML
 */
function generateControlsHTML(controls) {
    if (!controls || controls.length === 0) return '';

    return controls.map((control, index) => {
        const id = control.id || `control${index + 1}`;
        const type = control.type || 'slider';

        if (type === 'button') {
            // 按钮控件
            return `
        <div class="control-group">
            <button id="${id}" class="control-button">
                ${control.label}
            </button>
        </div>
        `;
        } else if (type === 'slider') {
            // 滑块控件
            return `
        <div class="control-group">
            <label>
                ${control.label}
                <span class="value-display" id="${id}-value">${control.default}${control.unit || ''}</span>
            </label>
            <input type="range" id="${id}"
                   min="${control.min}"
                   max="${control.max}"
                   value="${control.default}"
                   step="${control.step || 1}">
        </div>
        `;
        } else if (type === 'checkbox') {
            // 复选框控件
            return `
        <div class="control-group">
            <label>
                <input type="checkbox" id="${id}" ${control.default ? 'checked' : ''}>
                ${control.label}
            </label>
        </div>
        `;
        }

        return '';
    }).join('\n');
}

/**
 * 生成 JavaScript
 */
function generateJavaScript(snippets, customCode) {
    let js = '';

    // 核心代码
    snippets.core.forEach(snippet => {
        js += snippet + '\n\n';
    });

    // 光照
    snippets.lighting.forEach(snippet => {
        js += snippet + '\n\n';
    });

    // 材质
    snippets.materials.forEach(snippet => {
        js += snippet + '\n\n';
    });

    // 粒子系统
    snippets.particles.forEach(snippet => {
        js += snippet + '\n\n';
    });

    // 自定义物体创建
    js += customCode.objectCreation + '\n\n';

    // 初始化代码
    if (customCode.init) {
        js += '// === 初始化 ===\n';
        js += customCode.init + '\n\n';
    }

    // 控制逻辑
    js += customCode.controls + '\n\n';

    // 交互逻辑
    if (customCode.interactions) {
        js += '// === 交互逻辑 ===\n';
        js += customCode.interactions + '\n\n';
    }

    // 动画循环
    js += `
    // === 动画循环 ===
    function animate() {
        requestAnimationFrame(animate);

        ${customCode.animation}

        controls.update();
        renderer.render(scene, camera);
    }

    animate();
    `;

    // 工具函数
    snippets.utils.forEach(snippet => {
        js += '\n\n' + snippet;
    });

    return js;
}

/**
 * 写入文件
 */
function writeFile(outputPath, content) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content, 'utf-8');
}

// 命令行使用
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('用法: node generate-experiment-v2.js <配置文件> <输出文件>');
        console.log('示例: node generate-experiment-v2.js configs/test.json output/test.html');
        process.exit(1);
    }

    const [configPath, outputPath] = args;
    generateExperiment(configPath, outputPath);
}

module.exports = { generateExperiment };
