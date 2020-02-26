# 明日方舟工具箱

### 作者: [一只灰猫](https://github.com/graueneko)

## 开始使用

目前已部署在 Github Pages: [明日方舟工具箱 by 一只灰猫](https://aktools.graueneko.xyz/)

## 二次开发

页面允许 URL 中加入参数以修改显示样式。

包括三个参数，可以分别使用，以嵌入到您二次开发的app中: `hidenav`, `hidetags` 以及 `tags`。

其中 hidenav 全局有效, hidetags 和 tags 仅对公开招募页面有效。

例如：
<https://aktools.graueneko.xyz/hr?hidenav=&hidetags=&tags=爆发+新手+资深干员+快速复活>

## 反馈

有任何建议、想法，或发现 Bug，可以直接在本项目下提 [Issue](https://github.com/graueneko/aktools/issues)。

如果你实现了新功能/改进可以合并到 origin/master上，请发起 [Pull request](https://github.com/graueneko/aktools/pulls).

## 开发


1. 确保你的开发环境中包括 Node.js(10.9.0 或更高版本) 和 npm/yarn 包管理器
    * 获取 Node.js，请转到 [nodejs.org](https://nodejs.org)。
    * 获取 [yarn](https://baike.baidu.com/item/yarn)，请转到[yarnpkg.com](https://yarnpkg.com/zh-Hans/docs/install#windows-stable)（非必须安装，该网站可能需要梯子）
        ```bash
        # 检查 Node.js 版本
        node -v
        # 检查 npm 版本
        npm -v
        ```
2. 安装 cnpm 命令行工具（推荐）
    ```bash
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    ```
3. 安装 Angular CLI
    ```bash
    cnpm install -g @angular/cli
    # 检查 Angular 版本
    ng version
    ```
4. 克隆项目
    ```bash
    git clone https://github.com/graueneko/aktools.git
    cd aktools
    cnpm i -s
    # yarn 用户：
    # yarn
    ng serve -o
    ```


#### 注意事项

1. 开发请注意移动优先(Mobile First);
2. 尽管代码格式可能会随 TSLint 的配置不同发生变化，还请尽可能减少 PR 中未修改部分的代码变动;
3. 可以适量引入新图片、数据文件，但请勿加入过多、过大，~~以免国内网络访问过慢~~。

#### 参与开发您可能需要以下文档:

1. [Angular 9 中文文档](https://angular.cn/docs), or [Angular 9 Docs(en)](https://angular.io/docs)
2. [Blox Material Components](https://blox.src.zone/material/components)
3. [Angular Flex Layout](https://github.com/angular/flex-layout)

## 构建

```bash
ng build --prod --base-href "http[s]://*YOUR_URL*/"
```

可部署的 site 版本将生成在 `./dist/aktools` 目录下。

## 发布
请参照 `publish.sh.example` 中说明修改脚本内容，之后可用于一键发布。
