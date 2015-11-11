/* 
	一个抽象的实体精灵表现类，可以用来描述NPC/MONSTER/传送门/可交互的服务端实体对象
*/	
var EntitySprite = ActionSprite.extend({
	isOnGround: true,
	ui_name:null,
	uiHP: null,
	shadow: null,
	entityID: 0,
    ctor:function (scene, entityID, res) {
        //////////////////////////////
        // super init first
        this._super(scene, res);
        this.entityID = entityID;
        return true;
    },

    /* -----------------------------------------------------------------------/
    							UI 相关
    /------------------------------------------------------------------------ */
	createHPUI : function()
	{
		if(this.uiHP != null)
			return;
		
        this.uiHP = new ccui.Text();
        this.uiHP.attr({
            string: "0/0",
            fontName: "graphicpixel-webfont",
            fontSize: 20,
            anchorX: 0.5,
            anchorY: -1,
            y : 30
        });
        this.uiHP.setColor(new cc.Color(255, 0, 0, 255));
        this.addChild(this.uiHP, 1);
        
        this.uiHP.HP = 0;
        this.uiHP.HP_MAX = 0;  
        this.uiHP.scaleX = this.scaleX;
	},

    setSprite : function(res)
    {
    	this._super(res);
    	
    	this.removeShadow();
        if(this.state != 1)
			this.addShadow();   
    },
    
    addShadow : function()
    {
    	if(this.shadow != null)
    		return;
    	    	
    	// 脚下添加一个影子
		this.shadow = new cc.Sprite("res/img/3/shadow16.png");
        this.shadow.attr({
            anchorX: 0.5,
            y : -12
        });
        
        // 针对不同怪将阴影便宜设置不同
        if(this.res.indexOf("bat.png") != -1)
        	this.shadow.y = -40;
        else if(this.res.indexOf("rat.png") != -1)
        	this.shadow.y = 0;
        
		this.addChild(this.shadow);    	
    },
    
    removeShadow : function()
    {
    	if(this.shadow == null)
    		return;
    	
    	this.removeChild(this.shadow);   
    	this.shadow = null; 
    },
    	
    /* -----------------------------------------------------------------------/
    							服务器消息数据表现
    /------------------------------------------------------------------------ */
	setName : function(name)
	{
		if(this.ui_name == null)
		{
	        this.ui_name = new ccui.Text();
	        this.ui_name.attr({
	            string: name,
	            fontName: "graphicpixel-webfont",
	            fontSize: 20,
	            anchorX: 0.5,
	            anchorY: -1
	        });
	        this.ui_name.setColor(new cc.Color(255, 255, 0, 255));
	        this.addChild(this.ui_name, 1);
	        this.ui_name.scaleX = this.scaleX;
	    }

		this.ui_name.setString(name);
	},
	
	set_HP : function(v)
	{
		this.createHPUI();
		this.uiHP.HP = v;
		this.uiHP.setString("" + this.uiHP.HP + "/" + this.uiHP.HP_MAX);
	},

	set_HP_Max : function(v)
	{
		this.createHPUI();
		this.uiHP.HP_MAX = v;
		this.uiHP.setString("" + this.uiHP.HP + "/" + this.uiHP.HP_MAX);
	},

    setState : function(state)
    {
        this._super(state);

	    if(state == 1) {
            this.removeShadow();   
        }
		else
        {
            this.addShadow();   
        }
    },
    
    attack : function(entity, skillID, damageType, damage)
    {
    	if(entity != undefined)
    	{
	        var x = entity.x - this.x;
	        var y = entity.y - this.y;
			this.setDirection(this.calcDirection(x, y));
		}
		
		this.updateAnim("atk_");    	
    },
    	
	recvDamage : function(entity, attacker, skillID, damageType, damage)
	{
		// 实体接受伤害，可以在此做受击表现
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
	},
		
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    updateAnim : function()
    {
		if(arguments.length == 1)
		{
			this._super(arguments[0]);
		}
		else    	
    		this._super();
    	
    	if(this.ui_name != null)
        	this.ui_name.scaleX = this.scaleX;
        
        if(this.uiHP != null)
       	 this.uiHP.scaleX = this.scaleX;    	
    },
    	    
    spriteUpdate : function(dt)
    {
        this._super(dt);
    }
});
