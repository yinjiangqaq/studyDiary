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

3. 使用 git stash apply + hash  能把丢失的stash 也给找回来，只要保留了hash值，git stash pop 的时候，就会暴露这个stash 的 hash 值

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


## 将远程的分支拉到本地

```
git fetch origin branch name : local branch name

git checkout local branch name
```


## 怎么查看该分支的来源

```
git reflog show childBranchName
```

## 当feature分支落后于master，也就是master分支有更新的commit的时候，怎么让feature分支跟master分支对齐

```
1. feature $: git merge master

//然后觉得合并的冲突。但是这样有一个缺点，就是会把其他人推到master的commit，也一起带过去，其实这些commit并不是你这个分支的修改，对于你这个分支来说是无效的commit记录。

2. git rebase master （本地的master，注意拉到最新）

```

## git rebase
> 这是一个拿来合并多次提交记录的命令,可以让我们的提交记录更简洁

### 场景一：合并多次提交记录
```
git rebase -i HEAD~4 //合并最近的四次提交记录
```
这时候，会自动进入到vi编辑模式

```
s cacc52da add: qrcode
s f072ef48 update: indexeddb hack
s 4e84901a feat: add indexedDB floder
s 8f33126c feat: add test2.js

# Rebase 5f2452b2..8f33126c onto 5f2452b2 (4 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

有几个命令需要注意一下
```
p, pick = use commit
r, reword = use commit, but edit the commit message
e, edit = use commit, but stop for amending
s, squash = use commit, but meld into previous commit
f, fixup = like “squash”, but discard this commit’s log message
x, exec = run command (the rest of the line) using shell
d, drop = remove commit
```
按照上面的命令来修改你的提交记录
```
s cacc52da add: qrcode
s f072ef48 update: indexeddb hack
s 4e84901a feat: add indexedDB floder
p 8f33126c feat: add test2.js
```

如果保存的时候，你碰到了这个错误：
```
error: cannot 'squash' without a previous commit
```

> 注意不要合并先前提交的东西，也就是已经提交远程分支的纪录。


如果你异常退出了 vi 窗口，不要紧张：

```
git rebase --edit-todo
```

这时候会一直处在这个编辑的模式里，我们可以回去继续编辑。修改完保存一下

```
git rebase --continue
```
查看结果

```
git log
```

#### 具体的操作步骤

```
git rebase -i HEAD~5
```

把最前面的五个commit  合并为一个,sqash是 合并到上一个更改，然后保留commit信息
,fix 是合并到上一个更改，但是不保留commit信息,pick是保留此次更改


所以进行完 git rebase -i HEAD~5 命令之后，会出现。
```
pick commit 1
pick commit 2
pick commit 3
pick commit 4
pick commit 5
```

这样的操作界面，一般commit 5就是你最新的一个commit，现在你需要把这五个commit合并为一个，你需要向上合并，pick commit 1，然后其他四个commit 的 `pick` 都改为f,不保留 commit信息，向上合并
```
pick commit 1
f commit 2
f commit 3
pick commit 4
f commit 5
```
如果最后是这样的话，rebase就会保留两个commit记录，一个是commit 1，合并了2和3的，一个是commit 4 合并了5的。 而f 和 s的区别是，f是会丢弃commit记录，而s是会把commit记录合并到上一个更改中。


如果在rebase过程中，因为commit记录太多的话，手动把pick改成squash的话，很困难，可以采用 vi 全局配置。

```
:%s/pick/squash/g（等同于 :g/pick/s//squash/g） 替换每一行中所有 pick 为 squash
```


### 分支合并

```
git:(master) git checkout -b feature1 //从master切出来功能分支

//这时候，你的同事完成了一次 hotfix，并合并入了 master 分支，此时 master 已经领先于你的 feature1 分支了,所以可以使用rebase

git:(feature1) git rebase master//切换到功能分支，执行rebase命令

