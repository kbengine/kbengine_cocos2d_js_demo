var ActionAnimation = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    w: 0,
    h: 0,
    row: 0,
    length: 0,
    name : "",
    ctor:function (sprite, row, length, w, h, frameX, frameY, name) {
        //////////////////////////////
        // super init first
        this._super();

        this.sprite = sprite;
        this.row = row;
        this.length = length;
        this.w = w;
        this.h = h;
        this.frameX = frameX;
        this.frameY = frameY;
        this.name = name;
        return true;
    },	
    
    play : function()
    {
        this.sprite.setTextureRect(cc.rect(this.frameX * this.w, (this.frameY + this.row) * this.h, this.w, this.h));
        this.frameX += 1;
        if(this.frameX >= this.length)
            this.frameX = 0;
    },

    reset : function()
    {
        this.frameX = 0;
        this.frameY = 0;
    }
});

var ActionSprite = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    scene:null,
    animations: null,
    state: 0,
    direction: 0,
    position: 0,
    lastAnim: null,
    res: "",
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super();
        
        this.scene = scene;
        this.res = res;
		this.animations = {};
        return true;
    },	

    onEnter: function () 
    {
    	this._super();
    	
    	this.setSprite(this.res);
    	
        // 激活update
        this.schedule(this.spriteUpdate, 0.15, cc.REPEAT_FOREVER, 0.15);
    },

    onExit: function () 
    {
    	this._super();
    },
    	
    setSprite : function(res)
    {
        spriteRes = res.replace(/\\/g,'/');
        var s1 = spriteRes.lastIndexOf('/');
        var s2 = spriteRes.lastIndexOf('.');
        var name = spriteRes.substring(s1 + 1, s2);

        var jsonData = cc.loader.getRes("res/sprites/" + name + ".json");
            	
		this.sprite = new cc.Sprite(res, cc.rect(0, 0, jsonData.width * 3, jsonData.height * 3));
        this.addChild(this.sprite);

        // 初始化动画信息
        var animations = jsonData.animations;
        for(var aniName in animations)
        {
            var ani = animations[aniName];
            var actionAnimation = new ActionAnimation(this.sprite, ani.row, ani.length, jsonData.width * 3, jsonData.height * 3, 0, 0, aniName);
            this.animations[aniName] = actionAnimation;
        }
    },

    play : function(aniName)
    {
        if(this.lastAnim == null || this.lastAnim.name != aniName)
        {
            this.lastAnim = this.animations[aniName];
            this.lastAnim.reset();
        }

        this.lastAnim.play();
    },

    setState : function(state)
    {
        if(state == this.state)
            return;

        this.state = state;
    },

	moveTo : function(position)
	{
		this.stopAllActions();
		this.runAction(cc.moveTo(1, position));
	},
		
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    spriteUpdate : function(dt)
    {
        this.play("walk_right");
    }
});