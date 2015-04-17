kbengine_cocos2d_js_demo
=============

##本项目作为KBEngine服务端引擎的客户端演示而写
http://www.kbengine.org

##官方论坛

	http://bbs.kbengine.org


##QQ交流群

	16535321 


##Releases

	sources		: https://github.com/kbengine/kbengine_cocos2d_js_demo/releases/latest
	binarys		: https://sourceforge.net/projects/kbengine/files/


##开始:
	1. 确保已经下载过KBEngine服务端引擎，如果没有下载请先下载
		下载服务端源码(KBEngine)：
			https://github.com/kbengine/kbengine/releases/latest

		编译(KBEngine)：
			http://www.kbengine.org/docs/build.html

		安装(KBEngine)：
			http://www.kbengine.org/docs/installation.html

	2. 下载kbengine客户端js插件与服务端Demo资产库:

	    * 使用git命令行，进入到kbengine_cocos2d_js_demo目录执行：

	        git submodule update --init --remote
![submodule_update1](http://www.kbengine.org/assets/img/screenshots/gitbash_submodule.png)

		* 或者使用 TortoiseGit(选择菜单): TortoiseGit -> Submodule Update:
![submodule_update2](http://www.kbengine.org/assets/img/screenshots/unity3d_plugins_submodule_update.jpg)

                * 也可以手动下载kbengine客户端插件与服务端Demo资产库

		        客户端插件下载：
		            https://github.com/kbengine/kbengine_js_plugins/releases/latest
		            下载后请将其解压缩，插件源码请放置在: kbengine_cocos2d_js_demo/cocos2d-js-client/plugins/

		        服务端资产库下载：
		            https://github.com/kbengine/kbengine_demos_assets/releases/latest
		            下载后请将其解压缩,并将目录文件放置于服务端引擎根目录"kbengine/"之下，如下图：

	3. 拷贝服务端资产库"kbengine_demos_assets"到服务端引擎根目录"kbengine/"之下，如下图：
![demo_configure](http://www.kbengine.org/assets/img/screenshots/demo_copy_kbengine.jpg)


##配置Demo(可选):

	改变登录IP地址与端口（注意：关于服务端端口部分参看http://www.kbengine.org/cn/docs/installation.html）:

		kbengine_cocos2d_js_demo\cocos2d-js-client\main.js
			args.ip = "127.0.0.1";
			args.port = 20013;


##启动服务器:

	确保“kbengine_cocos2d_js_demo\kbengine_demos_assets”已经拷贝到KBEngine根目录：
		参考上方章节：开始

	使用启动脚本启动服务端：
		Windows:
			kbengine\kbengine_demos_assets\start_server.bat

		Linux:
			kbengine\kbengine_demos_assets\start_server.sh

	检查启动状态：
			如果启动成功将会在日志中找到"Components::process(): Found all the components!"。
			任何其他情况请在日志中搜索"ERROR"关键字，根据错误描述尝试解决。
			(更多参考: http://www.kbengine.org/docs/startup_shutdown.html)


##启动客户端:

	1. 使用Python搭建简单的Web服务器
		下载http://www.python.org/ftp/python/3.3.4/python-3.3.4.msi并安装。

	2. 启动Web服务, 双击start_http_service.bat

	3. 进入游戏, 打开浏览器输入 http://127.0.0.1 即可进入登录界面。



##演示截图:
![screenshots1](http://www.kbengine.org/assets/img/screenshots/unity3d_demo9.jpg)
![screenshots2](http://www.kbengine.org/assets/img/screenshots/unity3d_demo10.jpg)
![screenshots3](http://www.kbengine.org/assets/img/screenshots/unity3d_demo11.jpg)
