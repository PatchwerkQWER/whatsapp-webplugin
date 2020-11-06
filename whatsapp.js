(function() {

	this.WhatsappPlugin = function() {

		this.container = null;
		this.bubble = null;
		this.body = null;
		this.loading = null;
		this.message = null;
		this.cross = null;
		this.time = null;

		this.opened = false;

		var defaults = {
			element: 'whatsapp-plugin',
			message: 'Hello World!<br>How are you?',
			phone: '',
			delay: 1500,
			bubble: {
				icon: '<svg viewBox="0 0 90 90"><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522   c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982   c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537   c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938   c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537   c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333   c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882   c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977   c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344   c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223   C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path></svg>',
				size: 25,
				background: '#FFFFFF',
				color: '#41AA4C',
				class: ''
			},
			header: {
				name: 'John Doe',
				picture: 'https://www.fakepersongenerator.com/Face/male/male20161083755790619.jpg'
			},
			button: {
				text: 'Start chat',
				backgrund: '',
				radius: 100,
				icon: true
			}
		};

		this.options = defaults;

		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extend(true, defaults, arguments[0]);
		}

		this.container = document.getElementById(this.options.element);
		this.container.className = this.container.className + ' whatsappplugin-container';

		this.bubble = document.createElement('div');
		this.bubble.className = 'whatsappplugin-bubble' + (this.options.bubble.class.length ? ' ' + this.options.bubble.class : '');
		this.bubble.innerHTML = this.options.bubble.icon;
		this.container.appendChild(this.bubble);

		var notification = document.createElement('div');
		notification.className = 'whatsappplugin-bubble-notification';
		this.bubble.appendChild(notification);

		var icon = document.querySelectorAll('.whatsappplugin-bubble svg')[0];
		this.bubble.style.background = this.options.bubble.background;
		icon.style.width = this.options.bubble.size;
		icon.style.fill = this.options.bubble.color;

		this.body = document.createElement('div');
		this.body.className = 'whatsappplugin-messenger whatsappplugin-messenger-closed';
		this.container.appendChild(this.body);

		var template_close = '<div class="whatsappplugin-close">&#x02a2f;</div>'
		var template_header = '<div class="whatsappplugin-header"><div class="whatsappplugin-avatar-container"><div class="whatsappplugin-avatar-inner"><div class="whatsappplugin-avatar"></div></div></div><div class="whatsappplugin-info"><div class="whatsappplugin-name"></div><div class="whatsappplugin-caption"></div></div></div>';
		var template_body = '<div class="whatsappplugin-body"><div class="whatsappplugin-body-inner"><div class="whatsappplugin-body-loading"><div class="whatsappplugin-body-dots"><div class="whatsappplugin-body-dot"></div><div class="whatsappplugin-body-dot"></div><div class="whatsappplugin-body-dot"></div></div></div><div class="whatsappplugin-message"><div class="whatsappplugin-message-author">' + this.options.header.name + '</div><div class="whatsappplugin-message-text">' + this.options.message + '</div><div class="whatsappplugin-message-time"></div></div></div></div>';
		var template_footer = '';
		if (this.options.button.icon)
			template_footer = '<a class="whatsappplugin-button" target="_blank" href="https://api.whatsapp.com/send?phone=' + this.options.phone + '">' + this.options.bubble.icon + '<span class="whatsappplugin-button-text">' + this.options.button.text + '</span></a>';
		else
			template_footer = '<a class="whatsappplugin-button" target="_blank" href="https://api.whatsapp.com/send?phone=' + this.options.phone + '"><span class="whatsappplugin-button-text">' + this.options.button.text + '</span></a>';
		this.body.innerHTML = template_close + template_header + template_body + template_footer;

		this.loading = document.querySelectorAll('.whatsappplugin-body-loading')[0];
		this.message = document.querySelectorAll('.whatsappplugin-message')[0];
		this.time = document.querySelectorAll('.whatsappplugin-message-time')[0];

		var temp;

		if (this.options.button.icon) {
			temp = document.querySelectorAll('.whatsappplugin-button svg')[0];
			temp.className = 'whatsappplugin-button-icon';
		}

		temp = document.querySelectorAll('.whatsappplugin-avatar')[0];
		temp.style.backgroundImage = 'url("' + this.options.header.picture + '")';

		temp = document.querySelectorAll('.whatsappplugin-name')[0];
		temp.innerHTML = this.options.header.name;

		if (this.options.header.caption) {
			temp = document.querySelectorAll('.whatsappplugin-caption')[0];
			temp.innerHTML = this.options.header.caption;
		}

		if (this.options.header.color) {
			temp = document.querySelectorAll('.whatsappplugin-info')[0];
			temp.style.color = this.options.header.color;
		}

		if (this.options.header.background) {
			temp = document.querySelectorAll('.whatsappplugin-header')[0];
			temp.style.background = this.options.header.background;
			document.head.insertAdjacentHTML('beforeend', '<style>.whatsappplugin-avatar-container::before{border-color:' + this.options.header.background + ' !important}</style>');
		}

		this.cross = document.querySelectorAll('.whatsappplugin-close')[0];

		this.cross.addEventListener('click', this.click.bind(this));
		this.bubble.addEventListener('click', this.click.bind(this));
	}

	WhatsappPlugin.prototype.click = function() {

		this.opened = !this.opened;

		this.body.className = this.body.className.replace(' whatsappplugin-messenger-closed', '').replace(' whatsappplugin-messenger-opened', '');

		if (this.opened) {
			this.body.className = this.body.className + ' whatsappplugin-messenger-opened';
			setTimeout(this.send.bind(this), this.options.delay);
		} else {
			this.body.className = this.body.className + ' whatsappplugin-messenger-closed';
			this.loading.style.opacity = 1;
			this.message.style.opacity = 0;
		}
	};

	WhatsappPlugin.prototype.send = function() {
		var date = new Date();
		var hours = date.getHours();
		var minutes =  date.getMinutes();
		this.time.innerHTML = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
		this.loading.style.opacity = 0;
		this.message.style.opacity = 1;
	};

	function extend() {
		var extended = {}, deep = false, i = 0;
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]')
						extended[prop] = extend(extended[prop], obj[prop]);
					else
						extended[prop] = obj[prop];
				}
			}
		};

		for (; i < arguments.length; i++)
			merge(arguments[i]);

		return extended;
	}

}());
