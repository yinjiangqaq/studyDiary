# mac 开发

## mac 安装 create-react-app

```
sudo npm install -g create-react-app

```

## mac 上 create-react-app 实现 typescript 支持

```
npx create-react-app my-app --template typescript
```

如果这个命令不生效，说明安装的不是 latest create-react-app 包。建议` npm uninstall -g create-react-app`之后，再全局安装一次。

如何给一个现有项目提供 typescript 支持

```
npm install --save typescript @types/node @types/react @types/react-dom @types/jest

# or

yarn add typescript @types/node @types/react @types/react-dom @types/jest
```

然后重命名你的 js 文件，例如 src/index.js 重命名为 src/index.tsx。然后重新打开你的 dev server
