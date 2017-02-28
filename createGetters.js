'use strict'
let createGetters = (() => {
	const structRegex = /type(?:\s*)(\w+)(?:\s*)struct(?:\s*)\{([\s\S]*)\}/mg
	const attributeRegex = /(\w+)(?:\s*)([\w\[\]\d]+)(?:.*)$/mg

	function getStructInformation(declaration) {
		let structName = '', structContentRaw = '', structContent = []
		declaration.replace(structRegex, (_, name, attributes) => {
			structName = name
			structContentRaw = attributes
		})
		let attributes = structContentRaw.match(attributeRegex)
		if (!attributes) {
			return {
				name: structName,
				attributes: []
			}
		}
		attributes.forEach(attribute => {
			attribute.replace(attributeRegex, (_, attributeName, attributeType) => {
				structContent.push({
					name: attributeName,
					type: attributeType
				})
			})
		})
		return {
			name: structName,
			attributes: structContent
		}
	}

	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}

	function createGetters(declaration) {
		// Creates the getters for a structure.
		let info = getStructInformation(declaration)
		let gettersStr = ''
		let firstLetter = info.name[0].toLowerCase()
		let interfaceMethods = []
		info.attributes.forEach(attribute => {
			gettersStr += `func (${firstLetter} ${info.name}) Get${capitalize(attribute.name)}() ${attribute.type} {\n\treturn ${firstLetter}.${attribute.name}\n}\n\n`
			interfaceMethods.push({ methodName: `Get${capitalize(attribute.name)}`, methodReturnType: attribute.type })
		})
		if (gettersStr.length === 0) gettersStr = '<em>No attributes to expose.</em>'
		let interfaceMethodsStr = interfaceMethods.map(m => { return `${m.methodName}() ${m.methodReturnType}` }).reduce((a,b) => { return a + '\n' + b }, '')
		let interfaceStr = `type ${capitalize(info.name)} interface {\n` + interfaceMethodsStr + `}\n`
		let finalObject = {
			valid: true,
			getters: gettersStr,
			interface: interfaceStr
		}
		return finalObject
	}
	return createGetters
}) ()
