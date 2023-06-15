class logger {

	constructor(options) {
		this.options = Object.assign({
			upload: true, // 是否上传日志到小程序实时日志 @see https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/,
			channel: 'app',
		}, options);
		this.logManager = uni.getRealtimeLogManager ? uni.getRealtimeLogManager() : null;
		this.logger = this.logManager && this.logManager.tag(this.options.channel);
	}

	format(args) {
		const val = [...args];
		const _val = [];
		for (const ele of val) {
			_val.push(ele);
			if (typeof ele === 'object') {
				_val.push(JSON.stringify(ele));
			}
		}
		return {
			args: _val
		};
	}

	debug() {
		const {
			args,
			config
		} = this.format(arguments);
		this.options.upload && this.logger && this.logger.debug.apply(this.logger, args)
		console.trace(...args);
	}

	info() {
		const {
			args,
			config
		} = this.format(arguments);
		this.options.upload && this.logger && this.logger.info.apply(this.logger, args);
		console.trace(...args);
	}

	/**
	 * 输出日志信息
	 */
	log() {
		const {
			args,
			config
		} = this.format(arguments);
		this.options.upload && this.logger && this.logger.info.apply(this.logger, args);
		console.trace(...args);
	}

	warn() {
		const {
			args,
			config
		} = this.format(arguments);
		this.options.upload && this.logger && this.logger.warn.apply(this.logger, args);
		console.warn(...args);
	}

	error() {
		const {
			args,
			config
		} = this.format(arguments);
		this.options.upload && this.logger && this.logger.error.apply(this.logger, args);
		console.error(...args);
	}

	setFilterMsg(msg) { // 从基础库2.7.3开始支持
		if (!this.logger || !this.logger.setFilterMsg) return
		if (typeof msg !== 'string') return
		this.logger.setFilterMsg(msg)
	}

	addFilterMsg(msg) { // 从基础库2.8.1开始支持
		if (!this.logger || !this.logger.addFilterMsg) return
		if (typeof msg !== 'string') return
		this.logger.addFilterMsg(msg)
	}

	/**
	 * 日志进行分类，因此建议开发者按逻辑来进行标签划分
	 */
	channel(channel = 'app') {
		if (channel === 'app') {
			return this;
		} else {
			return new logger({
				...this.options,
				'channel': channel
			})
		}
	}
}

logger.install = function (Vue, options) {
	Vue.prototype.$logger = new logger(options)
}
export default logger

export const face = new logger();