import {rdkitJsTransform} from "../state/rdkitjs";
import {serverTransform} from "../state/server";

export default {
	arom: {
		title: 'Aromatize',
		action: {
			thunk: rdkitJsTransform('aromatize')
		},
	},
	dearom: {
		title: 'Dearomatize',
		action: {
			thunk: rdkitJsTransform('dearomatize')
		},
	},
	clean: {
		shortcut: 'Mod+Shift+l',
		title: 'Clean Up',
		action: {
			thunk: rdkitJsTransform('clean')
		},
	},
};
