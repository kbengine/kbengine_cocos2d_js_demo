
var LoginSceneLayer = cc.Layer.extend({
    sprite:null,
    clientScriptVersion:null,
    serverVersion:null,
    serverScriptVersion:null,
    clientVersion:null,
    debug:null,
    usernamebox:null,
    passwordbox:null,
    ctor:function () 
    {
        //////////////////////////////
        // super init first
        this._super();
        
		// 激活 update
        this.schedule(this.update, 0.1, cc.repeatForever, 0.1);
    
    	// 初始化UI
    	this.initUI();
    	
    	// 安装这个场景需要监听的KBE事件
        this.installEvents();
        
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
        	        
        return true;
    },

    onExit: function () {
    },
    	
    installEvents : function()
    {
		// common
		KBEngine.Event.register("onKicked", this, "onKicked");
		KBEngine.Event.register("onDisableConnect", this, "onDisableConnect");
		KBEngine.Event.register("onConnectStatus", this, "onConnectStatus");
	    	
		// login
		KBEngine.Event.register("onCreateAccountResult", this, "onCreateAccountResult");
		KBEngine.Event.register("onLoginFailed", this, "onLoginFailed");
		KBEngine.Event.register("onVersionNotMatch", this, "onVersionNotMatch");
		KBEngine.Event.register("onScriptVersionNotMatch", this, "onScriptVersionNotMatch");
		KBEngine.Event.register("onLoginGatewayFailed", this, "onLoginGatewayFailed");
		KBEngine.Event.register("onLoginSuccessfully", this, "onLoginSuccessfully");
		KBEngine.Event.register("login_baseapp", this, "login_baseapp");
		KBEngine.Event.register("Loginapp_importClientMessages", this, "Loginapp_importClientMessages");
		KBEngine.Event.register("Baseapp_importClientMessages", this, "Baseapp_importClientMessages");
		KBEngine.Event.register("Baseapp_importClientEntityDef", this, "Baseapp_importClientEntityDef");
		
		KBEngine.Event.register("onImportClientMessages", this, "onImportClientMessages");
		KBEngine.Event.register("onImportClientEntityDef", this, "onImportClientEntityDef");
		KBEngine.Event.register("onImportServerErrorsDescr", this, "onImportServerErrorsDescr");
		
		// selavatars
		//KBEngine.Event.register("onReqAvatarList", this, "onReqAvatarList");
		//KBEngine.Event.register("onCreateAvatarResult", this, "onCreateAvatarResult");
		//KBEngine.Event.register("onRemoveAvatar", this, "onRemoveAvatar");
    },

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
        this.usernamebox.setPlaceHolder("Input Username");
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
        this.passwordbox.setPlaceHolder("Input Password");
        this.passwordbox.setPlaceholderFontColor(cc.color(128, 128, 128));
        this.passwordbox.setPlaceholderFontSize(20);
        this.passwordbox.setDelegate(this);
        this.passwordbox.setFontColor(cc.color(0, 0, 0));
        this.passwordbox.setFontSize(20);
        this.passwordbox.setMaxLength(15);
        this.passwordbox.setFontName("graphicpixel-webfont");
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
        this.logintButton.addTouchEventListener(this.touchLogintButtonEvent ,this);
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

    touchLogintButtonEvent: function (sender, type) 
    {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            	if(this.usernamebox.getString().length < 3)
            	{
            		GUIDebugLayer.debug.ERROR_MSG("username is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
 
             	if(this.passwordbox.getString().length < 3)
            	{
            		GUIDebugLayer.debug.ERROR_MSG("password is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
            	
                GUIDebugLayer.debug.INFO_MSG("connect to server...");
                KBEngine.Event.fire("login", this.usernamebox.getString(), this.passwordbox.getString());
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
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
                GUIDebugLayer.debug.ERROR_MSG("connect to server...");
            	KBEngine.Event.fire("createAccount", this.usernamebox.getString(), this.passwordbox.getString());
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },
    	
	onKicked : function(failedcode)
	{
	},
		
	onDisableConnect : function()
	{
	},
		
	onConnectStatus : function(success)
	{
		if(!success)
			GUIDebugLayer.debug.ERROR_MSG("connect(" + KBEngine.app.ip + ":" + KBEngine.app.port + ") is error! (连接错误)");
		else
			GUIDebugLayer.debug.INFO_MSG("connect successfully, please wait...(连接成功，请等候...)");
	},

    onCreateAccountResult : function(retcode, datas)
    {
		if(retcode != 0)
		{
			GUIDebugLayer.debug.ERROR_MSG("createAccount is error(注册账号错误)! err=" + retcode);
			return;
		}
		
		if(KBEngineApp.validEmail(stringAccount))
		{
			GUIDebugLayer.debug.INFO_MSG("createAccount is successfully, Please activate your Email!(注册账号成功，请激活Email!)");
		}
		else
		{
			GUIDebugLayer.debug.INFO_MSG("createAccount is successfully!(注册账号成功!)");
		}    	
    },
    	    
    onLoginFailed : function(failedcode)
    {
		if(failedcode == 20)
		{
			GUIDebugLayer.debug.ERROR_MSG("login is failed(登陆失败), err=" + failedcode + ", " + KBEngine.app.serverdatas);
		}
		else
		{
			GUIDebugLayer.debug.ERROR_MSG("login is failed(登陆失败), err=" + failedcode);
		}    	
    },

    onVersionNotMatch : function(clientVersion, serverVersion)
    {
    	GUIDebugLayer.debug.ERROR_MSG("version not match(curr=" + clientVersion + ", srv=" + serverVersion + " )(版本不匹配)");	
    },

    onScriptVersionNotMatch : function(clientScriptVersion, serverScriptVersion)
    {
    	GUIDebugLayer.debug.ERROR_MSG("scriptVersion not match(curr=" + clientScriptVersion + ", srv=" + serverScriptVersion + " )(脚本版本不匹配)");
    },

    onLoginGatewayFailed : function(failedcode)
    {
    	GUIDebugLayer.debug.ERROR_MSG("loginGateway is failed(登陆网关失败), err=" + failedcode);	
    	this.removeChild(this.connectStateLayer);
    },
    	
    onLoginSuccessfully : function(rndUUID, eid, accountEntity)
    {
    	GUIDebugLayer.debug.INFO_MSG("login is successfully!(登陆成功!)");
    	
    	// 切换到选人场景
	    cc.director.runScene(new WorldScene());
    },

    login_baseapp : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("connect to loginGateway, please wait...(连接到网关， 请稍后...)");
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

    onImportClientMessages : function(currserver, stream)
    {
    	GUIDebugLayer.debug.INFO_MSG("importClientMessages successfully!");
    },

    onImportClientEntityDef : function(stream)
    {
    	GUIDebugLayer.debug.INFO_MSG("importClientEntityDef successfully!");
    },
    	
    onImportServerErrorsDescr : function(stream)
    {
    	GUIDebugLayer.debug.INFO_MSG("importServerErrorsDescr successfully!");
    },
    	 	
    update : function (dt) {
        this.serverScriptVersion.setString("serverScriptVersion: " + KBEngine.app.serverScriptVersion);
        this.serverVersion.setString("serverVersion: " + KBEngine.app.serverVersion);
    }
});

var LoginScene = cc.Scene.extend({
    onEnter:function () 
    {
        this._super();
        
        // 创建基本场景层
        var layer = new LoginSceneLayer();
        this.addChild(layer);
    }
});

