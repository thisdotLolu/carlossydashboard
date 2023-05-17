import React, { useContext, useEffect, useState } from "react"
import { Component } from "../../types/Util"
import { formatPrecision, getDecimalPlaces, floorToDP } from "../../util"
import { FormContext } from "../Form/Form"
import Input, { InputProps } from "../Input"

import "./FormNumberInput.css"

export type FormNumberInputProps = InputProps & {
	field: string,
	maxDecimals?: number
}

// let fullNumberRegex = /[0-9]+(\.[0-9]+)?/
let partialNumberRegex = /^[0-9]*\.?[0-9]*$/

const getFullNumberFromPartialNumber = (str: string, prevValue: number): number => {
	str = str.toString()
	if (!partialNumberRegex.test(str)) return prevValue;
	if (str.endsWith(".")) str = str.replace(".", "")
	return parseFloat(str);
}

const FormNumberInput: Component<FormNumberInputProps> = ({ field, maxDecimals = 6, ...others }) => {
	const formContext = useContext(FormContext)
	if (!formContext) throw "FormInputs must be inside a Form component"

	const [ strValue, setStrValue ] = useState<string>(formContext.values[field] ? formContext.values[field] : "")

	const updateFormValue = (newValue: string) => {
		let fullNumber = getFullNumberFromPartialNumber(newValue, formContext.values[field])

		const newValueNum = floorToDP(fullNumber, maxDecimals)
		const newFullNumber = Number.parseFloat(newValueNum)

		const newValueStr = newValueNum ? newValueNum.toString() + (newValue.endsWith(".") ? "." : "") : ""

		if (!Number.isNaN(newFullNumber)) formContext.updateValue(field, newFullNumber)
		else {
			setStrValue("")
			formContext.updateValue(field, 0)
		}

		if (partialNumberRegex.test(newValue) && newValue !== "") {
			setStrValue(newValueStr)
		}
	}

	const updateStrValue = () => {
		let newValue = floorToDP(formContext.values[field].toString(), maxDecimals)
		setStrValue(
			newValue
		)
	}

	useEffect(() => {
		let newValue = 0;
		if (strValue && partialNumberRegex.test(strValue)) newValue = Number.parseFloat(strValue)

		formContext.updateValue(field, newValue)
	}, [])

	useEffect(() => {
		let fullNumber = getFullNumberFromPartialNumber(strValue || "", 0)
		if (fullNumber !== formContext.values[field]) {
			if (formContext.values[field] === 0 && strValue === "") return;
			updateStrValue()
		}
	}, [formContext.values])

	return (
		<Input
			{...others}
			value={strValue}
			onInput={(e) => {
				updateFormValue(e.currentTarget.value)
			}}
			error={!!formContext.errors[field]}
			hintText={formContext.errors[field] || undefined}
			onBlur={() => {
				updateStrValue()
				if (!formContext.values[field]) return;
				formContext.updateChanged(field, true)
			}}
		/>
	)
}

export default FormNumberInput