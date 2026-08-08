type Table = Record<string, unknown>;

export default function reconcile(target: object, template: object): object {
	const t = target as Table;
	const tmpl = template as Table;

	for (const [key, value] of pairs(tmpl))
		if (typeOf(key) === 'string')
			if (t[key] === undefined) t[key] = typeOf(value) === 'table' ? deepCopy(value as Table) : value;
			else if (typeOf(t[key]) === 'table' && typeOf(value) === 'table')
				reconcile(t[key] as Table, value as Table);

	return target;
}

function deepCopy(original: Table): Table {
	const copy: Table = {};
	for (const [key, value] of pairs(original))
		copy[key as string] = typeOf(value) === 'table' ? deepCopy(value as Table) : value;

	return copy;
}
