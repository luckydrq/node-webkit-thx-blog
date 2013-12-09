#node-webkit-thx-blog

这是一款[Thx](https://github.com/thx)的写博应用。

##编译与安装
```sh
cd your/root/path
git clone git@github.com:luckydrq/node-webkit-thx-blog.git
cd node-webkit-thx-blog && npm install
grunt
```
grunt编译任务完成后，最终的编译文件放在```build/releases/thx-blog```目录下：
```
build/releases/thx-blog
├── linux32
│   └── thx-blog
│       ├── libffmpegsumo.so
│       ├── nw.pak
│       └── thx-blog
├── linux64
│   └── thx-blog
│       ├── libffmpegsumo.so
│       ├── nw.pak
│       └── thx-blog
├── mac
│   └── thx-blog.app
│
└── win
    └── thx-blog
        ├── ffmpegsumo.dll
        ├── icudt.dll
        ├── libEGL.dll
        ├── libGLESv2.dll
        ├── nw.pak
        └── thx-blog.exe
```

如果你是*mac*用户，执行```open thx-blog.app```或者在*finder*里双击打开执行即可。如果你是*linux*用户，请参考这篇[guide](https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps)。如果你是*windows*用户，你懂的。。。

##使用流程
*首先，你需要加入*[Thx](https://github.com/thx)组织。可以联系[@李牧老师](https://github.com/limu)或者[@逸才老师](https://github.com/dotnil)申请加入。

<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/1.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/2.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/3.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/4.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/5.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/6.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/7.png" />
<img src="http://luckydrq.github.io/node-webkit-thx-blog/figures/8.png" />

##原理

###底层框架
这是一款基于[node-webkit](https://github.com/rogerwang/node-webkit)开发的应用。*node-webkit*把*webkit*与*nodejs*整合在一起，使得基于html5进行快速开发桌面应用变得非常简单。

###Github认证
基于[github api v3](http://developer.github.com/v3/)的[basic authentication](http://developer.github.com/v3/#authentication)。之所以用```basic authentication```是为了降低使用难度，代价是每次打开app都需要进行登录，但省去了*OAuth*的接入过程。

##BUG
因为是草稿版本，难免有功能或者缺陷，在继续完善中。有问题请联系[我](https://github.com/luckydrq)。



