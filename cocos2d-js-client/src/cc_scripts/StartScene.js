
var StartSceneLayer = cc.Layer.extend({
    sprite:null,
    clientScriptVersion:null,
    serverVersion:null,
    serverScriptVersion:null,
    clientVersion:null,
    debug:null,
    usernamebox:null,
    passwordbox:null,
    logintButton:null,
    registerButton:null,
    playButton:null,
    playerNameBox:null,
    playerNameLabel:null,
    reloginCount:0,
    ctor:function () 
    {
        //////////////////////////////
        // super init first
        this._super();
        return true;
    },

    onEnter: function () 
    {
    	this._super();
    	
	  // 激活 update
        this.schedule(this.sceneUpdate, 0.1, cc.REPEAT_FOREVER, 0.1);
    
    	// 初始化UI
    	this.initUI();
    	
    	// 安装这个场景需要监听的KBE事件
        this.installEvents();
        	     
        // 创建场景
        this.createScene();  	
    },
    	    
    onExit: function () 
    {
    	this._super();
    },
    	
    /* -----------------------------------------------------------------------/
    							UI 相关
    /------------------------------------------------------------------------ */
	initUI : function()
    {
        // ask the window size
        var size = cc.winSize;

        // debug
        new GUIDebugLayer();
        this.addChild(GUIDebugLayer.debug, 100);

        // serverVersion
        this.serverVersion = new ccui.Text();
        this.serverVersion.attr({
            string: "serverVersion: ",
            fontName: "Arial",
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 50
        });
        this.serverVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.serverVersion, 20);

        this.serverScriptVersion = new ccui.Text();
        this.serverScriptVersion.attr({
            string: "serverScriptVersion: ",
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "Arial",
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 70
        });
        this.serverScriptVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.serverScriptVersion, 2);

        this.clientVersion = new ccui.Text();
        this.clientVersion.attr({
            string: "clientVersion: " + KBEngine.app.clientVersion,
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "Arial",
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 95
        });
        this.clientVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.clientVersion, 2);

        this.clientScriptVersion = new ccui.Text();
        this.clientScriptVersion.attr({
            string: "clientScriptVersion: " + KBEngine.app.clientScriptVersion,
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "Arial",
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 115
        });
        this.clientScriptVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.clientScriptVersion, 2);

        this.introduction = new ccui.Text();
        this.introduction.attr({
            string: "A Massively Multiplayer Adventure",
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "graphicpixel-webfont",
            fontSize: 20,
            anchorX: 0,
            anchorY: -1,
            x: size.width / 2 - 140,
            y: size.height - 350
        });
        this.introduction.setColor(new cc.Color(0, 0, 0, 255));
        this.addChild(this.introduction, 2);
        
		this.logo = new cc.Sprite("res/ui/logo.png");
		this.logo.attr({
            x: size.width / 2 - 30,
            y: size.height - 100			
		});
        this.addChild(this.logo, 2);    
        
        
        // 设置账号名编辑框
        // Create the textfield
        this.usernamebox = new cc.EditBox(cc.size(288, 34), new cc.Scale9Sprite("res/ui/login_input.png"));
        this.usernamebox.setString("");
        this.usernamebox.x = this.width / 2;
        this.usernamebox.y = this.height / 2 - 50;
        //this.usernamebox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this.usernamebox.setPlaceHolder("Input username");
        this.usernamebox.setPlaceholderFontColor(cc.color(128, 128, 128));
        this.usernamebox.setPlaceholderFontSize(20);
        this.usernamebox.setDelegate(this);
        this.usernamebox.setFontColor(cc.color(0, 0, 0));
        this.usernamebox.setFontSize(20);
        this.usernamebox.setFontName("graphicpixel-webfont");
        this.usernamebox.setPlaceholderFontName("graphicpixel-webfont");
        this.usernamebox.setMaxLength(15);
        this.addChild(this.usernamebox, 2);    
        
        // 设置密码编辑框
        // Create the textfield
        this.passwordbox = new cc.EditBox(cc.size(288, 34), new cc.Scale9Sprite("res/ui/login_input.png"));
        this.passwordbox.setString("");
        this.passwordbox.x = this.width / 2;
        this.passwordbox.y = this.height / 2 - 100;
        this.passwordbox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this.passwordbox.setPlaceHolder("Input password");
        this.passwordbox.setPlaceholderFontColor(cc.color(128, 128, 128));
        this.passwordbox.setPlaceholderFontSize(20);
        this.passwordbox.setDelegate(this);
        this.passwordbox.setFontColor(cc.color(0, 0, 0));
        this.passwordbox.setFontSize(20);
        this.passwordbox.setMaxLength(15);
        //this.passwordbox.setFontName("graphicpixel-webfont");
        this.passwordbox.setPlaceholderFontName("graphicpixel-webfont");
        this.addChild(this.passwordbox, 2);      
        
        // 登录按钮
        this.logintButton = new ccui.Button();
        this.logintButton.setTouchEnabled(true);
        this.logintButton.loadTextures("res/ui/btn_up.png", "res/ui/btn_down.png", "");
        this.logintButton.setTitleText("Login");
        this.logintButton.setTitleFontName("graphicpixel-webfont");
        this.logintButton.x = size.width / 2.0 - 100;
        this.logintButton.y = size.height / 2.0 - 150;
        this.logintButton.addTouchEventListener(this.touchLoginButtonEvent ,this);
        this.addChild(this.logintButton, 2);

        // 注册按钮
        this.registerButton = new ccui.Button();
        this.registerButton.setTitleFontName("graphicpixel-webfont");
        this.registerButton.setTouchEnabled(true);
        this.registerButton.loadTextures("res/ui/btn_up.png", "res/ui/btn_down.png", "");
        this.registerButton.setTitleText("Register");
        this.registerButton.x = size.width / 2.0 + 100;
        this.registerButton.y = size.height / 2.0 - 150;
        this.registerButton.addTouchEventListener(this.touchRegisterButtonEvent ,this);
        this.addChild(this.registerButton, 2);

        // 进入游戏按钮
        this.playButton = new ccui.Button();
        this.playButton.setTitleFontName("graphicpixel-webfont");
        this.playButton.setTouchEnabled(true);
        this.playButton.loadTextures("res/ui/btn_up.png", "res/ui/btn_down.png", "");
        this.playButton.setTitleText("Play");
        this.playButton.x = size.width / 2.0;
        this.playButton.y = size.height / 2.0 - 150;
        this.playButton.addTouchEventListener(this.touchPlayButtonEvent ,this);
        this.playButton.visible = false;
        this.addChild(this.playButton, 2);
        
	if(window.localStorage)
	{
		var username = window.localStorage["user_name"];
		var password = window.localStorage["user_passwd"];
		
		if(username != undefined)
			this.usernamebox.setString(username);
		
		if(password != undefined)
			this.passwordbox.setString(password);			
	}
    },

	showCreatePlayerUI : function(isShow)
	{
		if(isShow)
		{
			if(this.playerNameBox != null)
				return;
			
	        // 角色取名框
	        // Create the textfield
	        this.playerNameBox = new cc.EditBox(cc.size(288, 34), new cc.Scale9Sprite("res/ui/login_input.png"));
	        this.playerNameBox.setString("");
	        this.playerNameBox.x = this.width / 2;
	        this.playerNameBox.y = this.height / 2 - 50;
	        this.playerNameBox.setPlaceHolder("Name your character");
	        this.playerNameBox.setPlaceholderFontColor(cc.color(128, 128, 128));
	        this.playerNameBox.setPlaceholderFontSize(20);
	        this.playerNameBox.setDelegate(this);
	        this.playerNameBox.setFontColor(cc.color(0, 0, 0));
	        this.playerNameBox.setFontSize(20);
	        this.playerNameBox.setFontName("graphicpixel-webfont");
	        this.playerNameBox.setPlaceholderFontName("graphicpixel-webfont");
	        this.playerNameBox.setMaxLength(15);
	        this.addChild(this.playerNameBox, 2);      
		}
		else
		{
			if(this.playerNameBox != null)
				this.removeChild(this.playerNameBox);
			
			this.playerNameBox = null;
		}
	},

	showPlayerInfoUI : function(info)
	{
		if(info != null)
		{
			if(this.playerNameLabel != null)
				return;
			
			var size = cc.winSize;
	        this.playerNameLabel = new ccui.Text();
	        this.playerNameLabel.attr({
	            string: info.name + ", level=" + info.level,
	            boundingWidth: 200,
	            boundingHeight: 50,
	            textAlign:cc.TEXT_ALIGNMENT_LEFT,
	            fontName: "graphicpixel-webfont",
	            fontSize: 20,
	            x: size.width / 2,
	            y: size.height - 470
	        });
	        this.playerNameLabel.setColor(new cc.Color(0, 255, 255, 255));
	        this.addChild(this.playerNameLabel, 2);    
		}
		else
		{
			if(this.playerNameLabel != null)
				this.removeChild(this.playerNameLabel);
			
			this.playerNameLabel = null;
		}
	},
		
			
	editBoxEditingDidBegin: function (editBox) {
		/*
		if(this.usernamebox == editBox)
      	  this.username = editBox.getString();
      	else
      		this.password = editBox.getString();
      		*/
    },

    editBoxEditingDidEnd: function (editBox) {
    },

    editBoxTextChanged: function (editBox, text) {
    },

    editBoxReturn: function (editBox) {
    },

    touchLoginButtonEvent: function (sender, type) 
    {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
            	if(this.usernamebox.getString().length < 3)
            	{
            		GUIDebugLayer.debug.ERROR_MSG("Username is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
 
             	if(this.passwordbox.getString().length < 3)
            	{
            		GUIDebugLayer.debug.ERROR_MSG("Password is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
            	
                GUIDebugLayer.debug.INFO_MSG("Connect to server...");
                KBEngine.Event.fire("login", this.usernamebox.getString(), this.passwordbox.getString(), "kbengine_cocos2d_js_demo");    
                
				if(window.localStorage)
				{
					window.localStorage["user_name"] = this.usernamebox.getString();
					window.localStorage["user_passwd"] = this.passwordbox.getString();
				}
				
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    touchRegisterButtonEvent: function (sender, type) 
    {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                GUIDebugLayer.debug.INFO_MSG("Connect to server...");
            	KBEngine.Event.fire("createAccount", this.usernamebox.getString(), this.passwordbox.getString(), "kbengine_cocos2d_js_demo");            
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },
    	
    touchPlayButtonEvent: function (sender, type) 
    {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
            
				// 如果没有角色那么请求创建一个角色
				if(KBEngine.app.player().avatars.values.length <= 0)
				{
					if(this.playerNameBox.getString() < 3)
					{
						GUIDebugLayer.debug.ERROR_MSG("The name of the Avatar is wrong, length < 3!(角色名称错误，长度必须大于等于3!)");
						return;
					}
					
					GUIDebugLayer.debug.INFO_MSG("Create avatar(创建角色)...");
					KBEngine.app.player().reqCreateAvatar(1, this.playerNameBox.getString());
					return;
				}
		
				GUIDebugLayer.debug.INFO_MSG("Loading(加载中)...");
				
				// 选择这个角色进入游戏
				KBEngine.app.player().selectAvatarGame(KBEngine.app.player().avatars.values[0].dbid);
						
				// 切换到场景
				cc.director.runScene(new WorldScene());
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },
    
    /* -----------------------------------------------------------------------/
    							KBEngine 事件响应
    /------------------------------------------------------------------------ */
    installEvents : function()
    {
		// common
		KBEngine.Event.register("onKicked", this, "onKicked");
		KBEngine.Event.register("onDisconnected", this, "onDisconnected");
		KBEngine.Event.register("onConnectionState", this, "onConnectionState");
	    	
		// login
		KBEngine.Event.register("onCreateAccountResult", this, "onCreateAccountResult");
		KBEngine.Event.register("onLoginFailed", this, "onLoginFailed");
		KBEngine.Event.register("onVersionNotMatch", this, "onVersionNotMatch");
		KBEngine.Event.register("onScriptVersionNotMatch", this, "onScriptVersionNotMatch");
		KBEngine.Event.register("onLoginBaseappFailed", this, "onLoginBaseappFailed");
		KBEngine.Event.register("onLoginSuccessfully", this, "onLoginSuccessfully");
		KBEngine.Event.register("onReloginBaseappFailed", this, "onReloginBaseappFailed");
		KBEngine.Event.register("onReloginBaseappSuccessfully", this, "onReloginBaseappSuccessfully");
		KBEngine.Event.register("onLoginBaseapp", this, "onLoginBaseapp");
		KBEngine.Event.register("Loginapp_importClientMessages", this, "Loginapp_importClientMessages");
		KBEngine.Event.register("Baseapp_importClientMessages", this, "Baseapp_importClientMessages");
		KBEngine.Event.register("Baseapp_importClientEntityDef", this, "Baseapp_importClientEntityDef");
		
		// selavatars(register by scripts)
		KBEngine.Event.register("onReqAvatarList", this, "onReqAvatarList");
		KBEngine.Event.register("onCreateAvatarResult", this, "onCreateAvatarResult");
		KBEngine.Event.register("onRemoveAvatar", this, "onRemoveAvatar");
    },
    	    
	onKicked : function(failedcode)
	{
		GUIDebugLayer.debug.ERROR_MSG("kick, disconnect!, reason=" + KBEngine.app.serverErr(failedcode));
	},
		
	onDisconnected : function()
	{
		GUIDebugLayer.debug.ERROR_MSG("disconnect! will try to reconnect...");
		this.reloginCount = 0;
		
		this.scheduleOnce(function timerfn() {  
                this.onReloginBaseappTimer(this);
          	  }, 1);
	},
	
	onReloginBaseappTimer : function(self)
	{
		if(KBEngine.app.socket != undefined && KBEngine.app.socket != null)
		{
			return;
		}
		
		if(this.reloginCount >= 3)
		{
			// 切换起始到场景
			cc.director.runScene(new StartScene());
			return;
		}
	
		this.reloginCount += 1;
		
		GUIDebugLayer.debug.ERROR_MSG("will try to reconnect(" + this.reloginCount + ")...");
		KBEngine.app.reloginBaseapp();
		this.scheduleOnce(function timerfn() {  
                self.onReloginBaseappTimer(self);
          	  }, 1);
	},
	
    onReloginBaseappFailed : function(failedcode)
    {
    	GUIDebugLayer.debug.ERROR_MSG("reogin is failed(断线重连失败), err=" + KBEngine.app.serverErr(failedcode));	
    },
    	
    onReloginBaseappSuccessfully : function()
    {
	GUIDebugLayer.debug.INFO_MSG("reogin is successfully!(断线重连成功!)");	
    },
    	
	onConnectionState : function(success)
	{
		if(!success)
			GUIDebugLayer.debug.ERROR_MSG("Connect(" + KBEngine.app.ip + ":" + KBEngine.app.port + ") is error! (连接错误)");
		else
			GUIDebugLayer.debug.INFO_MSG("Connect successfully, please wait...(连接成功，请等候...)");
	},

	onReqAvatarList : function(avatars)
	{
		if(avatars.values.length <= 0)
		{
			this.showCreatePlayerUI(true);
			return;
		}
		
		this.showPlayerInfoUI(avatars.values[0]);
	},

	onCreateAvatarResult : function(retcode, info, avatars)
	{
		if(retcode == 0)
		{
			this.showCreatePlayerUI(false);
			
			GUIDebugLayer.debug.INFO_MSG("Loading(加载)...");
			
			// 选择这个角色进入游戏
			KBEngine.app.player().selectAvatarGame(info.dbid);
			
			// 切换到场景
			cc.director.runScene(new WorldScene());	
			return;			
		}
		else
		{
			GUIDebugLayer.debug.ERROR_MSG("Create Avatar is error(" + retcode + ")! (创建角色错误)");
		}
	},
		
	onRemoveAvatar : function(dbid, avatars)
	{
		this.showCreatePlayerUI(true);
	},
				
    onCreateAccountResult : function(retcode, datas)
    {
		if(retcode != 0)
		{
			GUIDebugLayer.debug.ERROR_MSG("CreateAccount is error(注册账号错误)! err=" + retcode);
			return;
		}
		
		//if(KBEngineApp.validEmail(stringAccount))
		//{
		//	GUIDebugLayer.debug.INFO_MSG("createAccount is successfully, Please activate your Email!(注册账号成功，请激活Email!)");
		//}
		//else
		{
			GUIDebugLayer.debug.INFO_MSG("CreateAccount is successfully!(注册账号成功!)");
		}    	
    },
    	    
    onLoginFailed : function(failedcode, serverdatas)
    {
		if(failedcode == 20)
		{
			GUIDebugLayer.debug.ERROR_MSG("Login is failed(登陆失败), err=" + KBEngine.app.serverErr(failedcode) + ", " + serverdatas);
		}
		else
		{
			GUIDebugLayer.debug.ERROR_MSG("Login is failed(登陆失败), err=" + KBEngine.app.serverErr(failedcode));
		}    	
    },

    onVersionNotMatch : function(clientVersion, serverVersion)
    {
        GUIDebugLayer.debug.ERROR_MSG("Version not match(curr=" + clientVersion + ", srv=" + serverVersion + " )(版本不匹配)");	
        KBEngine.ERROR_MSG("Execute the gensdk script to generate matching client SDK in the server-assets directory.");
        this.serverScriptVersion.setString("serverScriptVersion: " + KBEngine.app.serverScriptVersion);
        this.serverVersion.setString("serverVersion: " + KBEngine.app.serverVersion);	    	
    },

    onScriptVersionNotMatch : function(clientScriptVersion, serverScriptVersion)
    {
    	GUIDebugLayer.debug.ERROR_MSG("ScriptVersion not match(curr=" + clientScriptVersion + ", srv=" + serverScriptVersion + " )(脚本版本不匹配)");
        this.serverScriptVersion.setString("serverScriptVersion: " + KBEngine.app.serverScriptVersion);
        this.serverVersion.setString("serverVersion: " + KBEngine.app.serverVersion);	    	
    },

    onLoginBaseappFailed : function(failedcode)
    {
    	GUIDebugLayer.debug.ERROR_MSG("LoginBaseapp is failed(登陆网关失败), err=" + KBEngine.app.serverErr(failedcode));	
    },
    	
    onLoginSuccessfully : function(rndUUID, eid, accountEntity)
    {
	GUIDebugLayer.debug.INFO_MSG("Login is successfully!(登陆成功!)");

	this.usernamebox.visible = false;
	this.passwordbox.visible = false;
	this.logintButton.visible = false;
	this.registerButton.visible = false;
	this.playButton.visible = true;

	this.serverScriptVersion.setString("serverScriptVersion: " + KBEngine.app.serverScriptVersion);
	this.serverVersion.setString("serverVersion: " + KBEngine.app.serverVersion);		
    },

    onLoginBaseapp : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Connect to loginBaseapp, please wait...(连接到网关， 请稍后...)");
    },

    Loginapp_importClientMessages : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Loginapp_importClientMessages ...");
    },

    Baseapp_importClientMessages : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Baseapp_importClientMessages ...");
    },
    	
    Baseapp_importClientEntityDef : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Baseapp_importClientEntityDef ...");
    },

    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
	createScene : function()
    {
        // 创建场景
        this.start_map = cc.TMXTiledMap.create("res/img/2/start.tmx"); 
        this.addChild(this.start_map, 1); 
        
        var size = cc.winSize;
		this.start_map.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });    	
    },

    sceneUpdate : function (dt) 
    {
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () 
    {
        this._super();
        
        // 创建基本场景层
        var layer = new StartSceneLayer();
        this.addChild(layer);
    }
});

