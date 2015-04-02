var ActionAnimation = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    w: 0,
    h: 0,
    row: 0,
    length: 0,
    ctor:function (sprite, row, length, w, h, frameX, frameY) {
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
        return true;
    },	
    
    play:function(dt)
    {
        this.sprite.setTextureRect(cc.rect(this.frameX * this.w, (this.frameY + this.row) * this.h, this.w, this.h));
        this.frameX += 1;
        if(this.frameX >= this.length)
            this.frameX = 0;
    }
});

var ActionSprite = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    scene:null,
    animations: {},
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super();
        this.scene = scene;
        this.setSprite(res);

        // 激活update
        this.schedule(this.update, 0.1, cc.repeatForever, 0.1);
        return true;
    },	
    
    setSprite : function(res)
    {
		this.sprite = new cc.Sprite(res, cc.rect(0, 0, 0, 0));
        this.addChild(this.sprite);

        // 初始化动画信息
        this.createAnimations(res);
    },

    createAnimations : function(res)
    {
        res = res.replace(/\\/g,'/');
        var s1 = res.lastIndexOf('/');
        var s2 = res.lastIndexOf('.');
        var name = res.substring(s1 + 1, s2);

        var jsonData = cc.loader.getRes("res/sprites/" + name + ".json");
        var animations = jsonData.animations;
        for(var aniName in animations)
        {
            var ani = animations[aniName];
            var actionAnimation = new ActionAnimation(this.sprite, ani.row, ani.length, jsonData.width * 3, jsonData.height * 3, 0, 0);
            this.animations[aniName] = actionAnimation;
        }
    },

    update:function(dt)
    {
    	var ani = this.animations["atk_right"];
        ani.play(dt);
    }
});