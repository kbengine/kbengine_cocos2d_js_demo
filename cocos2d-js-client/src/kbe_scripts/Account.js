/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/
KBEngine.Account = KBEngine.GameObject.extend(
{
	__init__ : function()
	{
		this._super();
		KBEngine.Event.fire("onLoginSuccessfully", KBEngine.app.entity_uuid, this.id, this);
		
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
		
		console.info("KBEAccount::onCreateAvatarResult: avatarsize=" + this.avatars.values.length + ", error=" + KBEngine.app.serverErr(retcode));
		KBEngine.Event.fire("onCreateAvatarResult", retcode, info, this.avatars);
	},
		
	onReqAvatarList : function(infos)
	{
		this.avatars = infos;
		console.info("KBEAccount::onReqAvatarList: avatarsize=" + this.avatars.values.length);
		for(var i=0; i< this.avatars.values.length; i++)
		{
			console.info("KBEAccount::onReqAvatarList: name" + i + "=" + this.avatars.values[i].name);
		}
		
		KBEngine.Event.fire("onReqAvatarList", this.avatars);
	},
	
	onRemoveAvatar  : function(dbid)
	{
		if(this.avatars["values"].length <= 0)
			return;
		
		var done = false;
		var values = [];
		for(var i=0; i< this.avatars.values.length; i++)
		{
			if(this.avatars.values[i].dbid != dbid)
				values.push(this.avatars.values[i]);
			else
				done = true;
		}
		
		if(done)
		{
			this.avatars.values = values;
			console.info("Account::onRemoveAvatar: dbid=" + dbid);
			KBEngine.Event.fire("onRemoveAvatar", dbid, this.avatars);
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





