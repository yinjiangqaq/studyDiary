## 如何取消暂存区和工作区的修改

场景： 当你将一个文件使用 ` git add` 命令提交到了暂存区，之后继续在该文件上进行开发，当你发现在工作区上的修改，还不如之前 `git add` 的状态时，直接放弃当前工作取得的修改

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

## git stash

正在开发当前分支，但是需要切到其他分支

开开心心地在新的分支上开发新的功能，这时候，产品经理说 其他分支有 bug 或者修改需求，需要赶紧处理下，这样的话，就需要切到目标分支了，那在当前的分支上所作的修改该怎么办呢？

我想到的是 commit，但其实还有更好的方法

1. 使用 git stash push –m”message” 保存当前的修改
2. 切到目标分支修改 bug，修改提交后切回原分支
3. 使用 git stash pop 还原

这里需要注意的就是保存当前修改的时候，最好是添加上 message，而不是简单的 git stash，因为 git stash 一旦多了之后，就会记不清是做了什么修改

在错误的分支开发了新功能，新功能还没有在本地进行 commit（提交）

1. 使用 git stash push –m”message”保存当前的修改

2. 切换到需要开发的分支

3. 使用 git stash apply 应用修改

## 企业 git 流程

开发分支： `feature/版本_日期` 从 `master` 切出来，开发分支开发完之后，自测功能基本实现的话，合并到测试分支 `(test/docker)` , 测试环境测试完没有问题之后，合到灰度，最后再合到 master, 功能上线之后，开发分支是会删掉的.

```

                           --test/docker

   feature(从master切出来的) ----gray

                            -----master

```

功能上线之后，后续 master 分支有 Bug,从`master`切出来一个分支`hotfix_bug名_日期`,大概流程其他是跟开发分支差不多，需要记住的是，无论是开发还是`hotfix`，全部都是开发和`hotfix`，合并到其他分支里面，也就是切到其他分支，去合并我们的开发和`hotfix`

```

                     -----test/docker

 hotfix(从master切出来)---gray

                      ----master

```

## git 回退 commit

```
$ git log 查看对应的commit号，然后复制一个你想要回退到的分支的commit 号,复制完之后，建议拿个地方存放一下，然后 按Q 退出 git的命令行

$ git reset --hard d95191f78313497142285ba8d3904deee451cf22//本地回到对应的commit版本

$ git push origin 分支名 --force //把你的回退发布到远程


```

## git 如何修改本地分支和远程分支的名字

```
git branch -a //查看所有分支

git branch -r //查看所有远程分支

git branch -vv //查看本地分支所关联的远程分支

git branch -m old_branch new_branch //本地修改分支名

git push origin :old_branch //删除远程老分支

git push -u origin new_branch  or git push --set-upstream origin new_branch //把本地新改名的分支推到远程

```

## git本地合并代码有冲突(还没提交到远程)怎么撤销合并
```
$ git merge --abort
```