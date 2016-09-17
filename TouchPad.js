(function(){
	var tpads = [];
	var TouchPad = function(_parent,_opts){
		var obj = {
			init:function(_parent,_opts){
				tpads.push(this);
				this.parent = _parent;

				//create touchpad pot.
				this.pot = _opts.pot || {};
				this.pot.type = "pot";
				this.pot.id = this.pot.id || "tpad_"+tpads.length;
				this.pot.width = this.pot.width || this.pot.radius || 75;
				this.pot.height = this.pot.height || this.pot.radius || 75;
				this.pot.dom = this.pot.dom ||  document.createElement("div");
				this.pot.dom.setAttribute("class","tc_pot");
				this.pot.dom.setAttribute("id",this.pot.id);

				//set pot dom styles
				this.pot.theme = this.setTheme(this.pot);
				this.pot.dom.style.transform = "translate(-50%, -50%)";
				this.pot.dom.style.width = this.pot.width + "px";
				this.pot.dom.style.height = this.pot.height + "px";
				this.pot.dom.style.position = "absolute";
				this.pot.center = {
					x:this.pot.width/2,
					y:this.pot.height/2
				};

				//create touchpad stick
				this.stick = _opts.stick || {};
				this.stick.type = "stick";
				this.stick.width = this.stick.width || this.stick.radius || this.pot.width * 0.8;
				this.stick.height = this.stick.height || this.stick.radius || this.pot.height * 0.8;
				this.stick.maxRadius = this.stick.maxRadius || this.pot.width/2;
				this.stick.dom = this.stick.dom || document.createElement("div");
				this.stick.dom.setAttribute("class","tc_stick");

				//set stick dom styles
				this.stick.theme = this.setTheme(this.stick);
				this.stick.dom.style.transform = "translate(-50%, -50%)";
				this.stick.dom.style.width = this.stick.width + "px";
				this.stick.dom.style.height = this.stick.height + "px";
				this.stick.dom.style.position = "absolute";
				this.resetStick();

				//Append the pot and stick
				this.pot.dom.appendChild(this.stick.dom);
				this.parent.appendChild(this.pot.dom);

				//create start events
				var T = this;
				this.stick.dom.addEventListener('touchstart',function(e){T.start(e)},false);
				this.stick.dom.addEventListener('touchmove',function(e){T.move(e)},false);
				this.stick.dom.addEventListener('touchend',function(e){T.end(e)},false);
			},
			start:function(e){
				e.preventDefault();
				var touch = e.touches[0];
				this.updateStick(touch.pageX - this.pot.dom.offsetLeft,touch.pageY - this.pot.dom.offsetTop);
			},
			move:function(e){
				e.preventDefault();
				var touch  = e.touches[0];
				this.updateStick(touch.pageX - this.pot.dom.offsetLeft,touch.pageY - this.pot.dom.offsetTop);
			},
			end:function(e){
				e.preventDefault();
				this.resetStick();
			},
			resetStick:function(){
				this.updateStick(0,0);
			},
			updateStick:function(x,y){
				var dist = Math.sqrt(x*x+y*y);
				var rads = Math.atan2(y,x);
				var radius = (dist<this.stick.maxRadius)?dist:this.stick.maxRadius;
				this.stick.x = Math.cos(rads) * radius;
				this.stick.y = Math.sin(rads) * radius;
				this.stick.dom.style.left = (this.pot.center.x + this.stick.x)  + "px";
				this.stick.dom.style.top = 	(this.pot.center.y + this.stick.y)  + "px";
			},
			getStickDistance:function(){
				return this.stick.x * this.stick.x + this.stick.y * this.stick.y;
			},
			getStickAngle:function(unit){
				var rads =  Math.atan2(this.stick.y,this.stick.x);
				switch(unit){
					case "rads":
						return rads;
					case "degs":
						return rads * (180/Math.PI);
				}
			},
			getPower:function(){
				return this.getStickDistance()/this.stick.maxRadius || 0;
			},
			setTheme:function(item){
				switch(item.theme){
					case "undefined":
					case false:
					case "none":
						return "none";
						break;
					case "simple":
						var theme = TouchPad.themes["simple"];
						break;
				}
				for (var property in theme[item.type].style) {
					if (theme[item.type].style.hasOwnProperty(property)) {
						item.dom.style[property] = theme[item.type].style[property];
					}
				}
				for (var property in theme[item.type].props) {
					if (theme[item.type].props.hasOwnProperty(property)) {
						item[property] = theme[item.type].props[property];
					}
				}

				return item.theme;
			},
			show:function(){
				this.pot.style.display = 'initial';
			},
			hide:function(){
				this.pot.style.display = 'none';
			}
		};
		obj.init(_parent,_opts);

		return obj;
	};

	TouchPad.getPads = function(){
		return tpads;
	};

	TouchPad.themes = {
		simple:{
			pot:{
				props:{
					width:100,
					height:100,
				},
				style:{
					borderRadius: "50%",
					border: "1px solid black",
					background:"rgb(127,127,127)",
					opacity:".7"
				}
			},
			stick:{
				props:{},
				style:{
					borderRadius: "50%",
					border: "1px solid black",
					background:"rgb(255,100,100)"
				}
			}
		}
	};

	TouchPad.loadTheme = function(path,callback){
		callback();
	};

	window.TouchPad = TouchPad;
})();