/* 
	一个抽象的实体类，可以用来描述NPC/MONSTER/传送门/可交互的服务端实体对象
*/	
var ActionEntity = ActionSprite.extend({
	isOnGound:true,
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super(scene, res);
        return true;
    },
    	
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    spriteUpdate : function(dt)
    {
        this._super(dt);
    }
});