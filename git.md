## 如何取消暂存区和工作区的修改

场景： 当你将一个文件使用` git add` 命令提交到了暂存区，之后继续在该文件上进行开发，当你发现在工作区上的修改，还不如之前 `git add` 的状态时，直接放弃当前工作取得的修改

```
git checkout --filename


变更工作区：checkout

变更暂存区： reset
```


## 查看全局配置

```
//查看全局的配置
$ git config --global --list

//设置全局的配置
$ git config --global user.name "yourname"
//删除全局的配置
$ git config --global --unset user.name


```