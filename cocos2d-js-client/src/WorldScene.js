
var WorldSceneLayer = cc.Layer.extend({
    sprite:null,
    player:null,
    tmxmap: null,
    entities: null,
    playerLastPos: null,
    ctor:function () {
        //////////////////////////////
        // super init first
        this._super();
		this.entities = {};
        return true;
    },

    onEnter: function () 
    {
        this._super();

    	// 初始化UI
    	this.initUI();

    	// 安装这个场景需要监听的KBE事件
        this.installEvents();

		// 监听鼠标触摸等输入输出事件
		this.installInputEvents(this);
		
        // 激活update
        //this.schedule(this.worldUpdate, 0.1, cc.REPEAT_FOREVER, 0.1);
        this.scheduleUpdate();
    },
    	    
    onExit: function () {
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
    },

    /* -----------------------------------------------------------------------/
    							输入输出事件 相关
    /------------------------------------------------------------------------ */
	installInputEvents : function(target)
	{
        if( 'mouse' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                 event: cc.EventListener.MOUSE,
                onMouseDown: this.onMouseDown,
                onMouseMove: this.onMouseMove,
                onMouseUp: this.onMouseUp
            }, target);
        } else {
	        if( 'touches' in cc.sys.capabilities )
	            cc.eventManager.addListener(cc.EventListener.create({
	                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
	                onTouchesEnded:this.onTouchesEnded
	            }), this);
            else        	
          	  cc.log("MOUSE and TOUCH Not supported");
        }		
	},
		
    onMouseDown: function(event)
    {
        var pos = event.getLocation(), target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(pos);
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
		
		// 检查是否在区域内
        if (cc.rectContainsPoint(rect, locationInNode))
		{
	        if(event.getButton() === cc.EventMouse.BUTTON_RIGHT)
	            cc.log("onRightMouseDown at: " + pos.x + " " + pos.y);
	        else if(event.getButton() === cc.EventMouse.BUTTON_LEFT)
	            cc.log("onLeftMouseDown at: " + pos.x + " " + pos.y);
		}
    },
    	
    onMouseMove: function(event)
    {
        //var pos = event.getLocation(), target = event.getCurrentTarget();
        //cc.log("onMouseMove at: " + pos.x + " " + pos.y );
    },
    	
    onMouseUp: function(event)
    {
        var pos = event.getLocation(), target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(pos);
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
		
		// 检查是否在区域内
        if (cc.rectContainsPoint(rect, locationInNode))
		{
			target.onClickUp(pos);
		}
    },

	onTouchesEnded : function (touches, event) 
	{
        if (touches.length <= 0)
            return;
        
        var pos = touches[0].getLocation(), target = event.getCurrentTarget();
        
        var locationInNode = target.convertToNodeSpace(pos);
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
		
		// 检查是否在区域内
        if (cc.rectContainsPoint(rect, locationInNode))
		{
			target.onClickUp(pos);
		}
	},
	
	onClickUp : function(pos)
	{
		cc.log("onClickUp at: " + pos.x + " " + pos.y );
        this.player.moveTo(this.convertToNodeSpace(pos));
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
		this.player = new Avatar(this, "res/img/3/clotharmor.png");
        this.player.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.player, 10);
        
        this.entities[avatar.id] = this.player;
        this.playerLastPos = cc.p(this.player.x, this.player.y);
	},

	onEnterWorld : function(entity)
	{
		if(entity.isPlayer())
			return;

		var size = cc.winSize;
		var ae = new ActionEntity(this, "res/img/3/crab.png");
        ae.attr({
            x: size.width / 2 + (400 * Math.random()) - 200,
            y: size.height / 2 + (400 * Math.random()) - 200
        });

        this.addChild(ae, 10);
        this.entities[entity.id] = ae;

		// 实体第一次进入到这个世界时这些属性不属于值改变行为，造成事件不会触发
		// 这里我们强制进行一次相关表现上的设置
		this.set_moveSpeed(entity, entity.speed);
		this.set_state(entity, entity.state);
		this.set_modelScale(entity, entity.modelScale);
		this.set_entityName(entity, entity.name);
		this.set_HP(entity, entity.HP);	
	},

	onLeaveWorld : function(entity)
	{
		this.removeChild(this.entities[avatar.id]);
		delete this.entities[avatar.id];
	},

	set_position : function(entity)
	{
	},

	update_position : function(entity)
	{
	},	

	set_direction : function(entity)
	{
	},

	set_HP : function(entity, v)
	{
	},

	set_MP : function(entity, v)
	{
	},

	set_HP_Max : function(entity, v)
	{
	},	
		
	set_MP_Max : function(entity, v)
	{
	},

	set_level : function(entity, v)
	{
	},

	set_entityName : function(entity, v)
	{
	},	

	set_state : function(entity, v)
	{
	},

	set_moveSpeed : function(entity, v)
	{
	},

	set_modelScale : function(entity, v)
	{
	},

	set_modelID : function(entity, v)
	{
	},

	recvDamage : function(entity, attacker, skillID, damageType, damage)
	{
	},

	onAddSkill : function(entity)
	{
	},

	otherAvatarOnJump : function(entity)
	{
	},
															
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
	createScene : function(resPath)
    {
        this.tmxmap = cc.TMXTiledMap.create(resPath);
        this.addChild(this.tmxmap, 1, NODE_TAG_TMX);
        
        var size = cc.winSize;
		this.tmxmap.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });	
    },

    worldUpdate : function (dt) 
    {
    },
    
    update : function (dt) 
    {
    	if(this.tmxmap == null || this.playerLastPos == null)
    		return;
    	
    	var x = this.playerLastPos.x - this.player.x;
    	var y = this.playerLastPos.y - this.player.y;
    	
    	this.playerLastPos.x = this.player.x;
    	this.playerLastPos.y = this.player.y;
    	
    	this.tmxmap.x += x;
    	this.tmxmap.y += y;
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