```
在这里，rebase做的操作是：

首先，git 会把 feature1 分支里面的每个 commit 取消掉；

其次，把上面的操作临时保存成 patch 文件，存在 .git/rebase 目录下；

然后，把 feature1 分支更新到最新的 master 分支；

最后，把上面保存的 patch 文件应用到 feature1 分支上；

在 rebase 的过程中，也许会出现冲突 conflict。在这种情况，git 会停止 rebase 并会让你去解决冲突。在解决完冲突后，用 git add 命令去更新这些内容。


```
git rebase --continue  //注意，你无需执行 git-commit，只要执行 continue,这样 git 会继续应用余下的 patch 补丁文件。
```

在任何时候，我们都可以用 --abort 参数来终止 rebase 的行动，并且分支会回到 rebase 开始前的状态。

```
git rebase —abort
```


### 常用 git rebase -i origin/master

## git rebase 成功之后，还没push --force到远程时，如何撤销git rebase。

此时应该执行 `git reflog `命令，然后查看到远程的commit记录，执行`git reset --hard origin commit号`回到执行git rebase之前的位置。


## 本地更改分支名

git 本地分支还没推到远程的时候，但是已经写了一部分代码的了，可以先把更改，commit， 然后把不需要推上远程的代码 git stash ，如果没有，就不用执行这个操作，然后 执行`git branch -m new branch name`，然后 git push 上去。

## 查看本地所有git config

```
git config -l //查看本地config 列表
//取消设置
git config --unset http.proxy
git config --unset https.proxy
git config --global --unset http.proxy
git config --global --unset https.proxy
//设置

git config http.proxy xxx:xxx
git config https.proxy xxx:xxx

```

## git 提交代码形式从http形式更改为ssh形式
```
$: git remote set-url origin git@github.com:yinjiangqaq/studyDiary.git
```

## git 提交代码形式从ssh 形式更改为http 形式

```
$: git remote set-url origin http://github.com/yinjiangqaq/studyDiary.git
```

## 查看远端设置的源
```
git remote -v
```

## git set upstream 

```
//因为是属于分支操作，所以前置命令是git branch 

$: git branch --set-upstream-to origin/<branch Name>
```

## 回滚

```
$ git show commitID // 展示对应commit的信息
$ git reset --hard commitId // 这是强删。会把对应的commit删掉

$ git revert commitId // 这是在对应的commit上再加一个commit，把对应的代码删掉
```

## 本地合并远程分支

```
$ git fetch origin branchA

$ git checkout  localBranchB

$ git merge origin branchA
```

## 开发过程中性能相关的

对于一个页面，如果子组件很多，而且子组件依赖了父组件的一些state和一些props，对于子组件，我们一定要用`React.useMemo()`进行包裹，避免子组件因为父级的重新渲染导致的渲染。

然后对于一些对首页的状态没有任何依赖的纯函数，我们一定要防止在首页的最外层，避免因为首页的重新渲染导致纯函数的重复执行，因为每一次执行，都会生成一个新的副本。这种对页面性能的影响也很不好。


## 查看react native页面性能的工具

`react-dev-tools`



## git 二分查找有问题的commit 

git bisect 

```
首先你当前的commit是有问题的，但是你不知道从哪个commit开始你的commit就有这个问题，你需要通过二分查找的方式，找到这个有问题的commit

1. 确认你的判断条件，例如单测，yarn run test 对应的文件

2. 确认正常OK的commit hash

3. 然后开始我们的git bisect之旅

4. git bisect start

5. git bisect bad // 当前所在的commit是错误的

6. git bisect good 正常commit hash //定义好终点

7. 定义好起点终点以后，它会自动告诉你还有多少次二分，然后每一次进行操作，我们都用之前定好的判断条件来进行判断，这个commit是好是坏，然后告诉它 git bisect good or bad

...

到最后就能确认有问题的commit是哪个

```


## git merge-base 

git merge-base head [branc