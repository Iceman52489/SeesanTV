import ATV from 'atvjs';
import template from './template.hbs';

import config from './config.yml';

let Page = ATV.Page.create({
	name: 'browse',
	template: template,
  data: config
});

export default Page;
