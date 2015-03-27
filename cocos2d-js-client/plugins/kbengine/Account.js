/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/
KBEngine.Account = KBEngine.GameObject.extend(
{
	__init__ : function()
	{
		this._super();
		KBEngine.Event.fire("onLoginSuccessfully", g_kbengine.entity_uuid, this.id, this);
		
		this.avatars = {};
		this.baseCall("reqAvatarList");
	},
		
  	onCreateAvatarResult : function(retcode, info)
	{
		if(retcode == 0)
		{
			this.avatars[info.dbid] = info;
			this.avatars.values.push(info);
			console.info("KBEAccount::onCreateAvatarResult: name=" + info.name);
		}
		
		console.info("KBEAccount::onCreateAvatarResult: avatarsize=" + this.avatars.values.length);
	},
		
	onReqAvatarList : function(infos)
	{
		this.avatars = infos;
		console.info("KBEAccount::onReqAvatarList: avatarsize=" + this.avatars.values.length);
		for(var i=0; i< this.avatars.values.length; i++)
		{
			console.info("KBEAccount::onReqAvatarList: name" + i + "=" + this.avatars.values[i].name);
		}
	},
		

	reqCreateAvatar : function(roleType, name)
	{
		this.baseCall("reqCreateAvatar", roleType, name);
	},

	selectAvatarGame : function(dbid)
	{
		this.baseCall("selectAvatarGame", dbid);
	}
});





