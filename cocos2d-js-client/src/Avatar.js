/*
	玩家实体类，继承于ActionEntity
	与ActionEntity主要的区别是实体由客户端控制
*/
var Avatar = ActionEntity.extend(
{
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super(scene, res);
        return true;
    }
});