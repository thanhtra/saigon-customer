const Checkbox = ({ label, name, onChange, disabled, checked, type }) => {
	return (
		<label htmlFor={label + '-' + name} className={`checkbox ${type === 'small' ? 'small' : ''}`}>
			<input name={name} onChange={onChange} type="checkbox" id={label + '-' + name} disabled={disabled} checked={checked} />
			<span className="checkbox-check"></span>
			<p>{label}</p>
		</label>
	);
}

export default Checkbox;