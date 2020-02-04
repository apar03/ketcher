import molfile from '../../../chem/molfile';
import { load } from '../shared';
import Action from '../../../editor/shared/action';
import { fromSgroupAddition, fromSgroupDeletion } from '../../../editor/actions/sgroup';
import Vec2 from '../../../util/vec2';

export function rdkitJsTransform(method) {
	return (dispatch, getState) => {
		const state = getState();
		const struct = state.editor.struct().clone(null, null, false, new Map());
		const mol = Module.get_mol(molfile.stringify(struct, // eslint-disable-line no-undef
			{ ignoreErrors: true }));
		dispatch(load(doTransformation(method, mol), {
			rescale: method === 'layout',
			reactionRelayout: method === 'clean'
		}));
	};
}


export function rdkitJsCIP() {
	return (dispatch, getState) => {
		const state = getState();
		const struct = state.editor.struct().clone(null, null, false, new Map());
		const mol = Module.get_mol(molfile.stringify(struct, // eslint-disable-line no-undef
			{ ignoreErrors: true }));
		const res = JSON.parse(mol.get_stereo_tags());
		dispatch(calculateCip(res));
	};
}

export function calculateCip(result) {
	return (dispatch, getState) => {
		const state = getState();
		const editor = state.editor;
		const restruct = editor.render.ctab;
		const atomsIterator = restruct.molecule.atoms.keys();
		const keys = [...atomsIterator];
		const attributes = {
			absolute: false,
			attached: false,
			context: 'Atom',
			fieldName: 'CIP_DESC',
			fieldValue: '(R)',
			init: true
		};
		const action = new Action();
		deleteAllSGroupsWithName(restruct, action, attributes.fieldName);
		result.CIP_atoms.forEach((a) => {
			const atomIdx = keys[a[0]];
			const atom = restruct.molecule.atoms.get(atomIdx);
			attributes.fieldValue = a[1];
			action.mergeWith(fromSgroupAddition(restruct, 'DAT', [atomIdx], attributes, undefined, atom.pp));
		});
		result.CIP_bonds.forEach((b) => {
			const atom1Idx = keys[b[0]];
			const atom2Idx = keys[b[1]];
			const atom1 = restruct.molecule.atoms.get(atom1Idx);
			const atom2 = restruct.molecule.atoms.get(atom2Idx);
			attributes.fieldValue = b[2];
			const pp = new Vec2((atom1.pp.x + atom2.pp.x) * 0.5,
				(atom1.pp.y + atom2.pp.y) * 0.5);
			action.mergeWith(fromSgroupAddition(restruct, 'DAT', [atom1Idx, atom2Idx], attributes, undefined, pp));
		});
		editor.update(action);
	};
}

function deleteAllSGroupsWithName(restruct, action, fieldName) {
	restruct.molecule.sgroups.forEach((sg, id) => {
		if (sg.data.fieldName === fieldName)
			action.mergeWith(fromSgroupDeletion(restruct, id));
	});
}

function doTransformation(method, mol) {
	switch (method) {
	case 'aromatize':
		return mol.get_aromatic_form();
	case 'dearomatize':
		return mol.get_kekule_form();
	case 'clean':
		return mol.get_new_coords();
	default:
		return '';
	}
}
