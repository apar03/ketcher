import molfile from "../../../chem/molfile";
import { load } from "../shared";

export function rdkitJsTransform(method) {
	return (dispatch, getState) => {
		const state = getState();
		const struct = state.editor.struct().clone(null, null, false, new Map());
		const mol = Module.get_mol(molfile.stringify(struct, { ignoreErrors: true }));
		dispatch(load(doTransformation(method, mol)));
	};
}

function doTransformation(method, mol) {
	switch (method) {
		case 'aromatize':
			return mol.get_aromatic_form();
			break;
		case 'dearomatize':
			return mol.get_kekule_form();
			break;
		case 'clean':
			return mol.get_new_coords();
			break;
	}
}
