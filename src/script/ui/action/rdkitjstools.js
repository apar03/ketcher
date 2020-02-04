import { rdkitJsTransform, rdkitJsCIP } from '../state/rdkitjs';

export default {
	arom: {
		title: 'Aromatize',
		action: {
			thunk: rdkitJsTransform('aromatize')
		}
	},
	dearom: {
		title: 'Dearomatize',
		action: {
			thunk: rdkitJsTransform('dearomatize')
		}
	},
	clean: {
		shortcut: 'Mod+Shift+l',
		title: 'Clean Up',
		action: {
			thunk: rdkitJsTransform('clean')
		}
	},
	cip: {
		shortcut: 'Mod+p',
		title: 'Calculate CIP',
		action: {
			thunk: rdkitJsCIP()
		}
	}
};
