/* 
	一个抽象的实体类，可以用来描述NPC/MONSTER/传送门/可交互的服务端实体对象
*/	
var ActionEntity = ActionSprite.extend({
	destPosition:null,
	isOnGound:true,
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super(scene, res);
        
        this.destPosition = cc.p(0.0, 0.0);
        return true;
    },
    	
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    motionUpdate : function(dt)
    {
    },
    	
    spriteUpdate : function(dt)
    {
        this._super(dt);
        this.motionUpdate();
    }
});