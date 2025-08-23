const fs = require('fs');
const path = require('path');

// 配置
const BLOGS_DIR = path.join(__dirname, '../src/blogs');
const OUTPUT_FILE = path.join(BLOGS_DIR, 'count.md');

// 递归扫描目录
function scanDirectory(dir, basePath = '', level = 0) {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.name !== 'count.md') // 跳过统计文件本身
    .sort((a, b) => {
      // 目录优先，然后按名称排序
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  // 统计信息
  let fileCount = 0;
  let dirCount = 0;

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      dirCount++;
      const subResult = scanDirectory(fullPath, relativePath, level + 1);
      items.push({
        type: 'directory',
        name: entry.name,
        path: relativePath,
        level,
        children: subResult.items,
        stats: subResult.stats
      });
      fileCount += subResult.stats.files;
      dirCount += subResult.stats.directories;
    } else if (entry.name.endsWith('.md')) {
      fileCount++;
      // 读取文件内容获取标题
      const content = fs.readFileSync(fullPath, 'utf8');
      // 尝试多种方式提取标题
      let title = entry.name.replace('.md', '');

      // 尝试提取一级标题
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1].trim();
      } else {
        // 尝试提取简介部分
        const introMatch = content.match(/(?:#|##)\s*简介\s*\n([\s\S]*?)(?=\n#|\n##|$)/i);
        if (introMatch && introMatch[1]) {
          title = introMatch[1].trim().split('\n')[0].replace(/^[-*]\s*/, '');
        }
      }

      items.push({
        type: 'file',
        name: entry.name.replace('.md', ''), // 去掉.md后缀
        title: title || entry.name.replace('.md', ''),
        path: relativePath,
        level
      });
    }
  });

  return {
    items,
    stats: { files: fileCount, directories: dirCount }
  };
}

// 生成树形结构文本
function generateTreeText(items, prefixes = [], isRoot = true) {
  let result = '';

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;

    // 构建当前行的前缀
    let linePrefix = '';
    if (!isRoot) {
      linePrefix = prefixes.join('');
    }

    // 添加连接符
    const connector = isLast ? '└── ' : '├── ';

    if (item.type === 'directory') {
      result += `${linePrefix}${connector}${item.name}/\n`;

      // 为子项目构建新的前缀
      const newPrefixes = [...prefixes];
      if (!isRoot) {
        newPrefixes.push(isLast ? '    ' : '│   ');
      }

      // 递归处理子项目
      if (item.children && item.children.length > 0) {
        result += generateTreeText(item.children, newPrefixes, false);
      }
    } else {
      // 只显示文件名，不显示标题描述
      result += `${linePrefix}${connector}${item.name}\n`;
    }
  });

  return result;
}

// 生成统计信息 - 修复文件计数问题
function generateStats(items) {
  let totalFiles = 0;
  let totalDirs = 0;
  const categoryStats = {};

  // 首先统计所有文件和目录
  function countAll(items) {
    items.forEach(item => {
      if (item.type === 'directory') {
        totalDirs++;
        if (item.children) {
          countAll(item.children);
        }
      } else if (item.type === 'file') {
        totalFiles++;
      }
    });
  }

  // 然后按分类统计
  function countByCategory(items, currentPath = '') {
    items.forEach(item => {
      if (item.type === 'directory') {
        const categoryName = currentPath ? `${currentPath}/${item.name}` : item.name;
        
        // 初始化目录统计
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = { files: 0, directories: 0 };
        }

        if (item.children) {
          // 统计当前目录下的所有文件（包括子目录中的文件）
          const allFiles = [];

          // 递归统计所有子文件
          function countSubFiles(children) {
            children.forEach(child => {
              if (child.type === 'file') {
                allFiles.push(child);
              } else if (child.type === 'directory' && child.children) {
                countSubFiles(child.children);
              }
            });
          }

          countSubFiles(item.children);

          // 统计当前目录下的直接子目录
          const directDirs = item.children.filter(child => child.type === 'directory').length;

          categoryStats[categoryName].files = allFiles.length;
          categoryStats[categoryName].directories = directDirs;
          
          // 递归处理子目录
          countByCategory(item.children, categoryName);
        }
      }
    });
  }

  // 执行统计
  countAll(items);
  countByCategory(items);

  // 添加"全部"分类统计
  categoryStats['全部'] = { files: totalFiles, directories: totalDirs };

  return { totalFiles, totalDirs, categoryStats };
}

// 生成文章列表
function generateArticleList(items, parentPath = '') {
  let result = '';

  items.forEach(item => {
    const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;

    if (item.type === 'directory') {
      // 为目录添加标题
      result += `\n### 📁 ${currentPath}\n\n`;

      if (item.children) {
        result += generateArticleList(item.children, currentPath);
      }
    } else {
      // 使用文件名（去掉.md后缀）作为链接名称
      const linkName = item.name;
      const link = item.path.replace(/\\/g, '/');
      result += `- [${linkName}](${link})\n`;
    }
  });

  return result;
}

// 生成分类统计表格 - 只显示一级目录
function generateCategoryTable(categoryStats) {
  let table = '| 分类 | 文章数 | 子目录数 |\n';
  table += '|------|--------|----------|\n';

  // 添加"全部"分类
  table += `| 全部 | ${categoryStats['全部'].files} | ${categoryStats['全部'].directories} |\n`;

  // 只处理一级目录，过滤掉二级目录
  Object.entries(categoryStats).forEach(([category, stat]) => {
    // 只处理一级目录（不包含"/"的分类）
    if (category !== '全部' && !category.includes('/')) {
      table += `| ${category} | ${stat.files} | ${stat.directories} |\n`;
    }
  });

  return table;
}

// 主函数
function generateCountFile() {
  try {
    console.log('开始扫描博客目录...');

    if (!fs.existsSync(BLOGS_DIR)) {
      console.error(`❌ 博客目录不存在: ${BLOGS_DIR}`);
      return;
    }

    const result = scanDirectory(BLOGS_DIR);
    const stats = generateStats(result.items);

    // 确保根目录名称正确
    const rootItems = result.items.map(item => ({
      ...item,
      name: item.name === '..\\\\src\\\\blogs' ? 'blogs' : item.name
    }));

    const treeText = generateTreeText(rootItems, [], true);
    const categoryTable = generateCategoryTable(stats.categoryStats);
    const articleList = generateArticleList(result.items);

    // 生成 Markdown 内容，使用系统默认字体
    const content = `# 博客文章统计

> 最后更新时间: ${new Date().toLocaleString('zh-CN')}

## 📊 总体统计

- **总文章数**: ${stats.totalFiles} 篇
- **总目录数**: ${stats.totalDirs} 个
- **总分类数**: ${Object.keys(stats.categoryStats).length} 个

## 📁 目录结构

\`\`\`
blogs/
${treeText}\`\`\`

## 📈 分类统计

${categoryTable}

## 🔍 文章列表

${articleList}

---

*此文件由脚本自动生成，请勿手动编辑*
`;

    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
    console.log(`✅ 统计文件已生成: ${OUTPUT_FILE}`);
    console.log(`📝 共统计 ${stats.totalFiles} 篇文章，${stats.totalDirs} 个目录`);

  } catch (error) {
    console.error('❌ 生成统计文件失败:', error);
  }
}

// 执行生成
if (require.main === module) {
  generateCountFile();
}
