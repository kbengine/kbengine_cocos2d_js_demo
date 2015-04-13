var ActionEntity = ActionSprite.extend({
	destPosition:null,
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super(scene, res);
        
        this.destPosition = new KBEngine.Vector3(0.0, 0.0, 0.0);
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