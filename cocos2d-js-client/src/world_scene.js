
var WorldSceneLayer = cc.Layer.extend({
    sprite:null,
    player:null,
    tmxmap: null,
    ctor:function () {
        //////////////////////////////
        // super init first
        this._super();

    	// 初始化UI
    	this.initUI();

    	// 安装这个场景需要监听的KBE事件
        this.installEvents();

        // 激活 update
        this.schedule(this.update, 0.1, cc.repeatForever, 0.1);
        return true;
    },

    /* -----------------------------------------------------------------------/
    							UI 相关
    /------------------------------------------------------------------------ */
	initUI : function()
    {
        // debug
        new GUIDebugLayer();
        this.addChild(GUIDebugLayer.debug, 1);    	
    },

    /* -----------------------------------------------------------------------/
    							KBEngine 事件响应
    /------------------------------------------------------------------------ */
    installEvents : function()
    {
		// common
		KBEngine.Event.register("onKicked", this, "onKicked");
		KBEngine.Event.register("onDisableConnect", this, "onDisableConnect");
		KBEngine.Event.register("onConnectStatus", this, "onConnectStatus");
		
		// in world
		KBEngine.Event.register("addSpaceGeometryMapping", this, "addSpaceGeometryMapping");
		KBEngine.Event.register("onAvatarEnterWorld", this, "onAvatarEnterWorld");
		KBEngine.Event.register("onEnterWorld", this, "onEnterWorld");
		KBEngine.Event.register("onLeaveWorld", this, "onLeaveWorld");
		KBEngine.Event.register("set_position", this, "set_position");
		KBEngine.Event.register("set_direction", this, "set_direction");
		KBEngine.Event.register("update_position", this, "update_position");
		KBEngine.Event.register("set_HP", this, "set_HP");
		KBEngine.Event.register("set_MP", this, "set_MP");
		KBEngine.Event.register("set_HP_Max", this, "set_HP_Max");
		KBEngine.Event.register("set_MP_Max", this, "set_MP_Max");
		KBEngine.Event.register("set_level", this, "set_level");
		KBEngine.Event.register("set_name", this, "set_entityName");
		KBEngine.Event.register("set_state", this, "set_state");
		KBEngine.Event.register("set_moveSpeed", this, "set_moveSpeed");
		KBEngine.Event.register("set_modelScale", this, "set_modelScale");
		KBEngine.Event.register("set_modelID", this, "set_modelID");
		KBEngine.Event.register("recvDamage", this, "recvDamage");
		KBEngine.Event.register("otherAvatarOnJump", this, "otherAvatarOnJump");
		KBEngine.Event.register("onAddSkill", this, "onAddSkill");
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
			GUIDebugLayer.debug.ERROR_MSG("connect(" + g_kbengine.ip + ":" + g_kbengine.port + ") is error! (连接错误)");
		else
			GUIDebugLayer.debug.INFO_MSG("connect successfully, please wait...(连接成功，请等候...)");
	},

	addSpaceGeometryMapping : function(resPath)
	{
		GUIDebugLayer.debug.INFO_MSG("scene = " + resPath);
		
        // 创建场景
        this.createScene("res/img/3/cocosjs_demo_map1.tmx");
	},
	
	onAvatarEnterWorld : function(rndUUID, eid, avatar)
	{
        var size = cc.winSize;

		// 角色进入世界，创建角色精灵
		this.player = new ActionSprite(this, "res/img/3/clotharmor.png");
        this.player.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.player, 10);
	},
		
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    onExit: function () {
    },
    	    
	createScene : function(resPath)
    {
        this.tmxmap = cc.TMXTiledMap.create(resPath);
        this.addChild(this.tmxmap, 1);
        
        var size = cc.winSize;
		this.tmxmap.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });	
    },

    update : function (dt) {
    }
});


var WorldScene = cc.Scene.extend({
    onEnter:function () 
    {
        this._super();
        
        // 创建基本场景层
        var layer = new WorldSceneLayer();
        this.addChild(layer);
    }
});

